# Contract

Read when changing a message, an RPC, a field number, or syncing the frontend.

## Ownership

- `proto/` in this repo is canonical.
- The frontend keeps a pinned copy under `proto/` and generates its TypeScript
  from it.
- The generated Go (`gen/`) is committed so a clone builds without `buf`.

## Change flow

1. Change the proto here.
2. `make generate` (Go messages + Connect handler).
3. In the frontend: `npm run api:sync`, then `npm run api:generate`.
4. Run both test/build suites.

## Rules

- Never reuse or renumber a field; reserve removed numbers/names.
- Keep the service name `erp.customers.v1.CustomersService` and the package
  stable.
- Run `buf lint`; run `buf breaking` against the released contract when you
  change it.
- No OpenAPI/Swagger generation. The proto is the only contract.
- `gen/` is generated: never edit it by hand.
- When the two repos disagree, the backend proto wins.

## Compatibility

Additive fields are safe. Renaming a field, changing its type, or changing an
enum meaning is a breaking change; write an ADR and coordinate the frontend
release with the backend release.
