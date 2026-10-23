---
audience: agent
carbon: 1.119.0
web-snapshot: 5e9cd1d
read-when: assembling a screen from parts — headers, detail tabs, create/edit, delete, login, disabled states
sources:
  - source/web/patterns/common-actions/index.mdx
  - source/web/patterns/dialog-pattern/index.mdx
  - source/web/patterns/login-pattern/index.mdx
  - source/web/patterns/status-indicator-pattern/index.mdx
  - source/web/patterns/disabled-states/index.mdx
  - source/web/patterns/read-only-states-pattern/index.mdx
  - source/web/components/tabs/usage.mdx
  - source/web/components/modal/usage.mdx
---

# Patterns

This is the assembly layer. The details live in the linked docs; do not repeat
them here.

## Page header and actions

Use the `Page` primitive: title, description, actions, content. The shell owns
the header offset; `Page` owns the block rhythm. See `carbon-ui`.

- One primary action per page. It goes in the page actions, not floating in the
  content.
- Actions are sentence case and task-specific ("New customer", not "Add").
- Page titles are sentence case; the description is one or two short sentences.
- Do not add a second page-level title inside the content.

## Detail screens

Use tabs when a detail screen has related groups the user moves between without
leaving the task (overview, activity, settings).

- Do not use tabs to filter the same content (ContentSwitcher), to show a
  step-by-step process (ProgressIndicator), or where the user must compare
  groups.
- One tab is selected; the URL should carry it if the screen is shareable.
- Keep the page title and actions above the tabs; do not duplicate them per tab.

## Create and edit

- Default: a full page using `Page` and the form requirements in `forms.md`.
- A modal is for a short, focused task; never a page-sized form.
- Edit screens use the same field order and labels as create; do not invent a
  second layout.

## Delete and other destructive actions

Match the confirmation to the impact:

| Impact | Treatment |
|---|---|
| Low — trivial to undo or recreate | Delete on click; no confirmation |
| Moderate — cannot be undone or is more than one item | Danger modal that names the item and the consequence |
| High — expensive to recreate or deletes related data | Danger modal **and** type the resource name to confirm |

- Use a danger button and a danger modal for confirmation.
- After deletion, return to the list, remove the row, and show a success
  notification. If deletion fails, keep the row and show an error with a next
  step.
- The modal's primary action names the deletion ("Delete customer"), not "OK".
- Cancel takes initial focus in a destructive dialog (see `accessibility.md`).

## Filtering and search

Covered in `tables.md`. In short: filters narrow a large set, search finds a
needle in it, state lives in the URL, and there is always a reset.

## Login

- Use the login pattern when the user must enter the app or has been logged out.
- Progressive authentication: ask only for what the current step needs; do not
  show a wall of fields.
- After an inactivity logout, return the user to the page they were on.
- Validation and error copy follow `content.md`; do not expose internal codes.

## Disabled, read-only and hidden

- **Disabled** is temporary and caused by a dependency or prerequisite. It stays
  visible and returns to enabled when the condition clears. If it affects the
  primary action, explain how to enable it with an inline notification.
- **Read-only** is for content the user may read but not change. It stays
  accessible to screen readers and has no interactive styling.
- **Hidden** is for content the user may not see at all (permissions). Do not
  use hidden as a substitute for disabled.
- Do not disable a primary action as a way to avoid explaining an error; see
  `forms.md` for short vs long forms.

## Status indicators

- Use one only when the status changes what the user does, or when it is
  significant enough to scan. Otherwise use plain text.
- Consolidating several statuses: use the highest-attention color.
- Do not rely on color alone; combine symbol/shape/text (at least three
  elements).
- More than five or six indicators on a screen is noise; reduce.
- Tags are for categories and filters; status indicators are for state.

## Common mistakes

- Two page-level primaries.
- Tabs used as filters or as a progress indicator.
- A modal for a full record form.
- Deleting a moderate/high-impact record with no confirmation.
- A disabled primary action with no explanation.
- Color-only status, or a screen full of status dots.
- Edit and create forms with different field orders.

## Sources

`source/web/patterns/{common-actions,dialog-pattern,login-pattern,status-indicator-pattern,disabled-states,read-only-states-pattern}/index.mdx`,
`source/web/components/{tabs,modal}/usage.mdx`.
