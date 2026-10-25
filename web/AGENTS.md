# Next + Carbon (`web/`) — agent guide

This is the frontend of `carbon-go-stack`: this tree (Next.js + Carbon) and the
Go backend in `../api/`, in one repository. The web app renders; the backend
decides. The protobuf contract is canonical at `../contract/`.

## This is a template repository, not the product

The design slice at `/design` is the worked example, not the app. It is
hidden from product navigation. The landing page at `/` is placeholder copy.
Do not infer the product from either.

Before building anything:

1. **Ask the user what they are building** and what the requirements are. If
   the request is vague, ask; do not guess a domain or a feature set.
2. Discuss scope, data, states and constraints with the user.
3. **Write an ADR in `docs/adr/` first** (next number), covering the decision,
   scope and consequences; get agreement before coding.
4. Implement after that, one concern per patch.

Trivial typo or style fixes are not building; anything that adds or changes
behaviour needs an ADR.

## Commands

| What | Command |
|---|---|
| Run the app | `npm run dev` |
| Regenerate from the contract | `npm run api:generate` |
| Lint (ESLint + stylelint) | `npm run lint` |
| Types | `npm run typecheck` |
| Production build | `npm run build` |

Read `docs/adr/0001-web-is-client-only.md` before touching data fetching or
anything under `src/app`. For any UI change, read `src/design/catalog.ts`
first and open `/design`. Then load `../.opencode/skills/carbon-ui` for
layout numbers and `../.opencode/skills/web-boundaries` for the data
boundary. `../.opencode/skills/erp-domain` carries the vocabulary. Use
`docs/carbon/README.md` as reference after the design catalogue, not before.

## Hard rules

1. **Client-only data.** Reads and writes go through the generated Connect
   client in `src/lib/connect.ts` with TanStack Query, in client components.
   Pages and layouts are server shells: metadata, composition, nothing else.
2. **Server-side processing in Next is a last resort.** Computation, secrets,
   persistence, transactions, scheduling, cross-record rules: backend. If a
   task needs them, add a backend RPC first.
3. **The only server code in this repo is the BFF** at
   `src/app/api/[...path]/route.ts`. It forwards transport and nothing else:
   no decoding, no app imports, no endpoint knowledge.
4. **Forbidden:** `"use server"`, Server Actions, route handlers outside the
   BFF, `next/headers`, `fetch` in `src/` (the BFF is exempt), `connect-node`
   in `src/` (reviewed exception only), database or ORM clients, secrets, and
   reading request state on the web side.
5. **Carbon only, from the design catalogue.** No Tailwind or other UI kits,
   no raw hex colors, no ad-hoc spacing or type. Use Carbon components and
   Carbon spacing/type mixins. Build screens with `Page` and `Stack`; the
   shell owns the header offset. A primitive or assembly that is not in
   `src/design/catalog.ts` is not approved: add it to the catalogue and
   `/design` first. Carbon fonts come from IBM's CDN; do not add local font
   files.
6. **List state lives in the URL** — page, filters, search, page size — not in
   component state. Shareable screens are part of the ERP contract.
7. **Never edit generated code.** The contract is canonical at `../contract/`;
   run `npm run api:generate` (or `make -C .. generate`) to regenerate both
   sides. `src/gen` is generated; change the contract at the root, never in
   place.

If a task truly cannot be solved in the backend, stop and state why. The Node
Connect transport is the one reviewed exception, for a server-rendered read
with a per-request client. An exception is a review decision, not an
implementation detail.

## Where things go

| Need | Place |
|---|---|
| A route | `src/app/(app)/<segment>/page.tsx` — server shell |
| Interaction for one route | `src/app/(app)/<segment>/_components/` — `"use client"` |
| Approved primitive or assembly | `src/design/` and `src/design/catalog.ts` |
| Shared, domain-free UI | `src/components/` (`Page` owns page composition) |
| Generated protobuf types and service descriptors | `src/gen/` — never edit |
| Connect client | `src/lib/connect.ts` |
| Query client | `src/components/providers.tsx` |
| Formatting | `src/lib/format.ts` |
| Layout contract + baselines | `../.opencode/skills/carbon-ui/SKILL.md`, `docs/visual/` |
| Transport proxy | `src/app/api/[...path]/route.ts` |

## Adding a data screen

1. The backend implements the RPC and the contract changes in `../contract/`.
2. Regenerate both sides: `npm run api:generate` or `make -C .. generate`.
3. Build the client component with `useQuery` and the typed client; keep the
   page a shell.
4. Handle loading, empty and error states with Carbon components.
5. Put filters and pagination in URL search params.

## Before you say done

- `npm run api:generate` if the contract changed, then `npm run lint`,
  `npm run typecheck`, `npm run build`
- Open the affected routes; no console errors; screenshot UI changes.
- Measure layout: header→title 32 px, title→description 16 px, blocks 32 px;
  compare with `docs/visual/*.png` at 1440 px and 390 px. Check mobile actions
  and that the page does not scroll horizontally.
- If you touched a rule, update the ADR or skill that states it.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
