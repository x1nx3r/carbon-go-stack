export type DesignGroup = "foundation" | "primitive" | "assembly";

export type DesignEntry = {
  id: string;
  group: DesignGroup;
  title: string;
  description: string;
  source: string;
  states?: string[];
};

/**
 * The approved template vocabulary. A primitive or assembly that is not here
 * is not part of the house style yet. Add it here and to /design before using
 * it in a product screen.
 */
export const designCatalog: DesignEntry[] = [
  {
    id: "page-shell",
    group: "foundation",
    title: "Page shell",
    description: "Title, description, page actions, grid, and block rhythm. The shell owns the fixed-header offset.",
    source: "web/src/components/page.tsx",
  },
  {
    id: "buttons",
    group: "primitive",
    title: "Buttons",
    description: "Primary, secondary, tertiary, ghost, and danger actions, including disabled and icon-only states.",
    source: "web/src/design/primitives.tsx#buttons",
    states: ["primary", "secondary", "tertiary", "ghost", "danger", "disabled"],
  },
  {
    id: "links",
    group: "primitive",
    title: "Links",
    description: "Navigation, never mutation. Use a button for actions on the current page.",
    source: "web/src/design/primitives.tsx#links",
  },
  {
    id: "inputs",
    group: "primitive",
    title: "Text inputs",
    description: "Single-line title and multi-line description fields, with helper and invalid states.",
    source: "web/src/design/primitives.tsx#inputs",
    states: ["default", "filled", "invalid", "disabled"],
  },
  {
    id: "selection",
    group: "primitive",
    title: "Selection controls",
    description: "Checkboxes, toggles, radio groups, and filter chips for mutually exclusive and multi-choice states.",
    source: "web/src/design/primitives.tsx#selection",
    states: ["checked", "unchecked", "indeterminate", "disabled"],
  },
  {
    id: "dropdown",
    group: "primitive",
    title: "Dropdown",
    description: "One choice from a small set. Use radio buttons for two options and a combobox for a long searchable list.",
    source: "web/src/design/primitives.tsx#dropdown",
    states: ["closed", "open", "selected", "disabled"],
  },
  {
    id: "search",
    group: "primitive",
    title: "Search",
    description: "Page-level filtering. The value lives in URL state when it drives a list.",
    source: "web/src/design/primitives.tsx#search",
  },
  {
    id: "upload",
    group: "primitive",
    title: "File upload",
    description: "The default uploader and the drop container. Show file-level loading, success, and error states.",
    source: "web/src/design/primitives.tsx#upload",
    states: ["idle", "uploading", "success", "error"],
  },
  {
    id: "feedback",
    group: "primitive",
    title: "Feedback",
    description: "Inline notifications for information, success, warning, and error; toast for transient confirmation.",
    source: "web/src/design/primitives.tsx#feedback",
    states: ["information", "success", "warning", "error"],
  },
  {
    id: "loading",
    group: "primitive",
    title: "Loading",
    description: "Skeletons for first load; inline loading for a single action; never a spinner over a whole table that is already visible.",
    source: "web/src/design/primitives.tsx#loading",
    states: ["skeleton", "inline", "finished", "error"],
  },
  {
    id: "data-display",
    group: "primitive",
    title: "Tags, tiles, and structured lists",
    description: "Tags for status and categories; tiles for grouped summaries; structured lists for read-only detail.",
    source: "web/src/design/primitives.tsx#data-display",
  },
  {
    id: "navigation",
    group: "primitive",
    title: "Tabs, breadcrumbs, and overflow",
    description: "Secondary navigation inside a page, hierarchy above a title, and actions in a constrained table cell.",
    source: "web/src/design/primitives.tsx#navigation",
    states: ["selected", "overflow", "keyboard"],
  },
  {
    id: "dialog",
    group: "primitive",
    title: "Dialog",
    description: "A transactional modal and a danger confirmation. Cancel is the safe default focus target.",
    source: "web/src/design/primitives.tsx#dialog",
    states: ["transactional", "danger", "loading", "error"],
  },
  {
    id: "showcase-list",
    group: "assembly",
    title: "Showcase list",
    description: "The live assembly: URL-held search and status filters, table, row actions, pagination, loading, empty, and error states.",
    source: "web/src/design/assemblies/showcase-list.tsx",
    states: ["loading", "ready", "empty", "error", "filtered"],
  },
  {
    id: "showcase-form",
    group: "assembly",
    title: "Showcase form",
    description: "Create and edit in a modal, with client validation, loading submit, and backend errors.",
    source: "web/src/design/assemblies/showcase-form.tsx",
    states: ["create", "edit", "invalid", "submitting", "error"],
  },
  {
    id: "showcase-detail",
    group: "assembly",
    title: "Showcase detail",
    description: "Read-only structured detail with status, owner, amount, tags, and timestamps.",
    source: "web/src/design/assemblies/showcase-detail.tsx",
    states: ["ready", "not found"],
  },
];

export const designGroups: { id: DesignGroup; title: string; description: string }[] = [
  {
    id: "foundation",
    title: "Foundations",
    description: "The page shell, spacing, and type hierarchy every screen inherits.",
  },
  {
    id: "primitive",
    title: "Primitives",
    description: "Approved controls with the states we actually use.",
  },
  {
    id: "assembly",
    title: "Assemblies",
    description: "A complete vertical slice wired to the Showcase backend.",
  },
];
