# Operations

Read when changing config, startup, logging, the dev database or secrets.

## Configuration

Environment, loaded in `internal/xmodule/config.go`:

| Key | Default |
|---|---|
| `ERP_HTTP_ADDR` | `127.0.0.1:8080` |
| `ERP_DATABASE_URL` | throwaway local Postgres |
| `ERP_LOG_LEVEL` | `info` |

Defaults are for development. A deployment must set the DSN and bind address
explicitly; never commit a real DSN.

## Startup

1. Load config.
2. Apply embedded migrations.
3. Open the pool and ping.
4. Start the HTTP server.
5. On SIGTERM/SIGINT, shut down with a timeout.

`/readyz` reflects database reachability; `/healthz` is process liveness.

## Dev database

```sh
make db-up    # postgres:17-alpine, 127.0.0.1:55432, no volume
make seed
make db-down  # deletes the data
```

There is no Dockerfile yet. The backend runs as a host process beside the
throwaway database.

## Logs and secrets

- Use `slog`; no request bodies, passwords, tokens or full DSNs.
- Unknown errors are logged server-side and returned as `internal`.
- Provider keys, database passwords and tokens come from environment/secret
  injection, never from the repository.

## Exposure

Auth is not built. The service binds loopback, and only the Next BFF should
reach it. Do not publish it until the auth ADR defines identity and transport.
