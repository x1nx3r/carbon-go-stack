# Visual baselines

Reference screenshots of the template at **1440 px wide**. They are not golden
tests; they exist so an agent (or a person) can compare a change against the
intended rhythm instead of judging "looks fine" from code.

- `dashboard-1440.png` — `/`
- `customers-1440.png` — `/customers`, loaded state
- `customers-new-1440.png` — `/customers/new`, empty form
- `customers-edit-1440.png` — `/customers/<id>/edit`, prefilled form
- `delete-modal-1440.png` — the danger confirmation for deleting a customer

Mobile, **390 px** wide:

- `dashboard-390.png`
- `customers-390.png` — Email and Created are hidden; actions stay pinned
- `customers-new-390.png` — full-width stacked actions
- `customers-edit-390.png`
- `delete-modal-390.png` — full-width dialog, Cancel focused

The Next dev indicator is disabled in `next.config.ts`, so screenshots stay
clean.

## The numbers these screenshots encode

| Where | Value |
|---|---|
| Fixed header | `3rem` / 48 px |
| Header → page title | `2rem` / 32 px |
| Page title → description | `1rem` / 16 px |
| Description / header → page content | `2rem` / 32 px |
| Search row → table | `1.5rem` / 24 px |
| Form fields | `2rem` / 32 px |
| Last form field → actions | `3rem` / 48 px |
| Form width | 40rem (single column) |
| Table → pagination | `1.5rem` / 24 px |
| Page gutter at 1440 | 32 px (Carbon grid) |
| Mobile page gutter | 16 px |
| Mobile form actions | full width, stacked |
| Mobile table | Email/Created hidden; actions sticky |
| Mobile modal | full width |

These come from Carbon spacing tokens (`05` = 1rem, `06` = 1.5rem,
`07` = 2rem). The live contract is in
`.opencode/skills/carbon-ui/SKILL.md`.

## Regenerating

```sh
npm run mock   # terminal 1
npm run dev    # terminal 2

# at a 1440px-wide viewport
# /            → docs/visual/dashboard-1440.png
# /customers   → docs/visual/customers-1440.png
```

Measure, do not eyeball: compare `getBoundingClientRect()` gaps with the
table above, then compare the whole page with the image.
