/**
 * Warn when CSS uses raw color literals instead of theme variables (var(--…)).
 * Theme definition files are skipped — they author the tokens.
 */
import { fileURLToPath } from "node:url";

const COLOR_LITERAL =
  /#(?:[0-9a-f]{3,8})\b|(?:oklch|oklab|rgba?|hsla?|hwb|lab|lch)\s*\(/gi;

const ALLOWED_KEYWORDS =
  /\b(?:transparent|currentcolor|inherit|initial|unset|none|auto)\b/i;

function physicalFilename(filename) {
  if (!filename) return "";
  if (filename.startsWith("file:")) return fileURLToPath(filename);
  return filename;
}

function shouldSkipFile(filename) {
  const fp = physicalFilename(filename).replace(/\\/g, "/");
  if (!fp) return true;
  if (fp.includes("/site/themes/")) return true;
  if (fp.includes("/site/tokens.css")) return true;
  if (fp.includes("/site/vendor/")) return true;
  if (fp.includes("/eslint-plugins/")) return true;
  if (fp.includes("/node_modules/")) return true;
  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
export const preferThemeVarsRule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Prefer theme CSS variables over raw color literals",
    },
    schema: [],
    messages: {
      preferThemeVar:
        "Avoid raw color '{{value}}'. Use a theme variable (var(--…)) instead.",
    },
  },

  create(context) {
    if (shouldSkipFile(context.filename)) return {};

    const { sourceCode } = context;

    return {
      Declaration(node) {
        // Custom property definitions belong in theme files.
        if (typeof node.property === "string" && node.property.startsWith("--")) {
          return;
        }

        const text = sourceCode.getText(node);
        // color-mix(... in oklch, var(--x) ...) — only flag real color functions / hex
        COLOR_LITERAL.lastIndex = 0;
        let match;
        while ((match = COLOR_LITERAL.exec(text)) !== null) {
          const value = match[0].replace(/\s*\($/, "()");
          // Skip `in oklch` color-space keyword inside color-mix / gradients
          const before = text.slice(Math.max(0, match.index - 3), match.index);
          if (/(?:^|[\s,(])in\s*$/i.test(before) && /^oklch\s*\(/i.test(match[0])) {
            continue;
          }
          if (ALLOWED_KEYWORDS.test(match[0])) continue;

          const start = node.loc.start.offset + match.index;
          const end = start + match[0].length;
          context.report({
            loc: {
              start: sourceCode.getLocFromIndex(start),
              end: sourceCode.getLocFromIndex(end),
            },
            messageId: "preferThemeVar",
            data: { value },
          });
        }
      },
    };
  },
};
