# Next + Carbon (`web/`)

The frontend of `carbon-go-stack`: a Next.js + Carbon app. The backend is in
`../api/`, a hexagonal Go monolith that owns the domain. The protobuf contract
is canonical at `../contract/`.

This directory is not a separate repository. A session clones the whole
template; `web/`, `api/`, and `contract/` share one commit.

## Stack

- Next.js 16 (App Router, Turbopack) with React 19 and TypeScript
- Carbon React 1.119 and Carbon styles 1.118
- Connect 2 + protobuf-es; the protobuf contract is generated with `buf`
- TanStack Query for the client cache; Sass modules for layout
- IBM Plex fonts from IBM's CDN (`$use-akamai-cdn`), so no font files and no
  webpack fallback

## Run

```sh
IBM_TELEMETRY_DISABLED=true npm install
```

From the repository root, start the real backend and the app:

```sh
make db-up
make seed
make run-api       # terminal 1, http://127.0.0.1:8080
make web-dev       # terminal 2, http://127.0.0.1:3000
```

The BFF reads `API_URL` (default `http://127.0.0.1:8080`). Copy `.env.example`
to `.env.local` only when the backend runs elsewhere:

```sh
API_URL=http://127.0.0.1:8080 npm run dev
```

`IBM_TELEMETRY_DISABLED=true` suppresses the install-time metric from
`@ibm/plex-serif`. Inside a container it would otherwise be treated as CI and
sent. Put the same variable in the template environment.

## Data flow

```
client component ── Connect ──► /api/<service>/<method> ──► BFF ──► API_URL
```

- `src/lib/connect.ts` creates the typed client against the same-origin BFF.
- `src/app/api/[...path]/route.ts` forwards the bytes; it does not decode
  messages or know RPC names.
- `../contract/` is canonical. Run `make generate` from the repository root;
  it regenerates both `src/gen/` here and the Go code in `../api/gen/`. Never
  edit `src/gen/`.

## Boundaries

The web is **client-only**: generated Connect client plus TanStack Query in
client components, server shells for pages, and one BFF proxy as the only
server code. If a task needs computation, secrets, persistence or rules, it
belongs in the backend. The decision and its consequences:
`docs/adr/0001-web-is-client-only.md`; the agent checklist:
`../.opencode/skills/web-boundaries/SKILL.md`.

Lint enforces the shape: no Server Actions, no `"use client"` in pages or
layouts, no `fetch` outside the BFF, no `next/headers`, no `connect-node` in
`src/`, no Tailwind or other UI kits, no raw hex colors.

## Design reference

`/design` is the worked example and the approved component catalogue. It is
hidden from product navigation but remains directly accessible. Read
`src/design/catalog.ts` first, then open `/design`; a primitive or assembly that
is not in the catalogue is not approved for a product screen.

The live assembly uses one `ShowcaseService` vertical: contract, Go usecase,
PostgreSQL adapter, generated client, table, form, detail, and danger dialog.
The landing page at `/` is static lorem-ipsum copy.

## Page composition

Pages use `Page` (`src/components/page.tsx`), which owns the grid, the title
block and the block rhythm. The shell owns the fixed-header offset. The
measured contract — header→title 32 px, title→description 16 px, blocks
32 px — lives in `../.opencode/skills/carbon-ui/SKILL.md`; the reference
screenshots live in `docs/visual/` at 1440 and 390 px. Never hand-roll shell
padding in a page.

## Theme

The theme is one class on `<body>` in `src/app/layout.tsx`:

- `cds--white` (default), `cds--g10`, `cds--g90`, `cds--g100`

Carbon tokens come from that class; components do not need their own theme
wrapper unless a region differs.

## Structure

```
src/app/(app)/                 shell + pages (server components)
src/app/(app)/page.tsx         static lorem-ipsum landing page
src/app/(app)/design/          hidden worked example
src/app/api/[...path]/         BFF transport proxy
src/components/                shared UI + providers; page.tsx owns composition
src/design/                    catalogue, primitive gallery, live assembly
src/gen/                       generated protobuf types/service (never edit)
src/lib/connect.ts             typed Connect client
src/lib/format.ts              money, dates
eslint-rules/                  local lint rules (Tailwind class names)
docs/adr/                      architecture decisions
docs/carbon/                   Carbon reference (secondary to the catalogue)
docs/visual/                  1440 + 390 px baselines + spacing contract
../.opencode/skills/           agent skills loaded on demand
AGENTS.md                      standards for agents working in this tree
```

The canonical contract is `../contract/`. The Go backend is `../api/`. The
repository root owns the template manifest, environment, and shared commands.
