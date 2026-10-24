# backend-mono(lith)repo

The backend half of the ERP template pair: a single Go service that owns the
domain, the database and the protobuf contract. The frontend is `next-carbon`;
it is a client-only Next app that speaks Connect through its BFF.

## Stack

- Go 1.25 single module, single binary
- Connect (`connect-go`) — no grpc-gateway, no OpenAPI
- PostgreSQL 17
- gorm in the adapter only; SQL schema via golang-migrate
- `buf` generation for Go messages and the Connect handler

## Run

```sh
make db-up       # throwaway Postgres on 127.0.0.1:55432, no volume
make seed        # 23 fixture customers, same IDs as the frontend mock
make run         # http://127.0.0.1:8080
```

Point the frontend at it:

```sh
# in next-carbon
npm run api:sync                 # copy this proto into the frontend
API_URL=http://127.0.0.1:8080 npm run dev
```

`make db-down` removes the database and its data. There is deliberately no
Dockerfile yet; the backend currently runs as a host process beside the
throwaway database.

## Contract

`proto/erp/customers/v1/customers.proto` is canonical here. The frontend keeps
a pinned copy and regenerates its TypeScript from it; the backend generates the
Go messages and Connect handler:

```sh
make generate
```

Generated code lives in `gen/` and is committed, so a clone builds without
running `buf`. `make tools` installs the two plugins if needed.

## Layout

```
cmd/erp-api/                 main: config, dependencies, server
cmd/seed/                    dev fixtures (same 23 records as the mock)
internal/
  entity/                    pure domain: Customer, Status, validation
  app/port/                  repository, clock, IDs
  app/usecase/customers/     business operations and domain errors
  adapter/postgres/          gorm queries, connection, pooling
  handler/connecthandler/    Connect service, mapping, error codes
  xmodule/                   config, logger, wiring, HTTP server
migrations/                  embedded golang-migrate SQL
proto/                       source of truth
gen/                         generated Go + Connect code
docs/adr/                    decisions
```

The flow is `handler → usecase → port ← postgres`. Gorm types do not escape the
adapter; proto types do not enter the usecase.

## Commands

| What | Command |
|---|---|
| Run | `make run` |
| Seed | `make seed` |
| Unit tests | `make test` |
| Format + vet | `make lint` |
| Regenerate | `make generate` |
| Dev database | `make db-up` / `make db-down` |

## State

Auth is not implemented. The service binds loopback and the BFF forwards
Connect calls; do not expose it publicly until the auth ADR exists. The
template rule applies: ask what is being built, agree the requirements, write an
ADR, then implement.
