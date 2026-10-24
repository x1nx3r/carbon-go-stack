# ADR-0001: Backend monolith, hexagonal, Connect

Status: accepted · Date: 2026-10-24

## Context

The template is one repository: `web/` (Next.js + Carbon) and `api/` (this
backend). The backend owns the domain and persistence; the protobuf contract
is canonical at the repository root, in `contract/`. The frontend is
client-only and reaches the backend through a single BFF; it never holds
business rules.

The reference monorepo is hexagonal but split into a `go.work` of per-service
modules. This template does not need service boundaries yet, and a split would
add module, generation and deployment overhead without a consumer.

The monorepo also reaches the browser through grpc-gateway and Swagger. The
frontend now uses Connect directly, so the gateway and OpenAPI document have no
consumer.

## Decision

1. **One Go module, one binary.** `cmd/erp-api` starts the server; no `go.work`,
   no per-service modules. Add a module only when a real boundary earns it.
2. **Hexagonal layers.** `entity` is pure; `app/port` owns interfaces;
   `app/usecase` orchestrates; `adapter/postgres` is mechanical; `handler/connecthandler`
   is transport; `xmodule` wires them.
3. **Connect only.** `connect-go` serves the generated service on one HTTP
   listener. No grpc-gateway, no REST mapping, no OpenAPI. Connect also speaks
   gRPC if an external client needs it later.
4. **Postgres + gorm in the adapter.** `golang-migrate` owns the schema through
   embedded SQL migrations. Gorm types never leave the adapter and
   `AutoMigrate` is forbidden.
5. **The contract is canonical at the repository root.** `contract/` is the one
   proto tree; both `web/` and `api/` generate from it. There is no copied
   contract and no sync step.
6. **Auth is deferred.** The service binds loopback in development and has no
   public exposure. A later ADR defines the auth interceptor, caller identity
   and cookie/token transport through the BFF.
7. **No Dockerfile yet.** Development uses a throwaway Postgres container; the
   backend runs as a host process.

## Consequences

- The layering is enforced by imports and review; unit tests use fakes at the
  port boundary, integration tests use the real Postgres.
- Contract changes require regeneration on both sides; one root `make
  generate` owns the generator for both.
- No REST consumers exist, so HTTP verbs and OpenAPI stop being contract
  concerns. The cost is that non-Connect clients need a generated client or a
  future gateway.
- The template remains small enough for one agent to reason about, while the
  hexagonal shape leaves room for adapters and services later.

## Alternatives considered

- **Keep the monorepo's `go.work` and per-service modules.** Rejected as
  overhead without a service boundary.
- **Keep grpc-gateway and Swagger.** Rejected: the only browser consumer uses
  Connect; a second transport would be a second contract to keep true.
- **gRPC-only, no Connect.** Rejected: browsers cannot speak native gRPC; the
  BFF would need a proxy.
- **gorm `AutoMigrate`.** Rejected: no reviewable schema history and no safe
  rollback.
- **Generate at build/tool time, do not commit `gen/`.** Rejected for a
  template: a fresh clone should build with the Go toolchain alone.
