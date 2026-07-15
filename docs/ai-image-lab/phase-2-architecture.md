# AI Content Studio — Phase 2 Architecture (Proposed, Not Implemented)

This document is a design proposal only. Nothing in this file has been built. It exists
to give Phase 2 a coherent starting architecture instead of letting each subsystem be
designed ad hoc as it's requested.

**Ground rule carried over from Phase 1:** none of this goes live in production until
the Phase 1 Critical blockers (distributed rate limiting, authentication — see
[production-readiness.md](./production-readiness.md)) are closed. Phase 2 actually
*requires* two of them (Redis rate limiting, Authentication) as foundational
subsystems, so closing those blockers and building Phase 2 are largely the same work.

## Current state this builds on

This repo has **no database and no object storage today** — `package.json` has no
Prisma/Drizzle/Supabase/Postgres/blob-storage dependency. Every subsystem below that
needs persistence is a new architectural decision, not an extension of something that
exists. That decision (which DB, which storage) should be made once, up front, since
Prompt Library, Asset History, Brand Presets, and Usage Analytics all share it.

## High-level shape

```
┌──────────────────────────────────────────────────────────────────────┐
│  AI Content Studio  (/admin/studio)                                   │
│  Shell + nav + shared auth gate                                       │
│  ┌───────────────┬────────────────┬───────────┬────────────────────┐│
│  │ Product Image  │ Marketing Asset│  Prompt   │  Brand Preset       ││
│  │ Generator      │ Generator      │  Library  │  System             ││
│  └───────────────┴────────────────┴───────────┴────────────────────┘│
│  ┌───────────────┬────────────────────────────────────────────────┐│
│  │ Asset History  │  Usage Analytics                                ││
│  └───────────────┴────────────────────────────────────────────────┘│
└───────────────────────────────┬────────────────────────────────────┘
                                  │ every request, authenticated
┌───────────────────────────────▼────────────────────────────────────┐
│  Shared API layer — Next.js Route Handlers under /api/studio/*      │
│  generate · prompts · presets · assets · usage                      │
└──────┬─────────────┬─────────────┬─────────────┬───────────────────┘
       │              │              │              │
  Auth middleware  Redis limiter   Database        Object storage
  (session check)  (Upstash)       (prompts,        (Vercel Blob /
  protects /admin  shared across   presets,          S3 / Cloudinary)
  & /api/studio/*  all endpoints   assets, usage)     generated images
```

## Subsystems

### AI Content Studio (umbrella shell)

- **Responsibility:** navigation shell, mode switcher, shared layout, and — critically
  — the single place the auth gate is enforced for the whole surface, so individual
  generator pages don't each need to re-implement it.
- **Relationship to Phase 1:** the existing `/admin/ai-image-lab` becomes either (a) the
  "quick/raw" mode inside the Studio for power users who just want a bare prompt box, or
  (b) is retired in favor of the guided Product Image Generator once that exists. Not a
  rewrite — its route handler (`/api/ai/image`) is the direct ancestor of
  `/api/studio/generate`.
- **Integration points:** hosts all subsystems below as routes/tabs under
  `/admin/studio/*`.

### Prompt Library

- **Responsibility:** store reusable prompt templates with named variables (e.g.
  `"{{product_name}} on black marble, studio lighting, {{brand_style}}"`), tagged and
  searchable, with a usage counter so the most-used templates surface first.
- **Data model:** `prompts` table — `id, title, template, tags[], created_by,
  created_at, usage_count`.
- **API:** `/api/studio/prompts` — `GET` (list/search by tag or text), `POST` (create),
  `PATCH` (edit), `DELETE`.
- **Integration:** both generators below let a user pick a library prompt, fill in
  variables, and the resolved text becomes the `prompt` sent to `/api/studio/generate`.
  A successful generation can optionally be saved back as a new library entry.

### Product Image Generator

- **Responsibility:** guided flow for product photography specifically — pick a
  product (from the existing catalog data already powering `ProductsList`), pick a
  Brand Preset, generate variations, and save results tagged to that product.
- **Integration:** reads the existing product catalog (no new product data model
  needed); writes to Asset History with a `productId` reference so a product's assets
  are browsable from its own record later.

### Marketing Asset Generator

- **Responsibility:** banners, Meta Ads creatives, and social assets — channel-aware
  presets (Meta feed 1:1, Story/Reel 9:16, banner 16:9, etc.) instead of the generic
  size dropdown Phase 1 has today.
- **Integration:** shares `/api/studio/generate` with a `context: "marketing"`
  discriminator that changes the default size options and prompt scaffolding; results
  tagged by channel/campaign in Asset History.

### Asset History

