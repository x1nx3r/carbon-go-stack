# carbon-go-stack — agent guide

One repository, three trees: `web/` (Next.js + Carbon), `api/` (Go,
hexagonal, Connect), and `contract/` (canonical protobuf). This is a template,
not the product. The design slice at `/design` is the worked example; it is
hidden from product navigation. The landing page at `/` is static placeholder
copy.

## This is a template

Before you build:

1. Ask the user what they are building and what the requirements are.
2. Discuss scope, data, states, and constraints.
3. Write an ADR in the relevant `docs/adr/` first.
4. Set the goal and ask the human to authorize it. Until then the harness
   refuses `todowrite` and writes outside `docs/adr/`, `.opencode/scratchpads/`,
   and `.opencode/plans/`; scoping reads, searches, and questions stay open.
5. Implement after agreement and authorization, one concern per patch.

Cross-cutting decisions go in `docs/adr/`. Web decisions go in
`web/docs/adr/`. Backend decisions go in `api/docs/adr/`.

## Map

| Need | Read |
|---|---|
| UI reference first | `web/src/design/catalog.ts`, then `/design` |
| Frontend rules | `web/AGENTS.md` |
| Backend rules | `api/AGENTS.md` |
| Contract workflow | `api/docs/guidelines/contract.md` |
| UI composition skill | `.opencode/skills/carbon-ui/SKILL.md` |
| Frontend boundary decision | `web/docs/adr/0001-web-is-client-only.md` |
| Backend architecture decision | `api/docs/adr/0001-backend-monolith-connect.md` |
| Template repository decision | `docs/adr/0001-template-repository.md` |

The frontend is client-only. All reads and writes go through the generated
Connect client and TanStack Query in client components; the only web server
code is the BFF. The backend owns the domain, persistence, and rules.

## Contract

`contract/` is canonical. Both sides generate from it:

```sh
make generate
```

Generated code lives in `api/gen/` and `web/src/gen/`. Never edit it by hand.
Do not copy the proto into `web/`; there is no sync step.

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

## Hard rules

1. **One repository.** `web/` and `api/` are trees, not submodules. A change
   that crosses the contract lands in one commit.
2. **The contract is canonical at the root.** Change `contract/`, run
   `make generate`, and commit both generated trees.
3. **The web does not own rules.** Computation, secrets, persistence,
   transactions, and cross-record rules belong in `api/`.
4. **The backend does not import transport types into the domain.** Follow the
   layer rules in `api/AGENTS.md`.
5. **No secrets in the repository.** Secrets are injected at summon. The image
   and the source carry names only.
6. **The source is cloned at summon into the workspace root.** The root
   `Dockerfile` adds Go and PostgreSQL; `start.sh` starts the local database
   from `.manus/`, which is ignored by git. Do not bake source into the image.
7. **Before you say done:** `make lint`, `make test`, and the affected web
   checks pass. If the contract changed, both generations ran.
