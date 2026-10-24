# Architecture

Read when adding a feature, a package, an RPC, or a table.

## Layers

```text
cmd → xmodule → handler/connecthandler → usecase → port ← adapter/postgres
```

| Layer | Owns | Must not import |
|---|---|---|
| `entity` | domain types, invariants, status, money/date rules | gorm, proto, net/http, adapters |
| `app/port` | interfaces the app needs | adapters, proto, gorm |
| `app/usecase` | orchestration, validation across fields, domain errors | gorm, proto, net/http, adapters |
| `adapter/postgres` | queries, rows, migrations, pools | handlers, usecases |
| `handler/connecthandler` | proto ↔ entity, Connect codes, request mapping | gorm, SQL, business rules |
| `xmodule` | config, wiring, server lifecycle | — |

Dependencies point inward. A usecase never knows a database exists.

## Adding a feature

1. **ADR and requirements first.** One ADR in `docs/adr/`; agree on scope,
   states, errors and data.
2. **Contract.** Add the RPC/messages to `../contract/`; `make generate`.
3. **Domain.** New entity fields/methods and sentinel errors.
4. **Port.** Add the smallest repository method needed. If the interface grows
   for a second consumer with different needs, split it.
5. **Usecase.** Orchestrate; validate; map repository errors to domain errors.
   Do not put SQL here.
6. **Adapter.** Gorm row + query + conversion; migration if the schema changed.
7. **Handler.** Map request → usecase input → proto response; map domain errors
   to Connect codes. No rules here.
8. **Tests.** Usecase with fakes; handler through a Connect client;
   integration against Postgres for the adapter.
9. **Frontend.** Sync the contract, regenerate, and run the affected screen.

## Common mistakes

- A handler that decides a rule, or a usecase that imports `gorm`.
- A repository interface that mirrors a table instead of the usecase's need.
- A second model type leaking from the adapter into the app.
- Adding a service boundary before there is a second consumer.
- A "temporary" direct query in a handler.
