# Go backend (`api/`) — agent guide

This is the backend of `carbon-go-stack`: one Go service that owns the domain
and the database. The frontend is `web/`; the protobuf contract is canonical at
the repository root, in `contract/`.

## This is a template, not the product

The Showcase service is the worked example. It exists to demonstrate the
backend layers and the design reference; do not infer the product from it.

1. **Ask the user what they are building** and what the requirements are.
2. Discuss scope, data, states and constraints.
3. **Write an ADR in `docs/adr/` first** (next number), covering the decision,
   scope and consequences; get agreement before coding.
4. Implement after that, one concern per patch.

Trivial typo or style fixes are not building; anything that adds or changes
behaviour needs an ADR.

Read `docs/guidelines/README.md` for the backend rules: layers, domain,
persistence, Connect, testing, operations and the contract.

## Layer rules

- `internal/entity` is pure Go. No gorm, proto, HTTP or adapter imports.
- `internal/app/port` owns interfaces. Keep them small; the adapter implements
  them. Ports report facts; they do not retry or wait.
- `internal/app/usecase` orchestrates domain operations and depends only on
  entities and ports. No SQL, gorm, proto or net/http.
- `internal/adapter/postgres` is mechanics: queries, migrations, pooling. Gorm
  types never leave this package; convert to entities at the boundary.
- `internal/handler/connecthandler` is transport: proto ↔ entity, Connect
  errors, request context. No business rules.
- `internal/xmodule` is the only package that knows concrete adapters exist.

## Transport

- Connect only. `connect-go` serves the generated service; there is no
  grpc-gateway and no OpenAPI document. If an external gRPC client appears
  later, connect-go can serve it on the same handler/port.
- Domain errors map to Connect codes: `ErrNotFound` → `not_found`,
  `ErrInvalid` → `invalid_argument`, `ErrConflict` → `already_exists`.
  Unknown errors are logged and become `internal`; never leak driver text.
- `/healthz` is liveness; `/readyz` pings the database.

## Contract

- `../contract/` is canonical. The frontend generates its TypeScript from the
  same file; there is no copied proto and no sync script.
- `make generate` from the repository root runs both sides. `make generate-go`
  runs only the Go generators. `gen/` is generated: never edit it by hand.
- If you change the proto, regenerate both sides and run both suites.
- Keep field numbers and the `erp.showcase.v1` service name stable; run
  `buf breaking` against the released contract when changing it.
- Auth is later. Do not invent a protected endpoint until the auth ADR defines
  the interceptor and caller identity.

## Data

- Postgres only. Schema changes are SQL migrations in `migrations/`; never use
  gorm `AutoMigrate`.
- Money is `int64` minor units plus a currency code. Dates are UTC; the
  transport formats RFC 3339.
- IDs are opaque strings. Runtime IDs are UUIDs; fixtures use `show_001…` so
  the UI baselines stay stable.
- List queries are 1-based with an explicit page size and a total.

## Commands

Run these from the repository root.

| What | Command |
|---|---|
| Run | `make run-api` |
| Seed | `make seed` |
| Unit tests | `make test` |
| Format + vet | `make lint` |
| Regenerate both sides | `make generate` |
| Throwaway DB | `make db-up` / `make db-down` |

`make db-up` is for a host checkout. Inside a manus session the template start
hook starts PostgreSQL automatically; skip it there.

## Before you say done

- `make lint` and `make test` pass.
- Integration/E2E paths were exercised against the real Postgres, not only the
  fake repository.
- If the proto changed, both sides were regenerated and both suites ran.
- If a rule changed, update the ADR or this guide.
