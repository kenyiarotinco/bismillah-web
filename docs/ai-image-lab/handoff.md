# Engineering Handoff — AI Image Lab (Phase 1)

**Purpose of this document:** a new senior engineer should be able to read this file
alone and know exactly where the project stands, what's safe to touch, and what to do
next — without needing to ask anyone or dig through chat history.

## Current project status

**BISMILLAH** is a Next.js 16 (App Router, Turbopack) marketing/e-commerce site for a
wellness supplement brand, deployed to `bismillah.com.pe` via Vercel (remote:
`github.com/kenyiarotinco/bismillah-web.git`, branch
`feature/catalogo-real-y-secciones-nuevas` at last check).

Within that site, **Phase 1 of an "AI Image Lab" feature is complete**: an internal,
dev-only tool at `/admin/ai-image-lab` that generates images via OpenAI's `gpt-image-1`
model. It is explicitly **not enabled in production** — both the page and the API route
independently 404 whenever `NODE_ENV === "production"`, verified against an actual
`next build` output. This is a deliberate, current decision, not a bug: the feature
is fully built and hardened, but two Critical-severity blockers (see below) must be
closed before it's safe to expose to real traffic.

## Completed work (Phase 1)

1. **API route** — `POST /api/ai/image` ([route.ts](../../src/app/api/ai/image/route.ts)):
   calls the OpenAI Images API (`gpt-image-1` only, hardcoded), with input validation,
   prompt sanitization, per-IP rate limiting (5/5min), a global daily cost cap (200/day,
   env-configurable), a 60s timeout, the SDK's built-in retry policy, structured JSON
   logging, and friendly (non-leaking) error messages mapped by status code.
2. **UI** — `/admin/ai-image-lab` ([page.tsx](../../src/app/admin/ai-image-lab/page.tsx) +
   [AiImageLabClient.tsx](../../src/app/admin/ai-image-lab/AiImageLabClient.tsx)): prompt
   textarea, size selector, generate/copy-prompt/download buttons, loading and error
   states, built entirely from the existing `uikit` design system.
3. **New design-system primitive** — `Textarea` added to
   [src/presentation/components/uikit](../../src/presentation/components/uikit/Textarea.tsx),
   following the existing `Input` pattern, exported via the `uikit` barrel.
4. **Unit tests** — 16 tests in
   [route.test.ts](../../src/app/api/ai/image/route.test.ts), Vitest, OpenAI SDK fully
   mocked. `npm test` runs them.
5. **Test infrastructure** — Vitest added as a dev dependency (`vitest.config.ts`,
   `test`/`test:watch` scripts in `package.json`). This is the **first** automated test
   setup in this repo — there were no tests of any kind before this feature.
6. **Manual verification** — three real end-to-end generations against the live OpenAI
   API through the actual browser UI, at three different points in the hardening
   process, each confirmed `200 OK` with a real rendered image.
7. **This documentation set** — [docs/ai-image-lab/](./README.md): architecture,
   tech debt register, production readiness re-evaluation, Phase 2 architecture
   proposal, and this handoff.

## Remaining work

Nothing is required to keep the feature as-is (internal/dev-only). If/when the decision
is made to move toward production, in priority order:

1. **Redis-backed distributed rate limiting** (replaces in-memory `Map`/counters) —
   Critical, see tech-debt C1 / blocker B1.
2. **Real authentication** on the route and page (replaces the `NODE_ENV` check as the
   only access control) — Critical, see tech-debt C2 / blocker B2.
3. **CI pipeline** (GitHub Actions running lint/test/build on PRs) — High, see
   tech-debt H1 / blocker B3.
4. Everything in [phase-2-architecture.md](./phase-2-architecture.md) — Asset History,
   Prompt Library, Brand Presets, Product/Marketing generators, Usage Analytics — is
   **designed but not implemented**. Do not assume any of it exists.
5. One small, unrelated cleanup item was noticed during this work and is **not part of
   this feature**: `npm run lint` currently fails repo-wide due to 3 pre-existing errors
   in `Testimonials.tsx` and `Input.tsx` (predate this feature entirely — see tech-debt
   L1). Worth a 30-minute cleanup PR, but out of scope here.

## Architecture decisions (and why)

- **Model locked to `gpt-image-1`, no selector.** The feature originally had a 5-model
  dropdown (gpt-image-1/1-mini/1.5, dall-e-2/3). The user explicitly asked to simplify to
  "only officially supported, non-experimental" models and collapse to one if
  appropriate — `gpt-image-1` is OpenAI's current flagship, GA image model, so it's the
  only one exposed. Adding model choice back is a Phase 2 decision, not an oversight.
