# ADR-0001: The web app is client-only

Status: accepted · Date: 2026-10-24

## Context

The ERP template is two repositories: a Next.js + Carbon frontend and a
backend that owns the domain (hexagonal monolith, grpc-gateway). The frontend
consumes the backend through an OpenAPI contract and generates RTK Query
modules from it.

Two forces make the boundary easy to blur. Next.js offers Server Components,
Server Actions, route handlers and request-scoped APIs. Agents, given a task,
will reach for whichever is nearest: a `fetch` in a page, a `"use server"`
mutation, or a route handler holding a rule that belongs in the backend. Each
of those is a second place where the domain lives.

Auth is not built yet. When it arrives it will be a cookie forwarded by the
BFF, not web-side session logic.

## Decision

1. **All UI data is client-side.** Reads and writes go through generated RTK
   Query hooks in client components. The RTK cache is the only client cache.
2. **Pages and layouts are server shells.** Metadata, layout composition,
   redirects and not-found. No data fetching, no request state.
3. **The web server has one job beyond rendering: the BFF.** A single
   catch-all proxy at `src/app/api/[...path]/route.ts` forwards method, body,
   query and cookies to the gateway. Transport only: no domain logic, no
   imports from `src/services`, `src/store`, `src/components` or `src/lib`.
4. **Server-side processing in Next is a last resort.** If a task needs
   computation, secrets, persistence, transactions, scheduling or
   cross-record rules, it belongs in the backend. If it truly cannot live
   there, stop and record an exception in review.
5. **Allowed server surfaces:** metadata, layouts, redirect/notFound, error
   boundaries, static rendering, and the BFF. Nothing else without an explicit
   exception.
6. **Lint enforces the decision**, not just this document: `"use server"` is
   an error, `"use client"` in a page or layout is an error, `fetch` outside
   the BFF is an error, server-only imports are errors, and the BFF may not
   import application code.

## Consequences

- **First paint carries no API data.** Lists and details render a skeleton,
  then fetch through RTK Query. Acceptable for an authenticated internal ERP;
  a screen that truly needs server-rendered data is an explicit exception
  with a second client (`openapi-fetch`), never RTK hydration.
- **One data path.** One base API, one cache, one error interceptor, one place
  to invalidate after a mutation. Codegen produces exactly one surface.
- **Auth stays simple.** The BFF forwards cookies; no token in JavaScript, no
  web-side session store. A login page later is just another client mutation.
- **The backend is the only place rules can drift to.** A reviewer can ask one
  question: "does this change decide something?" If yes, it belongs in the
  backend.
- **A blocked agent must escalate.** The rule is "backend first, stop if it
  cannot be", not "invent a server action". The escalation is visible in the
  PR, not hidden in a handler.

## Alternatives considered

- **Server Components fetching the API (`openapi-fetch`).** Valid, and the
  right escape hatch for a screen that needs data in the first HTML. It is a
  second generated client and a second cache, so it is an exception, not the
  default.
- **RTK Query on the server with state hydration.** Possible — the store and
  endpoints are isomorphic — but it needs a store per request, an absolute
  base URL separate from the BFF, per-page provider placement, and
  serializing the cache through RSC props. Too many sharp edges for agents.
- **Server Actions for mutations.** Rejected: it puts domain logic on the web
  side and bypasses the OpenAPI contract, so the two repos drift.
- **Client-only with no BFF.** Rejected: CORS, token exposure, and a second
  auth story in the browser.
