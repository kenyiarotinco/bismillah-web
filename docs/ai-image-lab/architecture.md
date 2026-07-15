# AI Image Lab — Architecture & Technical Reference

## Architecture Overview

### Component relationships

```
┌─────────────────────────────────────────────────────────────────┐
│  src/app/admin/ai-image-lab/page.tsx   (Server Component)        │
│  - Sets noindex metadata                                         │
│  - process.env.NODE_ENV === "production" → notFound()            │
│  - Renders <AiImageLabClient /> otherwise                        │
└───────────────────────────┬────────────────────────────────────┘
                              │
┌───────────────────────────▼────────────────────────────────────┐
│  AiImageLabClient.tsx   ("use client")                          │
│  - Prompt textarea, size select, generate/copy/download buttons │
│  - Owns loading/error/result state                              │
│  - fetch("/api/ai/image", { prompt, size })                     │
│  - Built entirely from src/presentation/components/uikit         │
│    (Button, Card, Badge, Textarea)                               │
└───────────────────────────┬────────────────────────────────────┘
                              │ POST JSON { prompt, size }
┌───────────────────────────▼────────────────────────────────────┐
│  src/app/api/ai/image/route.ts   (Route Handler, runtime=nodejs)│
│  - Independently re-checks NODE_ENV (does not trust the page)   │
│  - Rate limit → daily cap → validate → sanitize → call OpenAI   │
└───────────────────────────┬────────────────────────────────────┘
                              │ client.images.generate(...)
┌───────────────────────────▼────────────────────────────────────┐
│  OpenAI SDK (openai@6.x)  →  OpenAI Images API (gpt-image-1)    │
└────────────────────────────────────────────────────────────────┘
```

The route and the page enforce the production gate **independently**. The page's gate
only stops browser navigation; the route's gate is what actually protects the endpoint,
since it can be hit directly regardless of what UI does or doesn't render it.

### Request flow (happy path)

1. Staff member opens `/admin/ai-image-lab` in a non-production environment.
2. Types a prompt, optionally changes size, clicks **Generar imagen**.
3. Client sets `loading = true`, `POST`s `{ prompt, size }` as JSON to `/api/ai/image`.
4. Route handler runs its checks in order (see below), calls OpenAI, and returns:
   ```json
   {
     "image": "data:image/png;base64,....",
     "revisedPrompt": "..." | null,
     "model": "gpt-image-1",
     "size": "1024x1024"
   }
   ```
5. Client renders the image inline (`<img src={data URI}>`), shows the revised prompt (if
   any), and a download link (`<a download>` pointing at the same data URI — no extra
   round-trip).

### API flow (all checks, in order)

```
POST /api/ai/image
  │
  ├─ 1. Environment gate         → 404 if NODE_ENV === "production"
  ├─ 2. API key present?         → 500 if OPENAI_API_KEY missing
  ├─ 3. Per-IP rate limit        → 429 (+ Retry-After) if exceeded
  ├─ 4. Global daily cap         → 429 if exceeded
  ├─ 5. Body size check          → 413 if raw body > 20,000 bytes
  ├─ 6. JSON parse                → 400 if malformed
  ├─ 7. Prompt present & typed   → 400 if missing/empty
  ├─ 8. Prompt sanitization      → 400 if empty after stripping control chars
  ├─ 9. Prompt length            → 400 if > 4000 chars
  ├─ 10. Size allow-list         → falls back to "1024x1024" if invalid (never errors)
  │
  ├─ 11. Call OpenAI (gpt-image-1, n=1, 60s timeout, 2 retries)
  │        ├─ success + image data  → 200, returns image
  │        ├─ success, no image     → 502
  │        ├─ timeout                → 504
  │        └─ APIError / unknown     → mapped status, friendly message
  │
  └─ 12. Structured JSON log line at every exit point
```

### Security architecture

| Layer | Mechanism |
|---|---|
| Environment gate | Both `page.tsx` and `route.ts` independently check `NODE_ENV`. The route's check is authoritative — it protects the endpoint even if it were ever linked to from somewhere else. |
| Rate limiting | Per-IP: 5 requests / 5 minutes, in-memory `Map`. Prevents a single actor from burning API spend. |
| Cost cap | Global daily counter (`AI_IMAGE_DAILY_LIMIT`, default 200/day), independent of IP — bounds worst-case spend even under IP rotation. |
| Input validation | Type checks, JSON parse guard, request body size cap (20KB), prompt length cap (4000 chars), size allow-list. |
| Prompt sanitization | Strips ASCII control/invisible characters (keeps `\t`/`\n`/`\r`) before the prompt reaches OpenAI or logs. |
| No secret exposure | `OPENAI_API_KEY` is read server-side only (`process.env`), never sent to the client, never included in responses or logs. |
| No upstream leakage | On failure, only a generic mapped Spanish message goes to the client. The real OpenAI error (which can include quota/org/moderation details) is written to the server log only. |
| No auth (gap) | There is no session/user-level authentication on the route. Safety currently rests entirely on the environment gate — see [production-readiness.md](./production-readiness.md) for why this blocks production use. |

