# Testing

Read when adding or changing behaviour, a query, an RPC or a migration.

## Unit tests

- Usecase tests use fakes for `port.CustomerRepository`, `port.Clock` and
  `port.IDs`; no Docker, no Postgres, no gorm.
- Test behaviour and errors, not implementation details.
- Cover the defaults: page clamping, default currency, active status, zero
  balance, clock timestamps.
- Entity validation can be tested directly.

## Handler tests

- Start the generated Connect handler with `httptest`.
- Use the generated client, not raw JSON.
- Assert mapping (status enum, RFC 3339 date) and the Connect code for a domain
  error.

## Integration tests

- Guard with `ERP_INTEGRATION=1`.
- Use the throwaway Postgres (`make db-up`).
- Exercise the adapter round trip: create, get, update, unchanged update, list,
  delete, missing row.
- Skip silently when the guard is absent; never hit the real registry from a
  unit test.

## Commands

```sh
make test
ERP_INTEGRATION=1 go test ./internal/adapter/postgres/
```

## Contract

After a proto change, regenerate on both sides and compare the proto hash. A
frontend and backend copy that differ is a failed change, even if both compile.
