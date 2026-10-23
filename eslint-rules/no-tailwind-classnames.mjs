/**
 * Flags Tailwind-shaped utility classes in `className`. Carbon is the only
 * styling system in this template; a stray `flex p-4 text-sm` means someone
 * reached for a habit instead of the design system.
 *
 * This is intentionally a small allow-list of unmistakable Tailwind tokens,
 * not a complete Tailwind parser. Carbon classes (`cds--*`) and CSS module
 * references (`styles.foo`) never match.
 */

const UTILITY =
  /^(?:[a-z0-9-]+:)*(?:flex|grid|block|inline|inline-block|hidden|relative|absolute|fixed|sticky|static|container|sr-only|not-sr-only|truncate|antialiased|italic|underline|uppercase|lowercase|capitalize|shadow(?:-\w+)?|rounded(?:-\w+)?|border(?:-[trblxy])?(?:-\d+)?|ring(?:-\d+)?|outline(?:-\w+)?|opacity-\d+|z-\d+|order-\d+|col-(?:span|start)-\d+|row-(?:span|start)-\d+|grid-cols-\d+|grid-rows-\d+|gap-\d+|gap-[xy]-\d+|space-[xy]-\d+|p[xytrbl]?-\d+|m[xytrbl]?-\d+|w-\d+|h-\d+|min-[wh]-\d+|max-[wh]-\d+|text-(?:xs|sm|base|lg|xl|[2-9]xl|left|center|right|justify)|font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black|mono|sans|serif)|bg-\w+(?:-\d+)?|text-(?:white|black|transparent|current|inherit|[a-z]+-\d{2,3})|items-\w+|justify-\w+|content-\w+|self-\w+|flex-\w+|overflow-\w+|leading-\w+|tracking-\w+|top-\d+|bottom-\d+|left-\d+|right-\d+|inset-\d+|translate-[xy]-\w+)$/;

const VARIANT = /^(?:[a-z0-9-]+:)+/;

function walk(node, visit) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const child of node) walk(child, visit);
    return;
  }
  if (typeof node.type === "string") visit(node);
  for (const key of Object.keys(node)) {
    if (key === "parent") continue;
    walk(node[key], visit);
  }
}

const rule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow Tailwind utility classes; this app uses Carbon components and tokens.",
    },
    schema: [],
    messages: {
      tailwind:
        "`{{token}}` is a Tailwind utility. Use a Carbon component or Carbon spacing/type tokens instead.",
    },
  },

  create(context) {
    function check(value, node) {
      for (const raw of value.split(/\s+/)) {
        if (!raw) continue;
        const token = raw.replace(VARIANT, "");
        if (UTILITY.test(token)) {
          context.report({ node, messageId: "tailwind", data: { token: raw } });
        }
      }
    }

    return {
      JSXAttribute(node) {
        if (node.name?.type !== "JSXIdentifier" || node.name.name !== "className") {
          return;
        }
        if (!node.value) return;
        walk(node.value, (child) => {
          if (child.type === "Literal" && typeof child.value === "string") {
            check(child.value, child);
          }
          if (
            child.type === "TemplateElement" &&
            typeof child.value?.cooked === "string"
          ) {
            check(child.value.cooked, child);
          }
        });
      },
    };
  },
};

export default rule;
