---
audience: agent
carbon: 1.119.0
web-snapshot: 5e9cd1d
read-when: building or changing a create/edit form, validation, or form actions
sources:
  - source/web/patterns/forms-pattern/index.mdx
  - source/web/components/text-input/usage.mdx
  - source/web/components/dropdown/usage.mdx
  - source/web/components/button/usage.mdx
  - source/web/patterns/notification-pattern/index.mdx
  - source/web/guidelines/content/action-labels.mdx
---

# Forms

## Default

- **Create/edit on a page:** a full-page form using `Page`, with sections,
  fields and actions at the bottom. This is the default for ERP records.
- **Short, focused task:** a modal or side panel. Do not put a page-sized form
  in a dialog; dialogs are for short tasks and focused decisions.
- **Never** use a modal the user did not trigger.

## Structure

1. Page title and a short description (`Page`).
2. Form sections with a group heading; group related fields in a predictable
   order (for example, identity before contact details).
3. Fields, top-aligned.
4. Actions at the bottom: primary, then secondary.

Use `<form>` semantics. A `Form` component is the container; `FormGroup` gives a
section a legend.

## Labels

- Every input has a visible label. No placeholder-only fields.
- Sentence case, one to three words, no trailing colon.
- Labels state the input; they are not helper text.
- Top-aligned labels are Carbon's default and the only arrangement offered.
- Use helper text for format or context; keep it short.

## Required and optional

- If most fields are required, mark only the optional ones `(optional)`.
- If most fields are optional, mark only the required ones `(required)`.
- Be consistent across the product, or at least across the same form type.
- Avoid a long tail of optional fields; group them if necessary.

## Input choice

- Unique, free-form data: `TextInput`.
- One of a predefined set: `Dropdown`, `Select`, radio group, or checkbox set.
- Two options: radio buttons, not a dropdown.
- Do not use a text input when the value must come from a fixed list.
- Do not nest dropdowns or put complex content inside them.

## Validation

- Validate as the field loses focus, before submission; show the error inline
  under the field. State what is wrong and how to fix it (for example, "Password
  must be at least 16 characters").
- On submit, disable the primary button to prevent duplicate submissions.
- Server-side errors: use an `InlineNotification` at the top of the form **and**
  inline messages where possible. Clear an inline error when the field becomes
  valid.
- Short forms may disable the primary action until all requirements are met.
  **Long forms must not** — the button and the error may not be visible at the
  same time.

## Actions

- Primary = the task (`Create customer`, `Save changes`), not "Submit".
- Secondary = cancel/discard; it is the negative half of the pair, never a
  positive action on its own.
- Buttons sit at the **bottom** of the form, never pinned at the top.
- In-page forms: primary on the left, secondary to its right.
- Progressive forms, wizards and dialogs: primary on the right.
- Do not mix button sizes in one group.

## Spacing

- Dedicated-page forms: 32 px between inputs; keep the form single-column
  and constrain its width (about 40rem) instead of stretching across the page.
- Contained forms (side panel, modal): 24 px or 16 px is acceptable.
- Group spacing should be larger than field spacing (for example 32 px fields,
  40 px sections).
- 48 px between the last input and the action group.

## Accessibility

- Wrap fields in a `<form>`; keep a logical tab order.
- Required fields are declared before entry and announced as required.
- Error messages are associated with their field and remain readable by screen
  readers.
- Buttons and labels use task-specific language; icon-only buttons need an
  accessible name.

## States

| State | UI |
|---|---|
| Idle | Empty or pre-filled fields; no validation noise |
| Invalid field | `invalid` + `invalidText` on the field |
| Submitting | Primary disabled; `InlineLoading` or a progress indicator |
| Success | `InlineNotification kind="success"`; reset or navigate |
| Server error | `InlineNotification kind="error"` at the top; field errors where known |

## Recipe

```tsx
"use client";

import {
  Button,
  ButtonSet,
  Form,
  FormGroup,
  InlineNotification,
  Stack,
  TextInput,
} from "@carbon/react";

export function CustomerForm() {
  return (
    <Form onSubmit={(event) => event.preventDefault()}>
      <Stack gap={9}>
        <FormGroup legendText="Customer">
          <Stack gap={7}>
            <TextInput id="name" labelText="Name" />
            <TextInput id="email" labelText="Email" type="email" />
          </Stack>
        </FormGroup>
        <ButtonSet>
          <Button type="submit">Create customer</Button>
          <Button kind="secondary" type="button">
            Cancel
          </Button>
        </ButtonSet>
      </Stack>
    </Form>
  );
}
```

Wire the submit to the generated Connect mutation, invalidate the affected
query keys, and show the success or error notification. Keep the page a shell:
the form is a client component in the route's `_components`. The working
example is
`src/app/(app)/customers/new/_components/customer-form.tsx`; edit mirrors it in
`src/app/(app)/customers/[id]/edit/_components/edit-customer-form.tsx`.

## Common mistakes

- Placeholder used as the label.
- Marking both required and optional fields.
- Validating only on submit and losing the error above the fold.
- A "Submit" button, or two primary actions.
- Actions at the top of the page.
- A modal for a long form.
- A text input for a fixed set, or a dropdown for two options.

## Sources

`source/web/patterns/forms-pattern/index.mdx`,
`source/web/components/text-input/usage.mdx`,
`source/web/components/dropdown/usage.mdx`,
`source/web/components/button/usage.mdx`,
`source/web/patterns/notification-pattern/index.mdx`.
