# Carbon guidance for agents

This is the **decision layer** over the raw Carbon source in `source/`. Read
these files when building a screen; read the source only when this says to.

Status: pilot. `choose-a-component`, `tables` and `forms` are written; the
remaining docs are listed at the end.

## Routing

| Task | Read |
|---|---|
| Compose a page, spacing, header offset | `.opencode/skills/carbon-ui/SKILL.md` |
| Pick a component for a job | `choose-a-component.md` |
| Build a list or data table | `tables.md` |
| Build a create/edit form | `forms.md` |
| Notifications, loading, errors | pending `feedback.md`; use `choose-a-component.md` meanwhile |
| Accessibility or copy rules | pending `accessibility.md` / `content.md` |
| Exact component props | `node_modules/@carbon/react/lib/components/<Name>/<Name>.d.ts` |
| Design rationale / deeper reading | `source/web/...` and `source/react/...` |

Do not read the source tree whole. It is 370 files of MDX and stories; the
routing above is the entry point.

## Ownership

| Fact | Owner |
|---|---|
| Spacing numbers, `Page`, `Stack` | `carbon-ui` skill |
| Component props and types | installed TypeScript definitions |
| When to use what, patterns, states | these docs |
| ERP vocabulary and formatting | `.opencode/skills/erp-domain` |
| Raw Carbon text | `source/` |

If a fact changes, change its owner and everything that links to it. Do not
copy the same rule into two docs.

## Sources

- `source/react/` — component docs and stories from Carbon **v11.119.0**
  (commit `571cd549…`), matching `@carbon/react@1.119.0`.
- `source/web/` — guidelines, patterns, elements and component usage/accessibility
  from the Carbon website at commit `5e9cd1d…` (2026-09-30). Not version-pinned;
  cross-check APIs against the pinned component docs.
- Licenses: `source/LICENSE-carbon`, `source/LICENSE-web` (Apache-2.0).

## Rules for these docs

- One owner per fact; link instead of restating.
- Prefer "use X unless Y" over "consider X".
- Keep each file under ~150 lines; tables and checklists over prose.
- Cite source files at the bottom; update the version header when Carbon moves.
- If a doc and the source disagree, the source wins; fix the doc.

## Pending

- `feedback.md` — notifications, toasts, modals, loading and empty states.
- `accessibility.md` — labels, focus, keyboard, contrast, motion.
- `content.md` — sentence case, action labels, error copy.
- `patterns.md` — page header + actions, detail tabs, destructive confirm,
  filtering, login.
