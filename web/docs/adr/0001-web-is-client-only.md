# ADR-0001: The web app is client-only

Status: accepted · Date: 2026-10-24

## Context

The ERP template is one repository: `web/` (Next.js + Carbon) and `api/`
(the Go backend that owns the domain). The web consumes the backend through
the protobuf contract at the repository root: `buf generate` produces the
message types and service descriptors, and the browser uses those with the
Connect client.

Two forces make the boundary easy to blur. Next.js offers Server Components,
Server Actions, route handlers and request-scoped APIs. Agents, given a task,
will reach for whichever is nearest: a `fetch` in a page, a `"use server"`
mutation, or a route handler holding a rule that belongs in the backend. Each
of those is a second place where the domain lives.

Auth is not built yet. When it arrives it will be a cookie forwarded by the
BFF, not web-side session logic.

## Decision

1. **All UI data is client-side.** Reads and writes go through the generated
   Connect client with TanStack Query in client components. The query cache is
   the only client cache.
2. **Pages and layouts are server shells.** Metadata, layout composition,
   redirects and not-found. No data fetching, no request state.
3. **The web server has one job beyond rendering: the BFF.** A single
   catch-all proxy at `src/app/api/[...path]/route.ts` forwards method, body,
   query and cookies to the backend. Transport only: no decoding, no endpoint
   list, no imports from `src/lib`, `src/components` or `src/gen`.
4. **Server-side processing in Next is a last resort.** If a task needs
   computation, secrets, persistence, transactions, scheduling or
   cross-record rules, it belongs in the backend. If it truly cannot live
   there, stop and record an exception in review.
5. **The Node Connect transport is a reviewed exception.** A genuinely
   server-rendered read may use `@connectrpc/connect-node` with a per-request
   client and forwarded cookies. It is banned in `src/` by default because it
   creates a second data path and a second cache.
6. **Allowed server surfaces:** metadata, layouts, redirect/notFound, error
   boundaries, static rendering, and the BFF. Nothing else without an explicit
   exception.
7. **Lint enforces the decision**, not just this document: `"use server"` is
   an error, `"use client"` in a page or layout is an error, `fetch` outside
   the BFF is an error, server-only imports and `connect-node` are errors, and
   the BFF may not import application code.

## Consequences

- **First paint carries no API data.** Lists and details render a skeleton,
  then fetch through TanStack Query. Acceptable for an authenticated internal
  ERP; a screen that truly needs server-rendered data is the Node transport
  exception above.
- **One data path.** One Connect client, one query cache, one error
  interceptor, one place to invalidate after a mutation. Codegen produces one
  surface from the protobuf contract.
- **Auth stays simple.** The BFF forwards cookies; no token in JavaScript, no
  web-side session store. A login page later is just another RPC.
- **The backend is the only place rules can drift to.** A reviewer can ask one
  question: "does this change decide something?" If yes, it belongs in the
  backend.
- **A blocked agent must escalate.** The rule is "backend first, stop if it
  cannot be", not "invent a server action". The escalation is visible in the
  PR, not hidden in a handler.

## Alternatives considered

- **REST + RTK Query codegen.** The earlier plan, and a valid architecture.
  Rejected here because the grpc-gateway Swagger 2.0 document is a lossy
  middleman; the protobuf contract is already the source of truth and Connect
  removes both the gateway hop and the second contract.
- **Server Components reading the API.** Valid, and the Node transport is the
  sanctioned form of it. It is an exception because it creates a second data
  path and a second cache, not because it is impossible.
- **RTK Query on the server with state hydration.** Rejected: per-request
  stores, a separate absolute base URL, provider placement per page, and
  serializing the cache through RSC props. Too many sharp edges for agents.
- **Server Actions for mutations.** Rejected: it puts domain logic on the web
  side and bypasses the protobuf contract, so the contract stops being the one
  integration surface.
- **Client-only with no BFF.** Rejected: CORS, token exposure, and a second
  auth story in the browser.