---

## AI Image Endpoint (`POST /api/ai/image`)

### Request lifecycle

Every request gets a `requestId` (`crypto.randomUUID()`) generated at the top of `POST()`,
attached to every log line for that request, so a single generation can be traced
end-to-end in log output even under concurrent traffic.

### Validation flow

Executed in this exact order (each is a hard stop — first failure wins):

1. `typeof prompt === "string"` and non-empty after `.trim()` → else `400`.
2. `sanitizePrompt(prompt)` strips control characters; if the result is empty → `400`.
3. `sanitizedPrompt.length > 4000` → `400` with the limit in the message.
4. `size`, if provided, must be one of `auto | 1024x1024 | 1536x1024 | 1024x1536` — any
   other value (or absence) silently falls back to `1024x1024` rather than erroring, since
   size is a UI convenience, not a security-relevant input.

### Rate limiting

- **Per-IP:** `RATE_LIMIT_MAX_REQUESTS = 5` per `RATE_LIMIT_WINDOW_MS = 5 minutes`,
  tracked in an in-memory `Map<ip, { count, windowStart }>`. IP is read from
  `x-forwarded-for` (first entry) or `x-real-ip`, falling back to `"unknown"`.
  Blocked requests get `429` with a `Retry-After` header (seconds until the window
  resets).
- **Cleanup:** on every call, entries older than 10× the window are opportunistically
  deleted so the map doesn't grow unbounded over the life of the process.
- **Known limitation:** this is correct only within a single Node process. On a
  horizontally-scaled deployment (e.g. Vercel serverless functions), each instance has
  its own map — see [production-readiness.md](./production-readiness.md), blocker #1.

### Timeout handling

The OpenAI client is constructed once per process (`getOpenAIClient`, memoized in
`cachedClient`) with `timeout: 60_000` (60s). If OpenAI doesn't respond in time, the SDK
throws `OpenAI.APIConnectionTimeoutError`, which the route catches explicitly and maps to
`504` with a friendly message — distinct from the generic error branch.

### Retry strategy

The client is also constructed with `maxRetries: 2`. This is the official OpenAI SDK's
built-in retry behavior: transient failures (network errors, `429`, `5xx`) are retried
automatically with exponential backoff and jitter *before* the route's own `catch` block
ever sees them. The route does not implement its own retry loop — it relies on the SDK.

### Logging

All logging goes through a single `log(level, event, fields)` helper that emits one JSON
line per call:

```json
{"level":"info","event":"generation_success","route":"api/ai/image","timestamp":"2026-07-15T12:00:00.000Z","requestId":"...","ip":"1.2.3.4","latencyMs":4213}
```

- **Why JSON:** structured fields are queryable in a log aggregator (Vercel's log drain,
  CloudWatch, Datadog, ...) instead of requiring regex over free text.
- **Never logs the raw prompt** — only `promptLength` — since prompts may contain
  sensitive unreleased product/marketing content.
- **Events emitted:** `missing_api_key`, `rate_limited`, `daily_limit_reached`,
  `body_too_large`, `generation_start`, `generation_success`, `empty_response`, `timeout`,
  `generation_failed`.

### Cost protection

Layered, in order of how early they short-circuit a request (cheapest checks first):

1. Per-IP rate limit (5 / 5 min).
2. Global daily cap (200 / day default, `AI_IMAGE_DAILY_LIMIT` env override).
3. Request body size cap (20,000 bytes) — rejects oversized payloads before they're even
   JSON-parsed.
4. Prompt length cap (4000 chars) — well under OpenAI's own 32,000-char limit for
   `gpt-image-1`, chosen deliberately conservative for cost control.
5. `n: 1` is hardcoded — a request can never ask for more than one image.
6. The model is hardcoded to `gpt-image-1` (see `IMAGE_MODEL` constant) — no
   client-supplied model, no access to costlier/experimental models.
7. `size` is allow-listed to 4 fixed values — no arbitrary custom resolutions.

### Error mapping

| Condition | Status | Client-facing message | What's logged |
|---|---|---|---|
| Not a dev environment | 404 | `"No encontrado."` | — |
| Missing `OPENAI_API_KEY` | 500 | Explicit config error (internal tool, safe to say) | `missing_api_key` |
| Rate limited | 429 | `"Demasiadas solicitudes..."` + `Retry-After` header | `rate_limited` |
| Daily cap reached | 429 | `"Se alcanzó el límite diario..."` | `daily_limit_reached` |
| Body too large | 413 | `"La solicitud es demasiado grande."` | `body_too_large` |
| Malformed JSON | 400 | `"Cuerpo de la solicitud inválido."` | — |
| Missing/empty prompt | 400 | `"El prompt es obligatorio."` | — |
| Prompt too long | 400 | Includes the 4000-char limit | — |
| OpenAI returned no image | 502 | `"OpenAI no devolvió una imagen."` | `empty_response` |
| OpenAI timeout | 504 | `"La generación tardó demasiado..."` | `timeout` (with latency) |
| OpenAI `APIError` | mapped by `error.status` (400/401/403/429/5xx) | Generic Spanish message per status — **never** the raw OpenAI message | `generation_failed` (raw upstream message + status) |
| Any other thrown error | 500 | Generic fallback message | `generation_failed` |

