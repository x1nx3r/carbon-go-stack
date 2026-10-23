---
audience: agent
carbon: 1.119.0
web-snapshot: 5e9cd1d
read-when: choosing feedback for an action, showing status, or handling loading, empty and error states
sources:
  - source/web/patterns/notification-pattern/index.mdx
  - source/web/components/notification/usage.mdx
  - source/web/components/notification/accessibility.mdx
  - source/web/patterns/dialog-pattern/index.mdx
  - source/web/components/modal/usage.mdx
  - source/web/patterns/loading-pattern/index.mdx
  - source/web/patterns/empty-states-pattern/index.mdx
---

# Feedback

## Default

| Situation | Use | Not |
|---|---|---|
| Task succeeded; user should see it in place | `InlineNotification kind="success"` | A toast that disappears before it is read |
| Form/field problem | Inline error on the field; `InlineNotification kind="error"` at the top of the form | A toast for a field error |
| Short, non-critical confirmation | `ToastNotification` (no action) | A toast for a critical or persistent state |
| User must act or decide | `ActionableNotification`, or a modal for a blocking decision | A passive toast |
| Information that loads with the page | `Callout` | A callout for a real-time update |
| Critical, blocking information | Modal | A banner inside the page |
| First load of a container | Skeleton matching the final layout | A spinner in the middle of an empty page |
| One component is processing | Inline loading | Full-screen overlay |
| Whole page is processing | Full-screen loading (or progress if it takes longer) | A silent freeze |
| No data yet | Empty state with one next step | A blank table |
| No results after filtering | Empty state that says so and offers to clear filters | "No data" |

## Notification variants

| Variant | Behaviour |
|---|---|
| Inline | Nondisruptive, in the task flow, persists until resolved or dismissed. Keep under two lines; do not cover content. |
| Toast | Time-based, top right, for short non-critical messages. With an action it persists until dismissed. |
| Actionable | Interactive; persists until acted on or dismissed. Optional actions must not block the task. |
| Callout | Loads with the page, contextual, persistent, cannot be dismissed. Do not use for real-time messages. |
| Banner | System/product level, not task-specific; persists until dismissed. |
| Modal | Blocks the task until resolved; critical information or a decision. |

Statuses: informational, success, warning, error. Color and icon must agree with
the status; do not use color alone.

## Rules

- Use notifications sparingly; match disruptiveness to urgency. High-contrast
  styles are for urgent/critical messages, low-contrast for supplemental.
- Inline notifications belong near the affected area; in forms they can sit at
  the top or bottom. Do not cover other content.
- Toasts are for system messages that do not belong to a specific section.
  Never use a timed message for critical information.
- Actionable notifications may contain interactive elements; optional actions
  must not block the user. Blocking actions are only for critical cases.
- Callouts are for content that is present on first render. Rendering one after
  load may not be announced to screen-reader users.
- A modal is a blocking decision, not a place for a page-sized form; see
  `patterns.md` for destructive confirmation.
- Loading: skeletons only for container/data components (tiles, tables, cards,
  structured lists), not buttons, inputs, toasts, modals or the modal itself.
  A skeleton that lasts more than a few seconds is the wrong tool.
- Empty states: say what will be here, give one next action, no dead ends. For
  no search results, explain and offer to clear the filter.

## Accessibility

- Do not auto-dismiss critical messages; users need time to read them.
- Non-critical notifications should be controllable or avoidable.
- Actionable notifications take focus; do not use them for passive updates.
- Empty-state illustrations are decorative: `alt=""` or `role="presentation"`.
- Inline notifications are announced when rendered; do not rely on color alone.

## Common mistakes

- A toast for a validation error or a failed save.
- A success toast for an action whose result is already visible and persistent.
- A spinner instead of a skeleton for a table or page.
- A skeleton on a button or modal.
- "No data" when the cause is an active filter.
- An empty page with no next step.
- A callout used for a real-time update.

## Verify

- Trigger success, failure, empty (no data) and empty (filtered) states.
- Check the message stays or leaves at the right time and that focus is not
  stolen by a passive notification.
- Screenshot the state; do not only test the happy path.

## Sources

`source/web/patterns/notification-pattern/index.mdx`,
`source/web/components/notification/{usage,accessibility}.mdx`,
`source/web/patterns/dialog-pattern/index.mdx`,
`source/web/patterns/loading-pattern/index.mdx`,
`source/web/patterns/empty-states-pattern/index.mdx`.
