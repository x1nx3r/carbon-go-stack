---
audience: agent
carbon: 1.119.0
web-snapshot: 5e9cd1d
read-when: writing labels, buttons, errors, empty states or any user-visible copy
sources:
  - source/web/guidelines/content/overview.mdx
  - source/web/guidelines/content/writing-style.mdx
  - source/web/guidelines/content/action-labels.mdx
  - source/web/patterns/forms-pattern/index.mdx
  - source/web/patterns/empty-states-pattern/index.mdx
  - source/web/patterns/notification-pattern/index.mdx
  - source/web/components/data-table/usage.mdx
---

# Content

## Capitalization

- **Sentence case everywhere**: titles, labels, buttons, table headers, tabs,
  notifications, empty states.
- Do not use title case or all caps. Capitalize only the first word and proper
  nouns (product/service names).
- UI elements are not proper nouns: "Create customer", not "Create Customer".
- Abbreviations are allowed only when familiar; expand on first use or use the
  native `<abbr>` element.

## Voice

- Simple words, simple present tense, active voice.
- Talk to the user directly; keep the tone appropriate to the task.
- Avoid dashes, unnecessary abbreviations, acronyms and jargon.
- Keep instructions short. If a sentence needs a diagram, rewrite it.
- Do not blame the user; say what happened and what to do next.

## Labels and actions

- Labels are one to three words, sentence case, no trailing colon.
- Every input has a label. Placeholder text is not a label.
- Button labels name the action: "Create customer", "Save changes", "Delete
  customer". Avoid "Submit", "OK", "Done" where a specific verb works.
- Secondary actions name the negative half: "Cancel", "Discard", "Back".
- Destructive labels say what is destroyed: "Delete customer", not "Remove".
- Link text says the destination or the action, never "Click here".

## Errors

- Plain language, no status codes or internal jargon.
- Say what happened, then how to fix it.
- Put field errors under the field; put form-level errors at the top of the form.
- Do not leave a dead end: every error has a next step.
- Clear the error when the input becomes valid; do not keep stale messages.

Examples:

- Good: "Email must include an @ sign."
- Good: "Could not save the customer. Check your connection and try again."
- Bad: "422 Unprocessable Entity."
- Bad: "Invalid input."

## Empty states

- State what will appear here and why the space is empty.
- One primary next step; do not list several options.
- For no results, say nothing matches and offer to clear the filter or search.
- Be contextual: do not describe other parts of the app.
- Illustrations are decorative; keep copy in text.

## Notifications

- Relevant, timely and informative.
- Task-generated: short, no extensive background.
- System-generated: enough context for a user who was not in the task.
- Provide the next step when one exists.
- Do not use technical codes as the message.

## Tables

- Title: what the rows have in common and why the table exists.
- Description: source or scope, if it helps.
- Column titles: one or two words, sentence case.
- Keep numbers and dates in the format defined by `erp-domain`; do not invent a
  second convention here.

## Common mistakes

- Title Case or ALL CAPS.
- "Submit", "OK", "Done" as the primary action.
- A vague error with no fix.
- "No data" with no next step.
- Placeholder as the label.
- Internal error codes in user copy.
- Mixing sentence case and title case on the same screen.

## Sources

`source/web/guidelines/content/{overview,writing-style,action-labels}.mdx`,
`source/web/patterns/{forms-pattern,empty-states-pattern,notification-pattern}/index.mdx`,
`source/web/components/data-table/usage.mdx`.