- **Environment gate over feature flag, for now.** The endpoint is disabled via
  `NODE_ENV === "production"` rather than an explicit env var toggle. This was the
  simplest correct choice for "internal dev-only tool" and was validated by the user
  ("keep it as an internal dev tool, do not enable in production yet"). Phase 2's
  Production Deployment design proposes replacing this with an explicit
  `AI_STUDIO_ENABLED` flag + auth, once auth exists — don't make that switch without
  auth landing first.
- **In-memory rate limiting, deliberately, for Phase 1.** Known not to be
  production-correct on Vercel's serverless model (see tech-debt C1). Chosen anyway
  for Phase 1 because the feature is disabled in production regardless, so the
  limitation is currently inert. Do not treat this as "the rate limiting is broken" —
  it's scoped-correctly for what Phase 1 needed to prove.
- **Raw upstream error messages never reach the client.** `friendlyErrorMessage(status)`
  maps every OpenAI failure to a generic Spanish message; the real error (which can
  contain quota/org/moderation details) is server-logged only. This was a deliberate
  hardening decision, not the SDK's default behavior.
- **Images returned as base64 data URIs, not stored anywhere.** Correct for Phase 1's
  scope (prove the generation pipeline works) but explicitly insufficient for a real
  workflow — see tech-debt H2 and the Asset History design in Phase 2.
- **Split `page.tsx` / `AiImageLabClient.tsx`.** Required because the page needs
  server-only capabilities (`notFound()`, `Metadata`) that can't live in a `"use client"`
  component. This is the first page in the repo built this way — the existing
  `src/app/page.tsx` is a single `"use client"` component with no server-side gate,
  because it never needed one.

## Dependencies

New dependency introduced this phase: `vitest` (dev dependency only, `^4.1.10`). No
production dependencies were added — `openai@^6.47.0` was already installed before this
work began. No database, no object storage, no auth library exist in this repo yet;
all three are required for Phase 2 (see that document for proposed choices).

## Risks

- **The two Critical blockers are load-bearing, not cosmetic.** If someone removes the
  `NODE_ENV` gate without also fixing distributed rate limiting and adding auth, the
  feature becomes an unauthenticated, effectively-unlimited-under-distributed-load
  OpenAI cost sink on a live production domain. Treat "remove the production gate" as a
  change that requires the same review rigor as a payments change.
- **`AI_IMAGE_DAILY_LIMIT` and the per-IP limiter reset on every cold start/redeploy.**
  Even in a hypothetical single-instance deployment, a redeploy zeroes both counters.
  Not dangerous today (feature is off), but worth remembering when reasoning about "how
  many images could actually get generated" in any interim state.
- **No one owns the OpenAI bill today.** There's no alerting tied to actual OpenAI
  dashboard spend, only to this feature's own request counters. If the feature is
  enabled in production before Phase 2's Usage Analytics exists, treat OpenAI's own
  usage dashboard as the real backstop, not this code's counters alone.

## Recommendations

1. Don't build individual Phase 2 subsystems piecemeal before Redis rate limiting and
   auth land — those two are prerequisites nearly everything else in Phase 2 depends on
   (every new `/api/studio/*` route needs both from day one).
2. Pick the database and object storage provider once, up front (Phase 2 doc recommends
   Vercel Postgres + Vercel Blob as the lowest-friction choices given the existing
   Vercel deployment) rather than letting each subsystem introduce its own.
3. Fold the L1 lint cleanup into whatever PR adds CI (B3) — the CI's lint step will
   immediately fail otherwise, and it's a quick fix.
4. When Phase 2 work begins, extend this same `docs/ai-image-lab/` documentation
   pattern (or rename the directory to `docs/ai-content-studio/` at that point) rather
   than starting a new, disconnected doc set.

## Next milestones

1. Close blocker B1 (Redis rate limiting) and B2 (authentication) together — they're
   the shared foundation for both "safely enable Phase 1 as-is" and "start Phase 2."
2. Add CI (B3).
3. Decide DB + object storage provider; stand up the `assets`, `prompts`, and
   `brand_presets` tables.
4. Build Asset History first among the Phase 2 UI subsystems — every other generator
   subsystem writes to it, so it should exist before Product Image Generator or
   Marketing Asset Generator ship.
5. Revisit the `NODE_ENV` gate → `AI_STUDIO_ENABLED` + auth switch only after 1–3 are
   done, per the Phase 2 Production Deployment sequence.

## Where to look for detail

- [architecture.md](./architecture.md) — full request/API flow, security architecture,
  endpoint internals, environment variables, testing.
- [tech-debt.md](./tech-debt.md) — every known gap, categorized, with complexity
  estimates.
- [production-readiness.md](./production-readiness.md) — the eight-dimension scoring
  and full blocker list with priorities.
- [phase-2-architecture.md](./phase-2-architecture.md) — proposed (unbuilt) design for
  every Phase 2 subsystem.
