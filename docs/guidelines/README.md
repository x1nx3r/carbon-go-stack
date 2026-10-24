# Backend guidelines

The decision layer for this repo. The code and the ADRs are the source of
truth; when a guideline and the code disagree, fix the guideline.

## Routing

| Task | Read |
|---|---|
| Add or change a feature | `architecture.md` |
| Change a domain rule or validation | `domain.md` |
| Change a query, table, or migration | `persistence.md` |
| Add or change an RPC/error | `connect.md` |
| Write tests | `testing.md` |
| Config, logs, dev database, secrets | `operations.md` |
| Change the proto or sync the frontend | `contract.md` |

## Ownership

| Fact | Owner |
|---|---|
| Architecture decisions | `docs/adr/` |
| Layer and workflow rules | these docs + `AGENTS.md` |
| Wire contract | `proto/` and `gen/` |
| Runtime behaviour | the code |

## Non-negotiables

- This is a template. Ask what is being built, agree requirements, write an
  ADR, then implement.
- One concern per patch.
- Never create a second source of truth for the schema, the contract, or a
  domain rule.
