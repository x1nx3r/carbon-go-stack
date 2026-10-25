# Visual baselines

Reference screenshots of the template at **1440 px wide**. They are not golden
tests; they exist so an agent (or a person) can compare a change against the
intended rhythm instead of judging "looks fine" from code.

- `landing-1440.png` — `/`, static lorem-ipsum landing page
- `design-1440.png` — `/design`, catalogue, primitive gallery, and live showcase table
- `design-form-1440.png` — `/design`, create form in the dialog
- `design-delete-1440.png` — `/design`, danger confirmation

Mobile, **390 px** wide:

- `landing-390.png`
- `design-390.png` — catalogue, stacked primitive examples, and live table
- `design-form-390.png` — full-width stacked form
- `design-delete-390.png` — full-width dialog, Cancel focused

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
| Mobile table | Owner/Updated hidden; actions sticky |
| Mobile modal | full width |
| Numeric columns | right-aligned |
| Page actions | links or buttons, chosen by task |

These come from Carbon spacing tokens (`05` = 1rem, `06` = 1.5rem,
`07` = 2rem). The live contract is in
`../../../.opencode/skills/carbon-ui/SKILL.md`.

## Regenerating

```sh
make db-up
make seed
make run-api       # terminal 1
make web-dev       # terminal 2

# at a 1440px-wide viewport
# /        → docs/visual/landing-1440.png
# /design  → docs/visual/design-1440.png
```

Measure, do not eyeball: compare `getBoundingClientRect()` gaps with the
table above, then compare the whole page with the image.
