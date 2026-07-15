# AI Image Lab — Technical Debt Register

Scope: the AI Image Lab feature only (`src/app/api/ai/image/*`, `src/app/admin/ai-image-lab/*`,
`src/presentation/components/uikit/Textarea.tsx`). One cross-cutting item (pre-existing
repo-wide lint errors) is included under Low because it affects this feature's "final
verification" cleanliness even though the offending files aren't part of the feature.

## Critical

### C1. In-memory rate limiting and cost caps are not durable across serverless instances

- **Description:** `checkRateLimit` and `checkGlobalDailyLimit` use module-level
  `Map`/counters. This project deploys to Vercel, where Node route handlers can run
  across multiple isolated instances — each with its own memory. There is no shared
  state, so the "5 requests / 5 min per IP" and "200 / day global" limits are only
  correct within a single warm process.
- **Business impact:** if this endpoint is ever enabled in production without fixing
  this, the cost-protection guarantees in the readiness report do not actually hold —
  a distributed burst of requests could bypass both limits and generate unbounded
  OpenAI spend.
- **Recommended solution:** move both limiters to a shared, low-latency store —
  Upstash Redis is the standard fit for a Vercel deployment (`@upstash/ratelimit` +
  `@upstash/redis`). Sliding-window or token-bucket algorithm, same limits.
- **Complexity:** Medium (~1 day). Mostly swapping the two `check*` functions for
  Redis calls; the call sites in `route.ts` don't need to change shape.
- **Status:** Currently dormant — the route is fully disabled in production via the
  `NODE_ENV` gate, so this cannot be exploited today. **Must be resolved before that
  gate is ever removed.**

### C2. No authentication or authorization on the endpoint

- **Description:** The only thing preventing arbitrary use of `/api/ai/image` is the
  `NODE_ENV === "production"` check. There is no session, API key, or role check
  identifying the caller as authorized staff.
- **Business impact:** if the environment gate is ever removed (or bypassed by
  deploying with a different `NODE_ENV` value) without adding auth, any visitor could
  generate unlimited-looking images subject only to rate limiting, at Bismillah's
  OpenAI cost.
- **Recommended solution:** add a real auth layer before production enablement —
  either reuse an existing staff auth system (none exists yet in this repo) or, at
  minimum, a shared-secret header/cookie gate as a stopgap. See
  [phase-2-architecture.md](./phase-2-architecture.md) for the proposed design.
- **Complexity:** Large (2–4 days) for a real auth system; Small (~2 hours) for a
  shared-secret stopgap.
- **Status:** Dormant for the same reason as C1.

## High

### H1. No CI pipeline

- **Description:** `npm run lint`, `npm test`, and `npm run build` all exist and pass,
  but nothing runs them automatically on push/PR. There's no `.github/workflows/`
  directory in this repo at all.
- **Business impact:** regressions in this feature (or anywhere else) can be merged
  without anyone noticing until a manual check.
- **Recommended solution:** add a GitHub Actions workflow running `npm ci && npm run
  lint && npm test && npm run build` on PRs against `main`.
- **Complexity:** Small (~2 hours).

### H2. Generated images are not persisted

- **Description:** A generated image lives only in React state in the browser tab. A
  refresh loses it; there's no history, no way to revisit a past generation, no way to
  reuse it elsewhere in the site without manually downloading and re-uploading.
- **Business impact:** fine for a "lab" testing tool, but blocks any real production
  workflow (nobody will regenerate the same product photo from scratch every time they
  need it).
- **Recommended solution:** this is explicitly the job of the Phase 2 **Asset History**
  subsystem — see [phase-2-architecture.md](./phase-2-architecture.md). Not a Phase 1
  gap so much as a scope boundary.
- **Complexity:** Large — full Phase 2 subsystem (storage + DB + UI).

## Medium

### M1. No visibility into current rate-limit/daily-cap state

- **Description:** The only way to know how close the daily cap is to being hit is to
  read structured logs for `daily_limit_reached` events after the fact. There's no
  endpoint or dashboard exposing the live counter.
- **Business impact:** low urgency while usage is low and internal-only; becomes an
  operational annoyance ("did we hit the cap today?") as usage grows.
- **Recommended solution:** once C1's Redis migration happens, add a small internal
  `GET /api/ai/image/status` (or fold into Phase 2's Usage Analytics) returning current
  counts.
- **Complexity:** Small (~2–3 hours), naturally bundled with C1's fix.

### M2. `Retry-After` header is only set on the per-IP 429, not the daily-cap 429

- **Description:** `checkRateLimit` returns a `retryAfterSeconds` used to set
  `Retry-After`; `checkGlobalDailyLimit` doesn't compute or return one, so daily-cap
  429s have no `Retry-After` header.
- **Business impact:** cosmetic — a well-behaved client can't auto-schedule a retry
  for the daily-cap case the way it can for the per-IP case. No functional bug.
- **Recommended solution:** compute seconds-until-`dailyWindowStart + DAY_MS` and set
  the header the same way.
- **Complexity:** Small (~15 minutes).

## Low

### L1. Pre-existing repo-wide lint errors (not introduced by this feature)

- **Description:** `npm run lint` currently exits non-zero due to 3 pre-existing
  errors unrelated to the AI Image Lab: two `react/no-unescaped-entities` in
  `src/presentation/components/sections/Testimonials.tsx:52`, and one
  `@typescript-eslint/no-empty-object-type` in
  `src/presentation/components/uikit/Input.tsx:4`. There are also 8 pre-existing
  `@next/next/no-img-element` warnings across several section components (unrelated to
  this feature) and one unused-var warning in `Button.tsx:39`. All of these predate
  this session's work; none are in the AI Image Lab files.
- **Business impact:** low — cosmetic/style, but it means `npm run lint` doesn't return
  a clean exit code repo-wide, which will matter once H1's CI is added (the lint step
  would fail the build).
- **Recommended solution:** small, isolated cleanup PR — escape the quotes in
  `Testimonials.tsx`, convert `InputProps` to a type alias like `TextareaProps` already
  is (`export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;`), remove
  or use the unused `asChild` prop in `Button.tsx`. Not part of this feature's scope,
  flagged here for visibility only.
- **Complexity:** Small (~30 minutes total).

### L2. No shared `Select` primitive in `uikit`

- **Description:** `AiImageLabClient.tsx` styles a native `<select>` inline with `cn(...)`
  rather than using a shared component, since no `Select` exists in
  `src/presentation/components/uikit`.
- **Business impact:** negligible today (one usage); would become inconsistent if
  Phase 2 adds more selects (model picker, brand preset picker, etc.).
- **Recommended solution:** extract a `Select` primitive to `uikit` when a second
  consumer appears — premature to do it for one usage.
- **Complexity:** Small (~1 hour), deferred intentionally.

### L3. Two independent `NODE_ENV === "production"` checks (page + route)

- **Description:** `page.tsx` and `route.ts` each implement their own one-line
  production check rather than sharing a helper.
- **Business impact:** none currently — this is intentional defense-in-depth (the
  route must never trust the page alone), and the check is trivial enough that
  extracting a shared helper wouldn't meaningfully reduce risk of drift.
- **Recommended solution:** none needed. Documented here only because the phase-closure
  review explicitly asked about duplicated logic — this instance is accepted as-is.
- **Complexity:** N/A (no action planned).
