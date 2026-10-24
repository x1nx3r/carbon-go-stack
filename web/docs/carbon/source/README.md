# Carbon docs — source dumps

Raw source material for the Carbon guidance in this template. Two sources,
two different guarantees. Neither is transformed yet.

## Component docs — pinned to the installed package

| | |
|---|---|
| Source | <https://github.com/carbon-design-system/carbon> |
| Tag | `v11.119.0` (matches `@carbon/react@1.119.0`) |
| Commit | `571cd549545dd156e11f06fd046eb14efa6a61c3` (2026-10-21) |
| Path | `packages/react/src/components` |
| Contents | 203 `.mdx`, 163 stories, 4 READMEs — `react/components/` |
| Index | `react/INDEX.md` |
| License | Apache-2.0 — `LICENSE-carbon` |

This is the source behind <https://react.carbondesignsystem.com>. It carries
each component's overview, usage notes and code examples. MDX imports
Storybook blocks (`Meta`, `Canvas`, `ArgTypes`), so it is source, not rendered
documentation.

## Guidelines, patterns and elements — site snapshot

| | |
|---|---|
| Source | <https://github.com/carbon-design-system/carbon-website> |
| Commit | `5e9cd1da43c32d3d3b991dc947b427f674da61a8` (2026-09-30) |
| Paths | `src/pages/{guidelines,patterns,elements,components}` |
| Contents | 135 `.mdx` — `web/` (49 guidance + 86 component usage/accessibility) |
| Index | `web/INDEX.md` |
| License | Apache-2.0 — `LICENSE-web` |

This is the design guidance behind <https://carbondesignsystem.com>:
accessibility and content guidelines, patterns (forms, filtering, empty
states, notifications, login, …), elements (2x grid, spacing, typography,
color, themes, icons, motion), and each component's usage and accessibility
pages. Component API and examples stay with the pinned Storybook source.

It is **not** pinned to Carbon 1.119. It is a snapshot of the site at the
commit above. Cross-check component APIs against the pinned component docs and
the installed TypeScript definitions.

## Rules

- **Do not edit these files.** They are provenance, not our documentation.
- Transform them into `docs/carbon/*.md`; keep this directory as the source of
  truth for what was read.
- No images or rendered previews are included.
- On a Carbon bump: re-dump the component docs at the new tag, re-check the
  web snapshot, and update the commits above.
- Text is Apache-2.0; keep the license files with any copied excerpt.
