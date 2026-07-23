/**
 * Custom ESLint rules for calvinmaighan styles.
 */
import { noRemEmRule } from "./no-rem-em.mjs";
import { preferThemeVarsRule } from "./prefer-theme-vars.mjs";

const plugin = {
  meta: {
    name: "eslint-plugin-calvinmaighan",
    version: "0.0.0",
  },
  rules: {
    "no-rem-em": noRemEmRule,
    "prefer-theme-vars": preferThemeVarsRule,
  },
};

export default plugin;
