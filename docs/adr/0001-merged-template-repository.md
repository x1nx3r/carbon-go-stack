# ADR-0001: One merged template repository

Status: accepted · Date: 2026-10-24

## Context

The first pair was built as two repositories: `next-carbon` (frontend) and
`backend-monolithrepo` (backend). The protobuf contract lived in the backend
and the frontend kept a copied tree plus a sync script. A frontend change, a
backend change, and a contract change could land in three different commits.
The copy made drift possible; the sync script hid it.

The template is a scaffold. A team forks it, owns it, and diverges. The source
is the product, not a set of version pins. The alternative, a composition repo
with pinned frontend and backend commits, adds a superproject and a second git
model for a property templates do not need.

## Decision

1. **One repository per template.** The template is `carbon-go-stack`:
   `web/`, `api/`, `contract/`, and root template files.
2. **`web/` and `api/` are trees, not repositories.** There are no submodules
   and no pins. One commit describes the source.
3. **`contract/` is canonical at the root.** Both sides generate from it.
   There is no copied proto and no sync step.
4. **One root generator.** `make generate` runs the Go and TypeScript
   generators against the root `buf.yaml`; generated code is committed in
   `api/gen/` and `web/src/gen/`.
5. **The image remains environment-only.** The root environment files add Go
   and PostgreSQL. Source is cloned at summon, not baked.
6. **The standalone repositories become origins.** They are not maintained in
   parallel; doing so would recreate the drift this decision removes.

## Consequences

- Frontend, backend, and contract changes land atomically.
- The pair's history is preserved under `web/` and `api/` via subtree merges.
- Templates diverge. A fix in one template does not reach another; that is the
  accepted cost of a scaffold.
- The root `Makefile` and `buf` configs become the shared interface. Per-tree
  docs still own their rules.
- The contract is one source of truth. A UI change that needs a backend RPC
  changes the proto in the same commit.

## Out of scope

- Shared code or automatic updates across templates.
- A second template variant.
- Publishing the standalone repositories again.