- **Responsibility:** the durable record Phase 1 explicitly lacks (tech-debt H2). Every
  successful generation across every generator is written here: the image itself in
  object storage, plus metadata in the database.
- **Data model:** `assets` table — `id, storage_url, prompt, model, size, generator_type,
  generated_by, product_id (nullable), campaign_tag (nullable), created_at`.
- **Why object storage and not the DB:** Phase 1 returns images as base64 JSON, which is
  fine for a single ephemeral response but is the wrong shape for something meant to be
  listed, thumbnailed, and re-fetched — store bytes in Vercel Blob (or S3/Cloudinary) and
  keep only the URL + metadata in the database.
- **Integration:** every generator's success path writes one row here; a browsing/search
  UI (filter by generator type, product, date, tag) lives under `/admin/studio/history`.

### Brand Preset System

- **Responsibility:** centrally enforce brand consistency instead of relying on each
  user to remember to type "obsidian navy, champagne gold, luxury editorial style" every
  time. A preset is a named, reusable prompt suffix (and optionally a reference image for
  future image-edit-based consistency once that's needed).
- **Data model:** `brand_presets` table — `id, name, prompt_suffix, reference_image_url
  (nullable), created_by`.
- **Integration:** injected **server-side** when a preset is selected (not left as
  freely-editable client text) — the `/api/studio/generate` handler appends the preset's
  `prompt_suffix` after validating the base prompt, so brand language can't be
  accidentally stripped or edited away by the UI.

### Redis Distributed Rate Limiting

- **Responsibility:** replace Phase 1's in-memory `Map`/counters (tech-debt C1) with a
  shared store so limits are correct across every Vercel instance, and extend coverage
  from just `/api/ai/image` to every `/api/studio/*` endpoint.
- **Proposed implementation:** `@upstash/ratelimit` + `@upstash/redis`, wrapped in a
  single `lib/rate-limit.ts` helper exposing the same shape Phase 1's `checkRateLimit`/
  `checkGlobalDailyLimit` already have, so call sites barely change. Sliding-window
  algorithm for per-user limits; a Redis counter with a daily TTL for the global cost cap.
- **Integration:** this is a prerequisite, not an optional add-on — every other Phase 2
  API route should be built against this shared limiter from day one rather than
  repeating Phase 1's single-process pattern.

### Authentication

- **Responsibility:** replace "not in production" as the only access control with real
  staff identity (tech-debt C2).
- **Proposed implementation:** session-based auth appropriate for a small internal team
  — Auth.js (NextAuth) with a single trusted provider, restricted to an allow-listed
  domain or explicit email list (no public sign-up). `middleware.ts` protects
  `/admin/**` and `/api/studio/**` (and gets retrofitted onto `/api/ai/image`) by
  checking the session before the route handler runs at all.
- **Integration:** every write (`prompts`, `presets`, `assets`) is attributed to the
  authenticated user (`created_by`/`generated_by`), which Usage Analytics depends on.

### Usage Analytics

- **Responsibility:** turn Phase 1's structured logs into queryable, dashboarded data —
  generations per day/user/generator type, estimated cost, how often the daily cap is
  hit.
- **Data model:** derived primarily from the `assets` table (successful generations)
  plus a lightweight `usage_events` table for failures/rate-limit/cap hits that don't
  produce an asset (so "how often are we hitting the cap" is answerable without log
  archaeology).
- **Integration:** structured console logs remain the source of truth for debugging a
  single request; the database tables are the source of truth for aggregate reporting.
  A simple table/chart page under `/admin/studio/analytics` is enough to start —
  no BI tool integration needed for v1.

### Production Deployment

Proposed go-live sequence, once the above subsystems (or at minimum Auth + Redis rate
limiting) exist:

1. Close both Phase 1 Critical blockers (B1 Redis rate limiting, B2 authentication) —
   these double as Phase 2 foundations, so this isn't extra work, it's the same work.
2. Add CI (tech-debt H1): lint + test + build gating every PR.
3. Provision infrastructure in the Vercel project: Upstash Redis, a database (Vercel
   Postgres is the lowest-friction choice given the Vercel deployment target; Supabase
   is a reasonable alternative if a broader Postgres feature set is wanted), and object
   storage (Vercel Blob is the lowest-friction choice for the same reason).
4. Replace the blanket `NODE_ENV === "production"` gate with an explicit feature flag
   (e.g. `AI_STUDIO_ENABLED=true`) combined with the new auth check — so the feature can
   be turned on for authenticated staff in production without a code deploy, and turned
   back off instantly if something goes wrong.
5. Soft launch to a small internal group first; watch Usage Analytics and actual OpenAI
   cost for an initial period before widening the audience.
6. Write a short operational runbook: who raises the daily cap, how the OpenAI key gets
   rotated, who's on call if generation starts failing.
