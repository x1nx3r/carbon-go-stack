---
audience: agent
carbon: 1.119.0
web-snapshot: 5e9cd1d
read-when: building any interactive screen, or when a review asks about keyboard, labels, focus or contrast
sources:
  - source/web/guidelines/accessibility/overview.mdx
  - source/web/guidelines/accessibility/keyboard.mdx
  - source/web/guidelines/accessibility/color.mdx
  - source/web/guidelines/accessibility/developers.mdx
  - source/web/components/button/accessibility.mdx
  - source/web/components/modal/accessibility.mdx
  - source/web/components/text-input/accessibility.mdx
  - source/web/components/data-table/accessibility.mdx
  - source/web/components/notification/accessibility.mdx
  - source/web/patterns/empty-states-pattern/index.mdx
---

# Accessibility

Carbon components follow the IBM Accessibility Checklist (WCAG AA, Section 508).
That covers the component; **usage can still break it**. These are the usage
rules that matter most in this template.

## Keyboard

- Every interactive element is reachable and operable by keyboard.
- Tab order follows the DOM, in a logical top-to-bottom, left-to-right flow.
  Do not reorder with CSS in a way that diverges from the DOM.
- Never remove the focus indicator. Style it if needed; do not hide it.
- Use native elements: `button`, `a`, `input`, `form`, `header`, `nav`, `main`,
  `footer`. A `div` with a click handler is not a button.
- Double up mouse-only events (`mouseover`/`mouseout`) with focus/blur or use
  native controls.
- Use landmarks so screen-reader users can jump between regions. The shell
  provides a skip link; keep it first in the tab order.

## Labels

- Every input has a visible label associated with it. Placeholder text is not a
  label. Helper text is announced via `aria-describedby`.
- Icon-only buttons need an accessible name and a visible tooltip; the icon must
  still communicate the action.
- Link text says where it goes ("Read more about pricing"), not "Click here".
- Error text is associated with its field and announced.
- Do not rely on color alone to convey status or meaning.

## Tables

- Use real table semantics: `<th>` for headers, `scope` where needed, and a
  `<caption>` (or summary) describing the table.
- Sortable columns show the sort indicator on hover and focus; a sorted column
  keeps its indicator. Carbon's DataTable handles the mechanics; the design must
  state that a table is sortable.
- Controls inside cells need their own labels; do not rely on the row for
  meaning.

## Modals and focus

- A modal takes focus on appearance and traps Tab until it closes.
- Initial focus: the primary button for a confirmation, the **cancel** button
  for a destructive action, and the first input for a transactional dialog.
- Escape closes; Enter/Space activates the focused button.
- When the modal closes, the user returns to the trigger. Do not strand focus at
  the top of the page.

## Color and contrast

| Element | Minimum |
|---|---|
| Standard text | 4.5:1 |
| Large text (≥24px, or ≥19px semibold) | 3:1 |
| UI components and boundaries | 3:1 |

- Do not use color alone for status, error or category. Pair it with text and an
  icon.
- Check text over images/gradients at every position it appears.
- Use Carbon themes and tokens; a custom color is an accessibility review.

## Notifications

- Do not auto-dismiss critical or emergency messages; users need time to read.
- Non-critical notifications should be manageable or avoidable.
- Passive notifications should not steal focus. Actionable notifications may,
  because the action is the point.

## Images

- Decorative images (empty-state illustrations, ornament) get `alt=""`; they
  should not carry information. If the image carries meaning, give it real alt
  text.

## Common mistakes

- `outline: none` with no replacement focus style.
- A clickable `div` or a link repurposed as a button without keyboard support.
- An icon-only button with no accessible name.
- Placeholder used as the label.
- Status by color alone (a green dot with no text).
- A modal that does not trap focus or does not return focus on close.
- A table built from divs, or without headers.

## Verify

1. Navigate the screen with Tab only; every action is reachable and the focus
   ring is visible.
2. Open and close a modal with the keyboard; focus enters, stays and returns.
3. Inspect names in the accessibility tree for icon-only buttons and inputs.
4. Check text/background contrast against the table above.
5. Confirm no message conveys meaning by color alone.

## Sources

`source/web/guidelines/accessibility/{overview,keyboard,color,developers}.mdx`,
`source/web/components/{button,modal,text-input,data-table,notification}/accessibility.mdx`,
`source/web/patterns/empty-states-pattern/index.mdx`.
