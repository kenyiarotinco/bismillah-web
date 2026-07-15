"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Textarea,
  Badge,
} from "../../../presentation/components/uikit";
import { cn } from "../../../presentation/components/uikit/utils";

// Only officially supported, non-experimental model for this project — see api/ai/image/route.ts.
const MODEL_LABEL = "GPT Image 1";

const SIZE_OPTIONS = [
  { value: "1024x1024", label: "1024×1024 (cuadrado)" },
  { value: "1536x1024", label: "1536×1024 (horizontal)" },
  { value: "1024x1536", label: "1024×1536 (vertical)" },
  { value: "auto", label: "Auto" },
];

interface GenerateResult {
  image: string;
  revisedPrompt: string | null;
  model: string;
  size: string;
  fileName: string;
}

export default function AiImageLabClient() {
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, size }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "No se pudo generar la imagen.");
      }

      setResult({
        ...(data as Omit<GenerateResult, "fileName">),
        fileName: `bismillah-ai-image-${Date.now()}.png`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyPrompt() {
    if (!prompt.trim()) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("No se pudo copiar el prompt al portapapeles.");
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">AI Image Lab</h1>
          <Badge variant="secondary">Interno · Solo desarrollo</Badge>
        </div>
        <p className="text-sm text-secondary-foreground/80">
          Herramienta interna para probar la generación de imágenes con OpenAI. Base para el
          futuro AI Content Studio (imágenes de producto, banners, creativos de Meta Ads y
          material de marketing).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prompt</CardTitle>
          <CardDescription>Describe la imagen que quieres generar.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ej: Frasco de suplemento premium sobre mármol negro, iluminación de estudio, estilo editorial de lujo"
            maxLength={4000}
            disabled={loading}
          />

          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="outline">Modelo: {MODEL_LABEL}</Badge>

            <label className="flex flex-1 min-w-[200px] flex-col gap-1.5 text-sm">
              <span className="font-medium">Tamaño</span>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                disabled={loading}
                className={cn(
                  "flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50 font-sans transition-colors"
                )}
              >
                {SIZE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
              {loading ? "Generando..." : "Generar imagen"}
            </Button>
            <Button variant="outline" onClick={handleCopyPrompt} disabled={!prompt.trim()}>
              {copied ? "¡Copiado!" : "Copiar prompt"}
            </Button>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultado</CardTitle>
          <CardDescription>
            {result ? `${result.model} · ${result.size}` : "La imagen generada aparecerá aquí."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {loading && (
            <div className="flex aspect-square w-full max-w-md items-center justify-center rounded-md border border-border bg-secondary/30 text-sm text-secondary-foreground/70">
              Generando imagen...
            </div>
          )}

          {!loading && result && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.image}
                alt={prompt}
                className="w-full max-w-md rounded-md border border-border"
              />
              {result.revisedPrompt && (
                <p className="text-xs text-secondary-foreground/70">
                  Prompt ajustado por el modelo: &ldquo;{result.revisedPrompt}&rdquo;
                </p>
              )}
              <a
                href={result.image}
                download={result.fileName}
                className="inline-flex h-10 w-fit items-center justify-center rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground"
              >
                Descargar imagen
              </a>
            </>
          )}

          {!loading && !result && (
            <div className="flex aspect-square w-full max-w-md items-center justify-center rounded-md border border-dashed border-border text-sm text-secondary-foreground/50">
              Sin imagen todavía
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
