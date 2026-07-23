/**
 * Manual style lint — run via `bun run lint:styles`.
 * Not wired into Netlify or git hooks.
 */
import css from "@eslint/css";
import calvinmaighan from "./eslint-plugins/calvinmaighan/plugin.mjs";

export default [
  {
    files: ["site/**/*.css"],
    ignores: ["site/vendor/**"],
    language: "css/css",
    plugins: {
      css,
      calvinmaighan,
    },
    rules: {
      "calvinmaighan/no-rem-em": "warn",
      "calvinmaighan/prefer-theme-vars": "warn",
    },
  },
];
