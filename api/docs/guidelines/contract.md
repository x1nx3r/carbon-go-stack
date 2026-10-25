# Contract

Read when changing a message, an RPC, a field number, or regenerating either
side.

## Ownership

- `../contract/` at the repository root is canonical.
- The frontend generates its TypeScript from the same file; there is no copied
  proto.
- The generated Go (`gen/`) is committed so a clone builds without `buf`.

## Change flow

1. Change the proto in `../contract/`.
2. From the repository root, run `make generate` (Go and TypeScript).
3. Run both test/build suites.

## Rules

- Never reuse or renumber a field; reserve removed numbers/names.
- Keep the service name `erp.showcase.v1.ShowcaseService` and the package
  stable.
- Run `buf lint`; run `buf breaking` against the released contract when you
  change it.
- No OpenAPI/Swagger generation. The proto is the only contract.
- `gen/` and `web/src/gen/` are generated: never edit them by hand.
- The contract is one file tree; there is no backend/frontend disagreement to
  resolve.
