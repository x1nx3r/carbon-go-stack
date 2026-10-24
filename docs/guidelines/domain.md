# Domain

Read when changing the Customer shape, validation, IDs, money, dates or status.

## Entity

`internal/entity/customer.go` is the source of domain truth.

- `NewCustomer` creates an **active** customer with a zero balance and a UTC
  timestamp. Missing currency defaults to `USD`.
- `Update` changes only the fields a client may edit: name, email, currency.
  Status and balance belong to later workflows.
- Setters validate and normalise: trimmed names, parsed email, three-letter
  uppercase currency.
- Keep the entity free of proto, SQL, JSON tags and HTTP concerns.

## Errors

Usecase sentinels in `internal/app/usecase/customers`:

- `ErrNotFound` — the record does not exist.
- `ErrInvalid` — a domain rule failed; wrap the cause.
- `ErrConflict` — uniqueness or state conflict (when a workflow adds one).

Adapters translate `gorm.ErrRecordNotFound` to `port.ErrNotFound`; the usecase
translates that to `ErrNotFound`. Handlers translate the domain errors to
Connect codes. Never leak driver text to a client.

## Values

- **IDs** are opaque strings. Runtime IDs are UUIDs; fixtures use `cus_001…` so
  frontend baselines stay stable. Never parse an ID.
- **Money** is `int64` minor units plus an ISO 4217 code. No floats.
- **Dates** are UTC. The handler formats RFC 3339; the database stores
  `timestamptz`.
- **Status** is a domain enum with numeric values matching the proto enum.
  Clients do not set it yet.

## Where validation lives

- Field shape and invariants: entity.
- Cross-record or workflow rules: usecase.
- Request shape: handler, before calling the usecase.
- Database constraints: migrations, as a backstop only.

Do not duplicate a rule in all three places; choose the owner and test it
there.
