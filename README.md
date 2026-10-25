# carbon-go-stack

A full-stack ERP template in one repository:

- `web/` — Next.js 16 + Carbon, client-only UI.
- `api/` — Go 1.25 hexagonal monolith, Connect, PostgreSQL.
- `contract/` — the protobuf contract, canonical for both sides.
- `docs/` — cross-cutting decisions for the template.

The template is a scaffold. A team forks it, owns it, and changes it. The
image is the environment; this repository is the source and the standard.

Status: source and environment are one repository. The template image adds Go
and PostgreSQL; the start hook brings PostgreSQL up inside the session. The
source is cloned at summon.

## Run

```sh
# once
IBM_TELEMETRY_DISABLED=true npm --prefix web install

# backend
make db-up
make seed
make run-api                 # http://127.0.0.1:8080

# frontend, in another shell
API_URL=http://127.0.0.1:8080 npm --prefix web run dev
```

`make db-up` is for a host checkout. Inside a manus session the template start
hook starts PostgreSQL on `127.0.0.1:55432` automatically; skip `make db-up`
there.

The template manifest asks for one secret at summon: `OPENCODE_API_KEY` for
the model provider. The repository is public, so the session clone needs no
GitHub token.

`make db-down` removes the throwaway database. Without a backend, the web app
can run against its mock:

```sh
npm --prefix web run mock
npm --prefix web run dev
```

## Contract

`contract/erp/customers/v1/customers.proto` is canonical. Both sides generate
from it:

```sh
make generate        # Go and TypeScript
make generate-go     # Go only
make generate-web    # TypeScript only
```

Generated code is committed: `api/gen/` and `web/src/gen/`. Never edit it by
hand. There is no copied contract and no sync step.

## Commands

| What | Command |
|---|---|
| Regenerate both sides | `make generate` |
| Backend tests | `make test` |
| Format, vet, lint | `make lint` |
| Start the backend | `make run-api` |
| Seed the backend | `make seed` |
| Throwaway database | `make db-up` / `make db-down` |
| Start the web app | `make web-dev` |
| Install web dependencies | `make web-install` |

The web tree has its own commands: `npm --prefix web run lint`, `typecheck`,
`build`, and `mock`.

## Layout

```
web/          Next.js + Carbon frontend
api/          Go backend
contract/     canonical protobuf
docs/adr/     cross-cutting template decisions
Makefile      root commands and code generation
buf.yaml      contract module
buf.gen.*.yaml  Go and TypeScript generators
```

Per-tree agent guides: `web/AGENTS.md` and `api/AGENTS.md`. The root
`AGENTS.md` is the map.

## Template rule

This is a template, not the product. The Customers slice is the worked
example. Before you build:

1. Ask what the user is building and what the requirements are.
2. Discuss scope, data, states, and constraints.
3. Write an ADR in the relevant `docs/adr/` first.
4. Implement after agreement, one concern per patch.

The backend owns the domain and persistence. The web renders and forwards
transport through one BFF. The contract lives at the root, so frontend,
backend, and schema changes land in one commit.
