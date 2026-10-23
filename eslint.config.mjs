import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import noTailwindClassnames from "./eslint-rules/no-tailwind-classnames.mjs";

const useServer = {
  selector: "ExpressionStatement[directive='use server']",
  message:
    "Server Actions are not allowed here. Put the logic in the backend API and call it through the generated RTK Query hooks.",
};

const useClientInShell = {
  selector: "ExpressionStatement[directive='use client']",
  message:
    "Pages and layouts are server shells. Put the interactive part in a sibling _components file and render it here.",
};

const noServerImports = [
  {
    name: "server-only",
    message:
      "This repo is client-only. The web server renders shells and proxies; data and business logic live in the backend.",
  },
  {
    name: "next/headers",
    message:
      "Do not read request state on the web side. The backend owns sessions; the BFF forwards transport only.",
  },
  {
    name: "tailwindcss",
    message: "Carbon is the only styling system in this template.",
  },
];

const noOtherUiKits = [
  "@mui/material",
  "@mui/icons-material",
  "@chakra-ui/react",
  "@mantine/core",
  "antd",
  "bootstrap",
  "styled-components",
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/services/modules/**",
  ]),

  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      local: { rules: { "no-tailwind-classnames": noTailwindClassnames } },
    },
    rules: {
      "local/no-tailwind-classnames": "error",
      "no-restricted-syntax": ["error", useServer],
      "no-restricted-globals": [
        "error",
        {
          name: "fetch",
          message:
            "Use the generated RTK Query hooks in src/services instead of calling fetch directly.",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: noServerImports,
          patterns: [
            {
              group: noOtherUiKits,
              message: "Carbon is the only UI system in this template.",
            },
            {
              group: ["@/lib/server/*", "@/server/*", "@/lib/db/*"],
              message:
                "No server-side modules in this repo. That logic belongs in the backend.",
            },
          ],
        },
      ],
    },
  },

  // Pages and layouts are composition and metadata only.
  {
    files: ["src/app/**/page.tsx", "src/app/**/layout.tsx"],
    rules: {
      "no-restricted-syntax": ["error", useServer, useClientInShell],
    },
  },

  // The BFF is transport: it may use fetch, and it may not import app code.
  {
    files: ["src/app/api/**/route.ts"],
    rules: {
      "no-restricted-globals": "off",
      "no-restricted-imports": [
        "error",
        {
          paths: noServerImports,
          patterns: [
            {
              group: [
                "@/services/*",
                "@/store/*",
                "@/components/*",
                "@/lib/*",
                "@/styles/*",
              ],
              message:
                "The BFF is a transport proxy. It must not know about endpoints, state or UI.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
