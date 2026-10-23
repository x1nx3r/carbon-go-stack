---
audience: agent
carbon: 1.119.0
web-snapshot: 5e9cd1d
read-when: adding an icon, changing a theme, or adding motion/transitions
sources:
  - source/web/elements/icons/usage.mdx
  - source/web/elements/themes/overview.mdx
  - source/web/elements/motion/overview.mdx
  - source/web/components/button/accessibility.mdx
---

# Icons, themes and motion

Short appendix; the core rules are in `carbon-ui`, `accessibility` and `content`.

## Icons

- Import from `@carbon/icons-react`; do not draw custom SVG icons for standard
  actions.
- Sizes: 16 and 20 px pair with 14 and 16 px IBM Plex; 24 and 32 px are for
  larger moments. Keep one size per context.
- Touch targets for interactive icons are at least **44 px**, even when the
  icon is smaller (add padding).
- Icons are solid, monochromatic, and use the same contrast as text (4.5:1).
  Match the icon color to the adjacent text.
- Center-align an icon next to text; do not baseline-align it.
- An icon-only control needs an accessible name and a tooltip; the icon must
  still communicate the action (see `accessibility.md`).
- Do not use an icon as decoration where it implies an action.

## Themes

Carbon ships four themes: **White** (default), **Gray 10**, **Gray 90** and
**Gray 100**. The template applies one theme class on `<body>`
(`cds--white`, `cds--g10`, `cds--g90`, `cds--g100`).

- Theme through tokens, never through component overrides or raw colors.
- Tokens are role-based and stable across themes; values change. A component
  that looks right in White must be checked in the other themes you support.
- Do not mix themes inside one surface. Nested regions may use a different theme
  only when there is a real boundary (for example a modal), and the contrast
  rules still apply.
- A custom theme is a Sass configuration of token values, not a second design
  system. Keep it in one place and document it.
- Fonts follow the theme typography tokens; do not override the family locally.

## Motion

- Carbon components already carry their micro-interactions. Do not re-animate
  buttons, dropdowns or modals.
- UI-level motion (page transitions, reveal, stagger) is a product decision.
  Use it only when it serves a purpose: feedback, guidance, or reducing
  cognitive load.
- **Productive** motion is for frequent, functional interactions; it is fast.
  **Expressive** motion is for rare, important moments; use it sparingly.
- Easing: standard for movement on screen, entrance for appearing, exit for
  disappearing. Do not invent curves.
- Duration follows size and distance. Use the Carbon tokens rather than
  arbitrary values: `duration-fast-01` 70 ms, `fast-02` 110 ms,
  `moderate-01` 150 ms, `moderate-02` 240 ms, `slow-01` 400 ms, `slow-02`
  700 ms.
- Ask what problem the motion solves. If there is no answer, remove it.
- Consider simplified or reduced motion for small screens and for users who
  prefer less movement.

## Common mistakes

- An icon-only button with no label or tooltip.
- A 24 px icon inside a 24 px touch target.
- Hardcoded colors that only work in one theme.
- A custom theme spread across components.
- Animating a Carbon component that already animates.
- Expressive motion on every page transition.

## Sources

`source/web/elements/icons/usage.mdx`,
`source/web/elements/themes/overview.mdx`,
`source/web/elements/motion/overview.mdx`,
`source/web/components/button/accessibility.mdx`.