`friendlyErrorMessage(status)` is the single place this mapping lives — the raw
`error.message` from OpenAI is deliberately never sent to the client (it can contain
quota figures, org IDs, or moderation details).

---

## Environment Variables

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `OPENAI_API_KEY` | **Yes** | — | OpenAI credential, read server-side only via `process.env`. Route returns `500` if unset. Already present in `.env` for local dev. |
| `AI_IMAGE_DAILY_LIMIT` | No | `200` | Global daily generation cap, independent of per-IP limiting. Parsed with `Number(...)`; set to tune cost exposure without a code change. |
| `NODE_ENV` | Implicit (set by Next.js tooling) | — | Controls the production gate. `"production"` → both the page (`notFound()`) and the route (`404` JSON) refuse to serve. Not something you set manually in this project — it's set by `next build`/`next start` vs. `next dev`. |

No other feature-specific environment variables exist. The endpoint does not read or
require any Vercel-specific, Redis, or auth-related env vars yet — those are Phase 2
concerns (see [phase-2-architecture.md](./phase-2-architecture.md)).

---

## Testing

### Automated tests

`src/app/api/ai/image/route.test.ts` — 16 tests, run via `npm test` (Vitest).
The OpenAI SDK is mocked with `vi.mock("openai")` (a hoisted mock class exposing
`images.generate` plus mock `APIError`/`APIConnectionTimeoutError` classes), so the suite
never makes a real network call and runs in well under a second.

Covered scenarios:

- Production gate returns `404`.
- Missing `OPENAI_API_KEY` returns `500` without calling OpenAI.
- Malformed JSON body → `400`.
- Oversized body (>20KB) → `413`, OpenAI never called.
- Missing/empty prompt → `400`.
- Prompt that sanitizes to empty (control chars only) → `400`.
- Prompt over 4000 chars → `400` with the limit quoted.
- Invalid `size` silently falls back to `1024x1024` (verified against the actual
  `images.generate` call args).
- Successful generation returns the expected response shape.
- Empty `data` array from OpenAI → `502`.
- Timeout error → `504`, and the friendly message does **not** contain the raw
  `"timed out"` string.
- `APIError` with upstream text containing quota/org details → mapped status, and the
  response body does **not** contain that upstream text.
- Unknown thrown error (e.g. a raw `Error` with an IP address in the message) → `500`,
  response body does not leak that detail.
- Per-IP rate limit: 5 requests succeed, 6th from the same IP is `429` with a
  `Retry-After` header.
- A different IP is unaffected by another IP's rate limit.
- Global daily cap: with `AI_IMAGE_DAILY_LIMIT=2` (via a fresh module import), the 3rd
  request across different IPs is blocked — proving the cap is IP-independent.

### Manual verification (performed this session)

Three real generations were run against the live OpenAI API through the actual browser
UI (not mocked) at each stage of development:

1. Initial implementation — `gpt-image-1`, `1024x1024` → `200 OK`, image rendered,
   download link worked.
2. After simplifying the model selector to a single hardcoded model → confirmed again,
   `200 OK`.
3. After the full hardening pass (rate limiting, structured logging, cost caps, friendly
   errors) — confirmed the real flow still works end-to-end: valid `data:image/png;base64,...`
   rendered in the page, network tab showed `200 OK`.

`npm run build` was also used to confirm the production gate is baked in correctly: the
`/admin/ai-image-lab` route is prerendered as a **static 404** (`.next/server/app/admin/ai-image-lab.meta`
shows `"status": 404`) when built with `NODE_ENV=production`, and `/api/ai/image` is
listed as a dynamic (`ƒ`) route that independently 404s at request time.

### Expected responses (reference)

Success:
```json
{ "image": "data:image/png;base64,...", "revisedPrompt": null, "model": "gpt-image-1", "size": "1024x1024" }
```

Validation failure:
```json
{ "error": "El prompt es obligatorio." }
```

Rate limited:
```json
{ "error": "Demasiadas solicitudes. Inténtalo de nuevo en unos minutos." }
```
Headers: `Retry-After: <seconds>`

### Failure scenarios covered

Missing API key, malformed/oversized request body, invalid/missing/too-long prompt,
invalid size (non-fatal fallback), OpenAI timeout, OpenAI error at any status code,
empty OpenAI response, per-IP and global-daily rate exhaustion, non-dev environment
access.
