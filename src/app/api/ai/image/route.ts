import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

// Only officially supported, non-experimental image generation model for this project.
const IMAGE_MODEL = "gpt-image-1" as const;

const ALLOWED_SIZES = new Set(["auto", "1024x1024", "1536x1024", "1024x1536"]);

// Image generation is expensive; keep the request body small (a 4000-char prompt
// plus JSON overhead comfortably fits well under this).
const MAX_BODY_BYTES = 20_000;
const MAX_PROMPT_LENGTH = 4000;

// Single OpenAI client per server process. `timeout`/`maxRetries` are set here so
// every call is bounded — an unbounded upstream hang would otherwise tie up the
// request indefinitely. The SDK retries transient failures (network errors, 5xx,
// 429) internally with exponential backoff before we ever see them.
const REQUEST_TIMEOUT_MS = 60_000;
const OPENAI_MAX_RETRIES = 2;
let cachedClient: OpenAI | null = null;
function getOpenAIClient(apiKey: string): OpenAI {
  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey, timeout: REQUEST_TIMEOUT_MS, maxRetries: OPENAI_MAX_RETRIES });
  }
  return cachedClient;
}

// In-memory per-IP rate limit. This resets on server restart and is only
// correct for a single Node process — if this endpoint is ever deployed across
// multiple serverless instances, replace with a shared store (e.g. Redis)
// before relying on it for cost protection.
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitStore = new Map<string, { count: number; windowStart: number }>();

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();

  // Opportunistic cleanup so the map doesn't grow unbounded over the life of the process.
  for (const [key, entry] of rateLimitStore) {
    if (now - entry.windowStart >= RATE_LIMIT_WINDOW_MS * 10) {
      rateLimitStore.delete(key);
    }
  }

  const entry = rateLimitStore.get(ip);
  if (!entry || now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return { allowed: true };
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.windowStart + RATE_LIMIT_WINDOW_MS - now) / 1000),
    };
  }
  entry.count += 1;
  return { allowed: true };
}

// Global cap independent of per-IP limiting — bounds worst-case OpenAI spend even if
// requests are spread across many different IPs. Same single-process caveat as above;
// configurable via env so ops can tune it without a code change.
const GLOBAL_DAILY_LIMIT = Number(process.env.AI_IMAGE_DAILY_LIMIT ?? 200);
const DAY_MS = 24 * 60 * 60 * 1000;
let dailyCount = 0;
let dailyWindowStart = Date.now();

