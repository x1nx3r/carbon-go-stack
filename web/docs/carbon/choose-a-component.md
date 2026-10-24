---
audience: agent
carbon: 1.119.0
web-snapshot: 5e9cd1d
read-when: choosing a Carbon component for a screen, or when two components could work
sources:
  - source/web/components/button/usage.mdx
  - source/web/components/tag/usage.mdx
  - source/web/components/tile/usage.mdx
  - source/web/components/data-table/usage.mdx
  - source/web/components/structured-list/usage.mdx
  - source/web/components/tabs/usage.mdx
  - source/web/components/modal/usage.mdx
  - source/web/components/dropdown/usage.mdx
  - source/web/components/text-input/usage.mdx
  - source/web/components/search/usage.mdx
  - source/web/components/notification/usage.mdx
---

# Choose a component

## Default answers

| The job | Use | Not |
|---|---|---|
| One main action on the page | One `Button kind="primary"` | Several primaries, or a primary plus a same-weight action |
| A secondary action beside it | `Button kind="secondary"` | A secondary on its own |
| An independent or lower-emphasis action | `Button kind="tertiary"` | Ghost for an action that matters |
| The least prominent action in a group | `Button kind="ghost"` | Ghost as the only action |
| A destructive action | `Button kind="danger"` (or danger--tertiary/ghost by emphasis) | Primary/tertiary with red text |
| Navigate to another page | A link or Carbon `Link` | `Button` |
| A category or status label | Read-only `Tag` | Tag as a link, or one tag doing two jobs |
| A group of related content or actions | `Tile` | Card/elevation for flat page content |
| A list of records with sorting, selection, filtering or batch actions | `DataTable` | Hand-rolled table markup |
| A simple read-only list with server pagination | `Table` primitives + `Pagination` (template convention) | DataTable when no interactive table features are needed |
| Key/value, features, pricing plans | `StructuredList` | Nested or complex content |
| A small, confined list | `ContainedList` | Full-page StructuredList |
| Related content in categories | `Tabs` | Tabs for filtering the same content or comparing |
| Short input, `aria`-labelled | `TextInput` | Placeholder as the label |
| One choice from a predefined list | `Dropdown` (or `Select` for native) | Dropdown for two options (use radio buttons) |
| A short, focused task | `Modal` | Full page or side panel for long/complex work |
| Status feedback in the flow | `InlineNotification` | Toast for an error the user must act on |
| A short, non-critical confirmation | `ToastNotification` | Toast for persistent state |
| Search across a large data set | `Search` | Search for a handful of items |

## Buttons

- **One primary per screen.** The header, modal and side panel are separate
  contexts and may each have one.
- **Secondary only in a pair**, for the negative action (Cancel/Back). Do not
  use it alone for a positive action.
- **Tertiary** is for less prominent or independent actions; **ghost** is the
  least prominent in a group.
- **Danger** communicates a destructive effect. Pick primary/tertiary/ghost by
  how much emphasis the destruction deserves.
- **Buttons are not navigation.** Use a link to move to a new page.
- **Sizes:** medium pairs with 40px inputs, small with 32px; large (productive)
  is the common product size. Do not mix sizes in one button group.
- **Icon-only** buttons have no visible label; the icon must be unambiguous and
  the button still needs an accessible name.

## Labels and groups

- **Tag:** short (one or two words), read-only by default, not a link, and not
  multi-purpose. Dismissible tags are for clearing filters.
- **Tile:** flat grouping on the page plane; it is not a card with elevation.

## Data display

- **DataTable** when the user must organize, scan, sort, select or act on
  records. It supports default, selection and expansion variants, a toolbar
  and pagination.
- **Do not** use it as a spreadsheet or for very complex interaction.
- **StructuredList** for simple browsing, selection, descriptions, features or
  pricing comparison. If the content needs nesting or is large, move to a
  DataTable.
- **ContainedList** when the list lives in a small or confined region.

## Tabs

Use tabs to group related content and reduce cognitive load. Do not use them
to filter the same content (use ContentSwitcher), to show step-by-step progress
(use ProgressIndicator), or where the user must compare groups (they would have
to click back and forth).

## Inputs

- **TextInput** for unique, free-form data. If the answer is one of a predefined
  set, use a selection control instead.
- **Dropdown** for one or several options from a longer list. With two options,
  use a radio group. Do not nest dropdowns or put complex content inside.
- **Search** only when the data set is large or complex; not for a short,
  easily scanned list.

## Feedback

- **InlineNotification:** in the task flow, at the top of the primary content;
  the user can read it in place.
- **ToastNotification:** short, non-modal, time-based; it disappears.
- **ActionableNotification:** interactive content or an action, with focus
  handling.
- **Callout:** content that loads with the page and is not dismissed.
- **Modal:** for an immediate response, urgent information, or confirming a
  decision; use sparingly and never without a user trigger.

## Common mistakes

- Two primary buttons on one screen.
- A secondary button used as the only action, or for a positive action.
- Tags used as navigation or with two functions.
- Tabs for filtering or comparing.
- A modal for a page-sized form, or a modal the user did not trigger.
- A dropdown for two options, or a text input for a fixed list.
- A toast for an error that must stay visible.

## Sources

`source/web/components/{button,tag,tile,data-table,structured-list,tabs,modal,dropdown,text-input,search,notification}/usage.mdx`,
`source/web/patterns/dialog-pattern/index.mdx`,
`source/web/patterns/notification-pattern/index.mdx`.
