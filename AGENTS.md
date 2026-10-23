# Next + Carbon — agent guide

This is the frontend half of an internal ERP template: this repo (Next.js +
Carbon) and a separate backend (hexagonal monolith, grpc-gateway) that owns
the domain. The web app renders; the backend decides.

Read `docs/adr/0001-web-is-client-only.md` before touching data fetching or
anything under `src/app`. Load `.opencode/skills/web-boundaries` for the
decision tree, and `carbon-ui` / `erp-domain` for UI and vocabulary.

## Hard rules

1. **Client-only data.** All reads and writes go through generated RTK Query
   hooks in client components. Pages and layouts are server shells: metadata,
   composition, nothing else.
2. **Server-side processing in Next is a last resort.** Computation, secrets,
   persistence, transactions, scheduling, cross-record rules: backend. If a
   task needs them, add a backend endpoint first.
3. **The only server code in this repo is the BFF** at
   `src/app/api/[...path]/route.ts`. It forwards transport and nothing else:
   no domain logic, no app imports, no endpoint knowledge.
4. **Forbidden:** `"use server"`, Server Actions, route handlers outside the
   BFF, `next/headers`, `fetch` in `src/` (the BFF is exempt), database or ORM
   clients, secrets, and reading request state on the web side.
5. **Carbon only.** No Tailwind or other UI kits, no raw hex colors, no ad-hoc
   spacing or type. Use Carbon components and Carbon spacing/type mixins.
   Carbon fonts come from IBM's CDN; do not add local font files.
6. **List state lives in the URL** — page, filters, search — not in component
   state. Shareable screens are part of the ERP contract.
7. **Never edit generated API modules.** Change the backend contract, sync the
   swagger file, and regenerate.

If a task truly cannot be solved in the backend, stop and state why. An
exception is a review decision, not an implementation detail.

## Where things go

| Need | Place |
|---|---|
| A route | `src/app/(app)/<segment>/page.tsx` — server shell |
| Interaction for one route | `src/app/(app)/<segment>/_components/` — `"use client"` |
| Shared, domain-free UI | `src/components/` |
| API hooks | generated modules under `src/services/`, base API in `src/services/api.ts` |
| Store | `src/store/` |
| Formatting | `src/lib/format.ts` |
| Transport proxy | `src/app/api/[...path]/route.ts` |

## Adding a data screen

1. The backend implements the endpoint and its OpenAPI contract updates.
2. Sync the swagger file into this repo and regenerate the service module.
3. Build the client component with the generated hook; keep the page a shell.
4. Handle loading, empty and error states with Carbon components.
5. Put filters and pagination in URL search params.

## Before you say done

- `npm run lint`, `npm run typecheck`, `npm run build`
- Open the affected routes; no console errors; screenshot UI changes.
- If you touched a rule, update the ADR or skill that states it.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
