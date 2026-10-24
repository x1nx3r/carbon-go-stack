---
name: web-boundaries
description: Decide where a change belongs in the ERP template. Use when adding data fetching, mutations, API endpoints, server-side logic, route handlers, or when a task seems to need Next server features.
---

# Web boundaries

This repo is the frontend. The backend owns the domain. The default answer to
"where does this go?" is the backend.

## Decision tree

1. **Screen needs data?** `useQuery` with the generated Connect client in a
   client component. Keep the page a server shell.
2. **User submits something?** A generated Connect method through the BFF,
   then invalidate the TanStack Query keys the screen reads.
3. **Needs a computation, secret, persistence, transaction, schedule, or a
   rule that spans records?** Backend RPC first. The web never holds that
   logic.
4. **Needs request state (cookies, headers)?** The BFF forwards transport. Do
   not read it in a page, layout, or route handler.
5. **Needs data in the first HTML?** A reviewed exception: `connect-node`
   with a per-request client and forwarded cookies. Do not put the browser
   client on the server or hydrate a cache through RSC props.
6. **None of the above and still blocked?** Stop. State the constraint in the
   PR. An exception is a review decision.

## The BFF

`src/app/api/[...path]/route.ts` is the only server file allowed to do work.

- Forwards method, path, headers, body and cookies to `API_URL`.
- Does not decode a Connect message, and does not know RPC names. If it needs
  an endpoint list, it is no longer a proxy.
- Imports no application code: no `src/lib`, `src/components`, `src/gen`.
  Lint fails if it does.
- Binary bodies pass through untouched. Never parse JSON in the proxy.

## Adding an RPC

1. Backend adds the RPC; the proto is the contract.
2. Run `npm run api:generate`; `src/gen` updates (never edit it by hand).
3. Use the typed client in a client component: `useQuery` for reads, a
   mutation plus cache invalidation for writes.
4. Keep the page shell; handle loading, empty and error states with Carbon.
5. Keep filters and pagination in URL search params.

## Errors

Connect throws `ConnectError` with a code such as `Code.NotFound` or
`Code.InvalidArgument`. Map it to a Carbon `InlineNotification`; do not string
match the message. The backend is the source of error semantics.

## Lint will catch

- `"use server"` anywhere.
- `"use client"` in a `page.tsx` or `layout.tsx`.
- `fetch(` outside `src/app/api`.
- `server-only`, `next/headers`, and `connect-node` imports in `src/`.
- Tailwind-shaped classes and other UI kits.
- Raw hex colors in styles.

A lint failure is the design talking. Fix the boundary, do not disable the
rule; if the rule is genuinely wrong, change this skill and the ADR together.
