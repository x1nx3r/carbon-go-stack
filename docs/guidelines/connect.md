# Connect transport

Read when adding an RPC, an error, a health endpoint or an interceptor.

## Server

- `connect-go` serves `erp.customers.v1.CustomersService` on one listener.
- No grpc-gateway, no REST mapping, no OpenAPI. If a non-Connect client appears,
  connect-go can also serve gRPC on the same handler.
- `/healthz` is liveness; `/readyz` pings Postgres.
- The server binds loopback by default and shuts down gracefully.

## Handler rules

`internal/handler/connecthandler` is transport only:

1. Read the proto request.
2. Call one usecase method.
3. Map the domain result back to proto.
4. Map domain errors to Connect codes.

It must not query the database, decide a domain rule, or read config directly.

## Error codes

| Domain | Connect code |
|---|---|
| `ErrNotFound` | `not_found` |
| `ErrInvalid` | `invalid_argument` |
| `ErrConflict` | `already_exists` |
| unknown | `internal` (log the cause, hide the detail) |

The client should branch on the code, not on the message.

## Interceptors

- Logging: one line per RPC with procedure, code and duration.
- Recovery: panic → `internal`, never a dropped connection.
- Auth is **not implemented**. Add it as a later ADR with a Connect interceptor
  and an agreed caller identity; do not invent a half-auth path.

## Frontend path

The Next BFF forwards `Host`, body and cookies to
`http://127.0.0.1:8080/erp.customers.v1.CustomersService/...`. The backend does
not need CORS while the BFF is the only caller.
