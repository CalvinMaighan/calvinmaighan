/**
 * Error on rem/em units — use px (or theme vars that resolve to px) instead.
 */
import { fileURLToPath } from "node:url";

/** Full number + unit (avoids mid-token hits like `.03em` inside `0.03em`). */
const REM_EM_UNIT =
  /(?<![a-zA-Z0-9_-])(-?(?:\d+\.\d+|\d+|\.\d+))(rem|em)\b/gi;

function physicalFilename(filename) {
  if (!filename) return "";
  if (filename.startsWith("file:")) return fileURLToPath(filename);
  return filename;
}

function shouldSkipFile(filename) {
  const fp = physicalFilename(filename).replace(/\\/g, "/");
  if (!fp) return true;
  if (fp.includes("/site/vendor/")) return true;
  if (fp.includes("/eslint-plugins/")) return true;
  if (fp.includes("/node_modules/")) return true;
  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
export const noRemEmRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow rem/em units; use pixels instead",
    },
    schema: [],
    messages: {
      noRemEm: "Avoid '{{value}}'. Use px (or a theme token) instead of rem/em.",
    },
  },

  create(context) {
    if (shouldSkipFile(context.filename)) return {};

    const { sourceCode } = context;

    return {
      Declaration(node) {
        const text = sourceCode.getText(node);
        REM_EM_UNIT.lastIndex = 0;
        let match;
        while ((match = REM_EM_UNIT.exec(text)) !== null) {
          const value = `${match[1]}${match[2]}`;
          const start = node.loc.start.offset + match.index;
          const end = start + match[0].length;
          context.report({
            loc: {
              start: sourceCode.getLocFromIndex(start),
              end: sourceCode.getLocFromIndex(end),
            },
            messageId: "noRemEm",
            data: { value },
          });
        }
      },
    };
  },
};
