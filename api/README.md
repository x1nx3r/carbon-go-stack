# Go backend (`api/`)

The backend of the merged ERP template: a single Go service that owns the
domain and the database. The frontend is `web/`, a client-only Next app that
speaks Connect through its BFF. The protobuf contract is canonical at the
repository root, in `contract/`.

## Stack

- Go 1.25 single module, single binary
- Connect (`connect-go`) — no grpc-gateway, no OpenAPI
- PostgreSQL 17
- gorm in the adapter only; SQL schema via golang-migrate
- `buf` generation for Go messages and the Connect handler

## Run

From the repository root:

```sh
make db-up       # throwaway Postgres on 127.0.0.1:55432, no volume
make seed        # 10 showcase fixtures for the design slice
make run-api     # http://127.0.0.1:8080
```

`make db-up` is for a host checkout. Inside a manus session the template start
hook starts PostgreSQL automatically; skip it there.

Point the frontend at it:

```sh
API_URL=http://127.0.0.1:8080 npm --prefix web run dev
```

`make db-down` removes the database and its data. The backend runs as a host
process beside the throwaway database. The template environment image provides
Go and PostgreSQL when the session runs it.

## Contract

`../contract/erp/showcase/v1/showcase.proto` is canonical. The frontend
generates its TypeScript from the same file; the backend generates the Go
messages and Connect handler. Run from the repository root:

```sh
make generate          # both sides
make generate-go       # Go only
```

Generated Go lives in `gen/` and is committed, so a clone builds without
running `buf`. `make -C api tools` installs the two Go plugins if needed.

## Layout

```
cmd/erp-api/                 main: config, dependencies, server
cmd/seed/                    dev fixtures for the design slice
internal/
  entity/                    pure domain: ShowcaseItem, Status, validation
  app/port/                  repository, clock, IDs
  app/usecase/showcase/      business operations and domain errors
  adapter/postgres/          gorm queries, connection, pooling
  handler/connecthandler/    Connect service, mapping, error codes
  xmodule/                   config, logger, wiring, HTTP server
migrations/                  embedded golang-migrate SQL
gen/                         generated Go + Connect code
docs/adr/                    decisions
docs/guidelines/             backend rules and recipes
```

The flow is `handler → usecase → port ← postgres`. Gorm types do not escape the
adapter; proto types do not enter the usecase.

## Commands

Run these from the repository root.

| What | Command |
|---|---|
| Run | `make run-api` |
| Seed | `make seed` |
| Unit tests | `make test` |
| Format + vet | `make lint` |
| Regenerate both sides | `make generate` |
| Dev database | `make db-up` / `make db-down` |

## State

Auth is not implemented. The service binds loopback and the BFF forwards
Connect calls; do not expose it publicly until the auth ADR exists. The
template rule applies: ask what is being built, agree the requirements, write an
ADR, then implement.
