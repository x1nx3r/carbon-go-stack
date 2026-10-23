---
audience: agent
carbon: 1.119.0
web-snapshot: 5e9cd1d
read-when: building or changing a list, data table, toolbar, filters, or pagination
sources:
  - source/web/components/data-table/usage.mdx
  - source/web/components/structured-list/usage.mdx
  - source/web/patterns/filtering/index.mdx
  - source/web/patterns/empty-states-pattern/index.mdx
  - source/react/components/DataTable/DataTable.mdx
---

# Tables

## Default

- **Interactive data** (sort, select, expand, batch actions, toolbar): use
  `DataTable` and its parts.
- **Simple read-only list** with server-side pagination and URL filters: use
  `Table` primitives plus `Pagination`. This is the template's convention and
  what `src/app/(app)/customers/_components/customers-page.tsx` does.
- **Key/value, features or pricing comparison:** `StructuredList`, not a table.
- **Small confined list:** `ContainedList`.

Do not hand-roll table markup, and do not use a spreadsheet-like grid.

## Order

```
Page title + description        (Page primitive)
Toolbar: title, actions, search, filters
Table
Pagination                      (always at the bottom)
```

- The table title says what the rows have in common and why the table exists;
  the description adds source or scope. Both use sentence case.
- Column titles are one or two words, sentence case. Wrap long titles to two
  lines, then truncate; the full text goes in a tooltip.

## Toolbar

Reserved for global actions: settings, complex filters, export, editing.

- Up to five actions. More go into an overflow menu or combo button.
- Allowed button kinds: primary, ghost, icon-only.
- Search sits in the toolbar or just below the title, aligned left; it can be
  collapsed behind an icon or always open.
- Filters belong in the toolbar or above the table. Multiple filter categories
  go vertically at the side or horizontally at the top — never inside a menu.
- Batch actions appear only when rows are selected, and state how many rows
  they affect.

## Size

- Five row sizes exist. The header row must match the body row size.
- Tall toolbars pair with large/extra-large rows; small toolbars with
  small/extra-small rows.
- Extra-large rows are only for rows expected to wrap to two lines.

## Selection and expansion

- Single selection uses radio buttons; multi-selection uses checkboxes.
- Batch actions apply to the selected set and need a clear count.
- Expansion is for progressive disclosure of row detail, not for hiding the
  primary content.
- Selection state is not a substitute for a filter.

## Search and filtering

- **Filtering** narrows a large set by attributes. Single selection behaves like
  radio; multiselect like checkboxes.
- Use **instant** filtering when the result is fast; use **Apply filters** when
  the user makes several choices or the query is slow.
- Always provide a way to reset filters, and show which filters are active.
- Do not use search when the list is short enough to scan.

## States

| State | UI |
|---|---|
| Loading | `DataTableSkeleton` matching the final column count; no spinner alone |
| Empty (first use) | Title explaining what will appear, a positive next step, primary action |
| Empty (filtered) | Say nothing matches and offer to clear the filter |
| Error | `InlineNotification kind="error"` with a retry action |
| Refreshing | Keep the rows visible; mark the table busy instead of replacing it |

Empty states are not an afterthought: the table, its toolbar and its pagination
should make sense with zero rows.

## Mobile

- Hide secondary columns before shrinking the essential ones. In the golden
  slice, Email and Created are hidden below 42 rem; Name, Status, Balance and
  Actions remain.
- Pin the actions column to the end so row actions stay reachable without
  scrolling.
- If the table still cannot fit, scroll inside the table only. The page must
  never scroll horizontally.
- Keep cell padding tighter on small screens; do not drop below the Carbon
  spacing tokens.

## Template conventions

- Amounts are right-aligned; names, emails and dates are left-aligned. Do not
  center data columns.
- List state (page, query, filters) lives in URL search params.
- Keep the rhythm: toolbar→table and table→pagination are `spacing-06`
  (24 px). See `carbon-ui`.

## Common mistakes

- Pagination above the table, or missing when the set is large.
- More than five toolbar actions, or a toolbar without a title.
- Mixing header and row sizes.
- A table with no empty, loading or error state.
- Filters that do not reset, or applied filters that are invisible.
- Using DataTable for a static key/value list.

## Verify

- Measure: header→title 32, title→description 16, toolbar→table 24,
  table→pagination 24.
- Screenshot at 1440 and compare `docs/visual/customers-1440.png`.
- Check zero results, a failed request, and a slow request.

## Sources

`source/web/components/data-table/usage.mdx`,
`source/react/components/DataTable/DataTable.mdx`,
`source/web/patterns/filtering/index.mdx`,
`source/web/patterns/empty-states-pattern/index.mdx`.
