# Persistence

Read when adding a query, table, migration, index or seed.

## Boundaries

- gorm lives only in `internal/adapter/postgres`.
- Row structs are private to the adapter. Convert to `entity.Customer` at the
  boundary; no gorm type crosses it.
- Repositories receive `entity` values and return `entity` values or
  `port.ErrNotFound`.

## Schema

- Migrations are SQL in `migrations/`, embedded by `migrations/embed.go` and
  applied at startup with golang-migrate.
- Never edit an applied migration; add the next numbered pair.
- Never use gorm `AutoMigrate`; the schema must be reviewable and reversible.
- Use `timestamptz` for times, `bigint` for minor-unit money, `char(3)` for
  currency.
- Add an index with the query that needs it, not speculatively.

## Queries

- Always pass `ctx`.
- Count before applying limit/offset when returning a total.
- Search is case-insensitive (`ILIKE`) and trimmed in the usecase.
- Order deterministically: `created_at DESC, id ASC` today.
- Keep pagination 1-based; clamp the size in the usecase.
- Use a transaction only when more than one write must succeed together.

## Updates

`RowsAffected == 0` is ambiguous in Postgres: it can mean "missing" or "the
values were already identical". The adapter checks existence after a zero-row
update and returns `port.ErrNotFound` only when the row does not exist.

## Errors

- `gorm.ErrRecordNotFound` → `port.ErrNotFound`.
- Wrap unexpected driver errors with context; do not return them to callers
  unchanged.
- The handler logs unknown errors and returns `internal`; the client never sees
  SQL.

## Seeding

`cmd/seed` uses the same 23 records and IDs as the frontend mock, so the UI and
its visual baselines can be exercised against the real stack. Seed is
idempotent: existing IDs are skipped.