function checkGlobalDailyLimit(): { allowed: boolean } {
  const now = Date.now();
  if (now - dailyWindowStart >= DAY_MS) {
    dailyWindowStart = now;
    dailyCount = 0;
  }
  if (dailyCount >= GLOBAL_DAILY_LIMIT) {
    return { allowed: false };
  }
  dailyCount += 1;
  return { allowed: true };
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

// Strips ASCII control/invisible characters (keeps normal whitespace: tab, newline,
// carriage return) before the prompt is sent upstream or written to logs.
function sanitizePrompt(raw: string): string {
  let result = "";
  for (const ch of raw) {
    const code = ch.codePointAt(0) ?? 0;
    const isAllowedWhitespace = code === 9 || code === 10 || code === 13; // \t \n \r
    const isControl = code <= 31 || code === 127;
    if (isControl && !isAllowedWhitespace) continue;
    result += ch;
  }
  return result.trim();
}

// Internal tool for the future AI Content Studio — not for production traffic.
function assertDevEnvironment() {
  return process.env.NODE_ENV !== "production";
}

type LogFields = Record<string, string | number | boolean | null | undefined>;

// JSON logs so a log aggregator (CloudWatch, Datadog, etc.) can parse/query by field
// instead of grepping free text. Never log the raw prompt — only its length — since
// it may contain sensitive marketing/product content.
function log(level: "info" | "warn" | "error", event: string, fields: LogFields = {}) {
  const line = JSON.stringify({
    level,
    event,
    route: "api/ai/image",
    timestamp: new Date().toISOString(),
    ...fields,
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

// Maps upstream OpenAI failures to a generic, user-safe Spanish message. The raw
// OpenAI error (which may reference quotas, moderation internals, etc.) is only
// ever written to the server log, never returned to the client.
function friendlyErrorMessage(status: number | undefined): string {
  if (status === 400) return "El prompt no pudo procesarse. Intenta reformularlo.";
  if (status === 401 || status === 403) return "Error de autenticación con el proveedor de IA.";
  if (status === 429) return "El servicio de generación de imágenes está saturado. Inténtalo en unos minutos.";
  if (status && status >= 500) return "El servicio de generación de imágenes no está disponible. Inténtalo más tarde.";
  return "No se pudo generar la imagen. Inténtalo de nuevo.";
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();

  if (!assertDevEnvironment()) {
    return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    log("error", "missing_api_key", { requestId });
    return NextResponse.json(
      { error: "OPENAI_API_KEY no está configurada en el servidor." },
      { status: 500 }
    );
  }

  const ip = getClientIp(request);

  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    log("warn", "rate_limited", { requestId, ip });
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Inténtalo de nuevo en unos minutos." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 60) } }
    );
  }

  const globalLimit = checkGlobalDailyLimit();
  if (!globalLimit.allowed) {
    log("warn", "daily_limit_reached", { requestId, ip, limit: GLOBAL_DAILY_LIMIT });
    return NextResponse.json(
      { error: "Se alcanzó el límite diario de generación de imágenes. Inténtalo de nuevo mañana." },
      { status: 429 }
    );
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: "Cuerpo de la solicitud inválido." }, { status: 400 });
  }

  if (rawBody.length > MAX_BODY_BYTES) {
    log("warn", "body_too_large", { requestId, ip, bytes: rawBody.length });
    return NextResponse.json({ error: "La solicitud es demasiado grande." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Cuerpo de la solicitud inválido." }, { status: 400 });
  }

  const { prompt, size } = (body ?? {}) as { prompt?: unknown; size?: unknown };

  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return NextResponse.json({ error: "El prompt es obligatorio." }, { status: 400 });
  }

  const sanitizedPrompt = sanitizePrompt(prompt);
  if (sanitizedPrompt.length === 0) {
    return NextResponse.json({ error: "El prompt es obligatorio." }, { status: 400 });
  }
  if (sanitizedPrompt.length > MAX_PROMPT_LENGTH) {
    return NextResponse.json(
      { error: `El prompt es demasiado largo (máximo ${MAX_PROMPT_LENGTH} caracteres).` },
      { status: 400 }
    );
  }

  const selectedSize = typeof size === "string" && ALLOWED_SIZES.has(size) ? size : "1024x1024";

  log("info", "generation_start", {
    requestId,
    ip,
    promptLength: sanitizedPrompt.length,
    size: selectedSize,
  });

  const client = getOpenAIClient(apiKey);

  try {
    const response = await client.images.generate({
      model: IMAGE_MODEL,
      prompt: sanitizedPrompt,
      size: selectedSize as OpenAI.Images.ImageGenerateParams["size"],
      n: 1,
    });

    const image = response.data?.[0];
    if (!image?.b64_json) {
      log("error", "empty_response", { requestId, ip });
      return NextResponse.json(
        { error: "OpenAI no devolvió una imagen." },
        { status: 502 }
      );
    }

    log("info", "generation_success", { requestId, ip, latencyMs: Date.now() - startedAt });

    return NextResponse.json({
      image: `data:image/png;base64,${image.b64_json}`,
      revisedPrompt: image.revised_prompt ?? null,
      model: IMAGE_MODEL,
      size: selectedSize,
    });
  } catch (error) {
    const latencyMs = Date.now() - startedAt;

    if (error instanceof OpenAI.APIConnectionTimeoutError) {
      log("error", "timeout", { requestId, ip, latencyMs });
      return NextResponse.json(
        { error: "La generación tardó demasiado. Inténtalo de nuevo." },
        { status: 504 }
      );
    }

    const status = error instanceof OpenAI.APIError ? error.status ?? 500 : 500;
    const message = friendlyErrorMessage(status);

    log("error", "generation_failed", {
      requestId,
      ip,
      latencyMs,
      status,
      upstreamMessage: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: message }, { status });
  }
}
