/** Concat themes/bundle.css + styles.css → site/site.css (one render-blocking request). */
const header =
  "/* site.css — themes/bundle.css + styles.css. Regenerate: bun run css:bundle */\n";
const bundle = await Bun.file("site/themes/bundle.css").text();
const styles = await Bun.file("site/styles.css").text();
await Bun.write(
  "site/site.css",
  `${header}${bundle}\n/* ===== styles.css ===== */\n${styles}`,
);
console.log("wrote site/site.css", (await Bun.file("site/site.css").size), "bytes");
