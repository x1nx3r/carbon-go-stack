---
name: web-boundaries
description: Decide where a change belongs in the ERP template. Use when adding data fetching, mutations, API endpoints, server-side logic, route handlers, or when a task seems to need Next server features.
---

# Web boundaries

This repo is the frontend. The backend owns the domain. The default answer to
"where does this go?" is the backend.

## Decision tree

1. **Screen needs data?** Generated RTK Query hook in a client component.
   Keep the page a server shell.
2. **User submits something?** Generated RTK mutation through the BFF;
   invalidate the affected tags; refresh what the screen shows.
3. **Needs a computation, secret, persistence, transaction, schedule, or a
   rule that spans records?** Backend endpoint first. The web never holds that
   logic.
4. **Needs request state (cookies, headers)?** The BFF forwards transport. Do
   not read it in a page, layout, or route handler.
5. **Needs data in the first HTML?** This is an exception: ask for approval,
   then use a server `openapi-fetch` read. Do not move RTK Query onto the
   server or hydrate its store through RSC props.
6. **None of the above and still blocked?** Stop. State the constraint in the
   PR. An exception is a review decision.

## The BFF

`src/app/api/[...path]/route.ts` is the only server file allowed to do work.

- Forwards method, body, query, cookies, and the path to `API_URL`.
- Strips hop-by-hop headers; never logs secrets or bodies.
- Imports no application code: no services, store, components, or lib. Lint
  fails if it does.
- Has no endpoint list. If it needs to know a route, it is not a proxy.

## Adding an endpoint

1. Backend implements it; the OpenAPI contract updates.
2. Sync the swagger file into this repo; regenerate the service module.
3. Use the generated hook in a client component; keep the page shell.
4. Add loading, empty and error states with Carbon.
5. If the endpoint changes a list, invalidate its tags in the module's
   `enhance` file; never edit the generated module.

## Lint will catch

- `"use server"` anywhere.
- `"use client"` in a `page.tsx` or `layout.tsx`.
- `fetch(` outside `src/app/api`.
- `server-only` or `next/headers` imports.
- Tailwind-shaped classes and other UI kits.
- Raw hex colors in styles.

A lint failure is the design talking. Fix the boundary, do not disable the
rule; if the rule is genuinely wrong, change this skill and the ADR together.
