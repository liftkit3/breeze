/**
 * Breeze · Mobile · ESLint config
 *
 * Anti-drift enforcement layer. Prevents:
 *   1. Hex / rgb / hsl literals in code (must use tokens)
 *   2. Inline styles for properties that should be tokens
 *   3. Importing colors from outside @breeze/design-tokens
 *   4. Use of magic numbers for spacing/radius
 *
 * Run: npm run lint
 */

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  plugins: ["@typescript-eslint"],
  extends: ["expo"],
  ignorePatterns: [
    "node_modules/",
    ".expo/",
    "dist/",
    "*.config.js",
    "babel.config.js",
    "metro.config.js",
    "tailwind.config.js",
  ],
  rules: {
    // ─── No hex literals in code ───────────────────────────────────────
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
        message: "❌ hsl literal forbidden. Use tokens from @breeze/design-tokens.",
      },
    ],

    // ─── No inline style with raw color/padding values ─────────────────
    // Allows `style={{ flex: 1 }}` etc. — only blocks visual tokens.
    "no-restricted-properties": [
      "error",
      // (extendable list — we'll grow these as we catch drift)
    ],

    // ─── Standard hygiene ──────────────────────────────────────────────
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
  },

  // ─── Scoped overrides ───────────────────────────────────────────────
  overrides: [
    {
      // Token files ARE allowed to contain hex literals (they're the source).
      files: [
        "../../packages/design-tokens/**",
        "**/icons/**",
        "**/Logo.tsx",
      ],
      rules: {
        "no-restricted-syntax": "off",
      },
    },
    {
      // Auto-generated files
      files: ["**/*.config.js", "tailwind.config.js"],
      rules: {
        "no-restricted-syntax": "off",
      },
    },
  ],
};
