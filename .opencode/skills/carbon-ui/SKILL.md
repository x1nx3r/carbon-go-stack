---
name: carbon-ui
description: Compose Carbon screens in this template. Use when adding or changing a page, layout, table, form, heading, spacing, theme, or any visual state; when a screenshot looks off; or when deciding which Carbon component to use.
---

# Carbon UI

Carbon supplies components and tokens, not a layout vocabulary. These are the
numbers and the primitives that keep screens consistent; do not re-derive
them per page.

## Layout contract

| Where | Token | Value |
|---|---|---|
| Fixed header | `spacing-09` | 48 px |
| Header → page title | `spacing-07` | **32 px** |
| Page title → description | `spacing-05` | **16 px** |
| Description → content | `spacing-07` | **32 px** |
| Section → section | `spacing-07` | **32 px** |
| Search/toolbar → table | `spacing-06` | 24 px |
| Table → pagination | `spacing-06` | 24 px |
| Page gutter at 1440 | grid | 32 px |

The shell owns the header offset: `src/app/(app)/layout.module.scss` pads the
top by header + `spacing-07`. **Never add shell padding in a page.**

## Mobile

At 390 px (and generally below 42 rem):

- Page gutter is 16 px; the shell gap below the header stays 32 px.
- Form actions stack and become full width; search fields stack.
- Tables hide secondary columns (Email, Created here), keep Name / Status /
  Amount / Actions, and pin the actions column to the end. If the table still
  scrolls, scroll inside the table — never the page.
- Modals are full width; destructive dialogs still focus Cancel.
- Touch targets stay at least 44 px.

## Use the primitives

- **`Page`** (`src/components/page.tsx`) owns the grid, title, description,
  actions and block rhythm. Build every screen with it.
- **`Stack`** for vertical/horizontal rhythm. Numeric gaps are Carbon spacing
  steps: `gap={5}` = 1rem, `gap={6}` = 1.5rem, `gap={7}` = 2rem.
- **`Grid` + `Column`** for the 16-column page grid. At `lg`, `Column 16` is
  the page; do not invent max-widths.
- **`Section` / `Tile`** for semantic grouping; they do not replace `Stack`.

```tsx
<Page
  title="Customers"
  description="…"
  actions={<Button>New customer</Button>}
>
  {/* one block; internal rhythm belongs here */}
</Page>
```

A page returns content inside `Page`; it does not render its own `<h1>` or
top-level margins.

## Rules

- Carbon only: no Tailwind, no other UI kits, no raw hex or ad-hoc px. Use
  `var(--cds-*)` and the spacing/type mixins.
- Carbon components are client components. Keep pages as server shells and put
  interactive composition in a route `_components` file with `"use client"`.
- Table state (page, filters, search) lives in URL search params.
- Theme is one class on `<body>` (`cds--white`, `cds--g10`, `cds--g90`,
  `cds--g100`); do not theme individual components.
- Fonts are IBM Plex from the CDN (`$use-akamai-cdn`); do not add font files.

## States

Every data screen needs all four, with Carbon:

- loading: `DataTableSkeleton` (or a matching Carbon skeleton)
- empty: `InlineNotification` with a concrete next step
- error: `InlineNotification kind="error"`, mapped from `ConnectError.code`,
  not from a string match
- success/feedback: `InlineNotification` or a Carbon modal

Do not ship a spinner in the middle of an empty page; use the skeleton that
matches the final layout.

## Measure, do not eyeball

Agents cannot infer rhythm from code. Measure the rendered gaps and compare
with the table above:

```js
const h = document.querySelector("header").getBoundingClientRect();
const t = document.querySelector("h1").getBoundingClientRect();
console.log(t.top - h.bottom); // 32
```

Then compare the whole page with `docs/visual/*.png` (1440 px). If a number in
this file is wrong for the design, change this file, the `Page` primitive and
the baselines together.
