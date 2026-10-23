# Next + Carbon

A starter for manus-dei template repos: Next.js App Router on the IBM Carbon
Design System. This is the repository a session clones at summon; it carries
the app, its standards and its agent instructions, not the environment.

## Stack

- Next.js 16 (App Router, Turbopack) with React 19 and TypeScript
- Carbon React 1.119 and Carbon styles 1.118
- Sass modules for layout; Carbon owns the design system (no Tailwind)
- IBM Plex fonts from IBM's CDN (`$use-akamai-cdn`), so Turbopack is the only
  toolchain and the repo carries no font files

## Run

```sh
IBM_TELEMETRY_DISABLED=true npm install
npm run dev
```

`IBM_TELEMETRY_DISABLED=true` suppresses the install-time metric from
`@ibm/plex-serif`. Inside a container it would otherwise be treated as CI and
sent. Put the same variable in the template environment so sessions never
emit it.

## Boundaries

The web is **client-only**: generated RTK Query hooks in client components,
server shells for pages, and one BFF proxy as the only server code. If a task
needs computation, secrets, persistence or rules, it belongs in the backend.
The full decision and its consequences: `docs/adr/0001-web-is-client-only.md`;
the agent checklist: `.opencode/skills/web-boundaries/SKILL.md`.

Lint enforces the shape: no Server Actions, no `"use client"` in pages or
layouts, no `fetch` outside the BFF, no `next/headers`, no Tailwind or other
UI kits, no raw hex colors.

## Theme

The theme is one class on `<body>` in `src/app/layout.tsx`:

- `cds--white` (default), `cds--g10`, `cds--g90`, `cds--g100`

Carbon tokens come from that class; components do not need their own theme
wrapper unless a region differs.

## Layout

```
src/app/layout.tsx          root layout, metadata, Carbon theme class
src/app/globals.scss        Carbon styles with CDN fonts
src/app/page.tsx            example page with Carbon Grid, Button, Tile, Tag
src/app/page.module.scss    layout using Carbon spacing and type mixins
eslint-rules/               local lint rules (Tailwind class names)
docs/adr/                   architecture decisions
.opencode/skills/           agent skills loaded on demand
AGENTS.md                   standards for agents working in this repo
```

## Turning it into a manus template

1. Push this repository (template repos stay their own repos; manus-dei only
   pins them).
2. Add `templates/<name>/template.yaml` in manus-dei with
   `strategy: clone-at-summon`, the repo URL and ref, the model, resources and
   secret names.
3. Keep per-repo standards here: `AGENTS.md`, `opencode.json`, `.opencode/`.
   The image is the environment; this repo is the standard.
