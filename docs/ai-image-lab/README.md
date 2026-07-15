# AI Image Lab — Documentation Index

Internal, dev-only tool for generating images with OpenAI's `gpt-image-1`. Foundation for
the future **AI Content Studio** (product images, banners, Meta Ads creatives, marketing
assets).

**Status:** Phase 1 complete. Feature is fully built, hardened, and tested — but
**disabled in production** by design (`NODE_ENV === "production"` gate on both the page
and the API route). It stays internal/dev-only until a deliberate decision is made to
enable it live.

## Documents

| Doc | Contents |
|---|---|
| [architecture.md](./architecture.md) | Architecture overview, request/API flow, security architecture, endpoint lifecycle, environment variables, testing |
| [tech-debt.md](./tech-debt.md) | Technical debt register (Critical/High/Medium/Low) |
| [production-readiness.md](./production-readiness.md) | Scored re-evaluation (architecture, security, maintainability, performance, scalability, observability, testability, production readiness) and the list of production blockers |
| [phase-2-architecture.md](./phase-2-architecture.md) | Proposed (not implemented) architecture for the AI Content Studio and its subsystems |
| [handoff.md](./handoff.md) | Engineering handoff — read this first if you're new to the project |

## Feature files

```
src/app/api/ai/image/route.ts          API route (POST /api/ai/image)
src/app/api/ai/image/route.test.ts     Unit tests (vitest)
src/app/admin/ai-image-lab/page.tsx            Server component: prod gate + metadata
src/app/admin/ai-image-lab/AiImageLabClient.tsx Client component: the actual UI
src/presentation/components/uikit/Textarea.tsx  New uikit primitive (prompt input)
vitest.config.ts                        Test runner config
```
