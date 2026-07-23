/** Ordered series: intro + 14 tips. Paths are site-root absolute. */
export const SERIES = [
  {
    slug: "how-ai-agents-speed-up-developers",
    title: "14 AI agent skills to speed up developers",
    subtitle: "A product-owner map you can hand to engineering",
    path: "/tips/how-ai-agents-speed-up-developers.html",
  },
  {
    slug: "read-dependency-source-code-with-opensrc",
    title: "Read dependency source code with opensrc",
    subtitle: "Pull package source into the agent loop",
    path: "/tips/secret-agent-tips/read-dependency-source-code-with-opensrc.html",
  },
  {
    slug: "scrape-websites-for-ai-agent-research",
    title: "Scrape websites for AI agent research",
    subtitle: "Turn live pages into research the agent can cite",
    path: "/tips/secret-agent-tips/scrape-websites-for-ai-agent-research.html",
  },
  {
    slug: "cut-ai-agent-tokens-with-caveman",
    title: "Cut AI agent tokens with caveman",
    subtitle: "Terse replies without mangling code",
    path: "/tips/secret-agent-tips/cut-ai-agent-tokens-with-caveman.html",
  },
  {
    slug: "keep-ai-coding-changes-minimal-with-ponytail",
    title: "Keep AI coding changes minimal with ponytail",
    subtitle: "Smallest working diff, no speculative fluff",
    path: "/tips/secret-agent-tips/keep-ai-coding-changes-minimal-with-ponytail.html",
  },
  {
    slug: "compress-agent-context-before-you-code",
    title: "Compress agent context before you code",
    subtitle: "Ranked symbols instead of whole-repo paste",
    path: "/tips/secret-agent-tips/compress-agent-context-before-you-code.html",
  },
  {
    slug: "persist-codebase-knowledge-across-ai-chats",
    title: "Persist codebase knowledge across AI chats",
    subtitle: "Memory that survives the next chat",
    path: "/tips/secret-agent-tips/persist-codebase-knowledge-across-ai-chats.html",
  },
  {
    slug: "research-what-people-said-last-month",
    title: "Research what people said last month",
    subtitle: "Real voices from the last thirty days",
    path: "/tips/secret-agent-tips/research-what-people-said-last-month.html",
  },
  {
    slug: "remove-ai-writing-tells-from-prose",
    title: "Remove AI writing tells from prose",
    subtitle: "Kill the patterns that scream model-written",
    path: "/tips/secret-agent-tips/remove-ai-writing-tells-from-prose.html",
  },
  {
    slug: "design-landing-pages-without-ai-slop",
    title: "Design landing pages without AI slop",
    subtitle: "Brand-first pages that pass the hide-the-nav test",
    path: "/tips/secret-agent-tips/design-landing-pages-without-ai-slop.html",
  },
  {
    slug: "build-product-videos-with-hyperframes",
    title: "Build product videos with HyperFrames",
    subtitle: "HTML compositions agents can revise",
    path: "/tips/secret-agent-tips/build-product-videos-with-hyperframes.html",
  },
  {
    slug: "expose-product-actions-as-mcp-tools",
    title: "Expose product actions as MCP tools",
    subtitle: "Tools with schemas, scopes, and audit trails",
    path: "/tips/secret-agent-tips/expose-product-actions-as-mcp-tools.html",
  },
  {
    slug: "catch-ai-code-mistakes-with-lint",
    title: "Catch AI code mistakes with lint",
    subtitle: "Lint as a hard gate after every agent edit",
    path: "/tips/secret-agent-tips/catch-ai-code-mistakes-with-lint.html",
  },
  {
    slug: "ship-production-releases-with-agent-checks",
    title: "Ship production releases with agent checks",
    subtitle: "Release checks agents cannot skip",
    path: "/tips/secret-agent-tips/ship-production-releases-with-agent-checks.html",
  },
  {
    slug: "write-seo-articles-agents-can-follow",
    title: "Write SEO articles agents can follow",
    subtitle: "Structure humans and agents can both follow",
    path: "/tips/secret-agent-tips/write-seo-articles-agents-can-follow.html",
  },
];

export const SERIES_INTRO_SLUG = SERIES[0].slug;

export function slugFromHref(href) {
  if (!href) return "";
  try {
    const path = new URL(href, "https://calvinmaighan.com").pathname;
    const m = path.match(/\/([^/]+)\.html$/);
    return m ? m[1] : "";
  } catch {
    return "";
  }
}

