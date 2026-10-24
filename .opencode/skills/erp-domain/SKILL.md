---
name: erp-domain
description: Shared ERP vocabulary and formatting for the template. Use when naming entities, formatting money/dates/IDs, shaping list responses, or deciding who enforces a rule.
---

# ERP domain

This template is a starting point. The Customers slice demonstrates the
conventions; a real product may rename the domain. Keep the rules below unless
the user explicitly changes them.

## Money

- API: integer **minor units** plus an ISO 4217 currency code
  (`balance_minor`, `currency`). Never a float.
- UI: format with `Intl.NumberFormat` in `src/lib/format.ts`; do not hand-build
  currency strings.
- Current helper is safe below 2^53 minor units. If the domain needs larger
  values, use a decimal library rather than converting to `Number`.

## Dates and times

- API: RFC 3339, UTC (`created_at`).
- UI: format at the edge; the template uses `en-GB` medium dates.
- Do not send localized dates back to the API.

## Identifiers

- IDs are opaque strings (`cus_001`). Never parse, sort, or assume a number.
- Do not generate client IDs for persisted records; the backend assigns them.

## Lists

- 1-based `page`, explicit `page_size`, `total`.
- Page, search, filters and page size live in URL search params.
- Do not paginate only in memory when the API already pages.

## States and labels

- Customer states in the template: Active, On hold, Archived.
- Labels are sentence case and always paired with text; color is never the only
  signal.
- Status vocabulary is product language, not API enum names. Do not display
  `CUSTOMER_STATUS_ON_HOLD`.

## Permissions

- The API is authoritative. The UI may hide or disable an action, but that is
  presentation, not enforcement.
- Never assume a hidden button protects data.

## Naming

- Collection: plural (`customers`); entity: singular (`customer`).
- Use the same noun in the page title, table title, button and toast.
- Avoid inventing a second word for the same record ("client", "account").

## Changing the domain

When the user renames or adds an entity:

1. Update the ADR and requirements first (template rule).
2. Change the proto contract, regenerate, update the mock and UI.
3. Update this skill and `docs/carbon/content.md` if the vocabulary changes.
