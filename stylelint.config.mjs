const config = {
  extends: ["stylelint-config-standard-scss"],
  rules: {
    // Carbon tokens only. Raw colors are how a design system drifts.
    "color-no-hex": true,
    "selector-class-pattern": null,
    "custom-property-pattern": null,
    "no-descending-specificity": null,
  },
  overrides: [
    {
      // If a token really must be declared, it happens here and nowhere else.
      files: ["src/styles/tokens.scss"],
      rules: { "color-no-hex": null },
    },
  ],
};

export default config;
