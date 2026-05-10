/**
 * Breeze · Mobile · ESLint flat config (v9)
 *
 * Anti-drift enforcement layer. Prevents:
 *   1. Hex / rgb / hsl literals in code (must use tokens from @breeze/design-tokens)
 *   2. (Future) Inline styles for properties that should be tokens
 *
 * Replaces the legacy .eslintrc.js (ESLint v9 dropped support for it).
 *
 * Run: npm run lint
 */

const expoConfig = require("eslint-config-expo/flat");

module.exports = [
  // ─── Ignore patterns ───────────────────────────────────────────────
  {
    ignores: [
      "node_modules/**",
      ".expo/**",
      "dist/**",
      "babel.config.js",
      "metro.config.js",
      "tailwind.config.js",
      "eslint.config.js",
    ],
  },

  // ─── Expo's recommended baseline (React, RN, TS, imports) ─────────
  ...expoConfig,

  // ─── Anti-drift: forbid color literals in app code ─────────────────
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // Allow underscore-prefixed unused vars (e.g., _exhaustive in switch checks)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-unused-vars": "off",
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/^#[0-9A-Fa-f]{3,8}$/]",
          message:
            "❌ Hex color literal forbidden. Import from @breeze/design-tokens (e.g., `colors.primary.DEFAULT`).",
        },
        {
          selector: "Literal[value=/^rgba?\\(.*\\)$/]",
          message:
            "❌ rgb/rgba literal forbidden. Use tokens (`shadow.md` etc.) from @breeze/design-tokens.",
        },
        {
          selector: "Literal[value=/^hsla?\\(.*\\)$/]",
          message:
            "❌ hsl literal forbidden. Use tokens from @breeze/design-tokens.",
        },
      ],
    },
  },

  // ─── Scoped exemptions ─────────────────────────────────────────────
  // Files where literal colors are legitimate and unavoidable.
  {
    files: [
      "**/icons/**",         // SVG icons accept color="#XXX" defaults
      "**/Logo.tsx",         // brand mark — uses palette refs, defensive exemption
      "**/ScreenFrame.tsx",  // dark-hero gradient rgba (TODO: tokenize as gradient token)
    ],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
];
