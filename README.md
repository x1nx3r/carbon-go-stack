# Next + Carbon

The frontend half of an ERP template pair: Next.js + Carbon here, a separate
backend (hexagonal monolith, Connect/gRPC) that owns the domain. This
repository is what a session clones at summon; it carries the app, its
standards and its agent instructions, not the environment.

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

# terminal 1: a mock CustomersService over Connect
npm run mock

# terminal 2: the app
npm run dev
```

The BFF reads `API_URL` (default `http://127.0.0.1:4010`, the mock). Copy
`.env.example` to `.env.local` and point it at the real backend when you have
one.

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
- `src/gen/` is generated from `proto/` with `npm run api:generate`. Never
  edit it.

## Boundaries

The web is **client-only**: generated Connect client plus TanStack Query in
client components, server shells for pages, and one BFF proxy as the only
server code. If a task needs computation, secrets, persistence or rules, it
belongs in the backend. The decision and its consequences:
`docs/adr/0001-web-is-client-only.md`; the agent checklist:
`.opencode/skills/web-boundaries/SKILL.md`.

Lint enforces the shape: no Server Actions, no `"use client"` in pages or
layouts, no `fetch` outside the BFF, no `next/headers`, no `connect-node` in
`src/`, no Tailwind or other UI kits, no raw hex colors.

## Theme

The theme is one class on `<body>` in `src/app/layout.tsx`:

- `cds--white` (default), `cds--g10`, `cds--g90`, `cds--g100`

Carbon tokens come from that class; components do not need their own theme
wrapper unless a region differs.

## Layout

```
src/app/(app)/                 shell + pages (server components)
src/app/(app)/customers/       golden slice: list, with _components/
src/app/api/[...path]/         BFF transport proxy
src/components/                shared, domain-free UI + providers
src/gen/                       generated protobuf types/service (never edit)
src/lib/connect.ts             typed Connect client
src/lib/format.ts              money, dates
proto/                         the contract this repo generates from
mock/                          dev-only CustomersService implementation
eslint-rules/                  local lint rules (Tailwind class names)
docs/adr/                      architecture decisions
.opencode/skills/              agent skills loaded on demand
AGENTS.md                      standards for agents working in this repo
```

## Turning it into a manus template

1. Push this repository and its backend pair; template repos stay their own
   repos.
2. Add `templates/<name>/template.yaml` in manus-dei with both repos under
   `repos:` (`strategy: clone-at-summon`), the model, resources and secret
   names. The manifest is the workspace roster.
3. Keep per-repo standards here: `AGENTS.md`, `opencode.json`, `.opencode/`.
   The image is the environment; this repo is the standard.
