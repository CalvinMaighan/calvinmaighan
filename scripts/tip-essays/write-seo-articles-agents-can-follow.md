---
title: "Write SEO articles agents can follow"
primaryKeyword: "write SEO articles agents can follow"
intent: howto
slug: write-seo-articles-agents-can-follow
metaDescription: "write SEO articles agents can follow with a locked longtail keyword, answer-first summary, honest Article and FAQ JSON-LD, real citations, CTAs, and a stop-slop pass so the /article skill ships indexable tips without improvised SEO."
canonical: https://calvinmaighan.com/tips/secret-agent-tips/write-seo-articles-agents-can-follow.html
updatedAt: 2026-07-22
updatedHuman: July 22, 2026
summary: "Write SEO articles agents can follow by locking a longtail keyword, one intent, a summary that answers first, honest Article and FAQ JSON-LD, real citations, and a stop-slop pass before publish. The /article skill turns content SEO into a checklist an agent executes the same way /lint and /prod gate code."
standalone: false
kicker: ""
series: ""
nextHref: "../../contact.html"
nextLabel: "Book a call"
nextLocked: "false"
ctaAboveFold: "Book a call"
ctaEnd: "Last tip in the series. Ready to install agent skills for content and code"
inBodyImageAlt: "Cover for tip 14: write SEO articles agents can follow"
out: site/tips/secret-agent-tips/write-seo-articles-agents-can-follow.html
---

Write SEO articles agents can follow by encoding content SEO as a skill with hard rules, not a mood board. The agent picks a 6–8 word longtail, states one intent, drafts without waiting for an outline approval, opens with a summary that answers the query, puts the key phrase in the first body sentence, cites real sources, adds FAQ when it fits, emits Article JSON-LD, places CTAs above the fold and at the end, then runs a stop-slop pass before anyone calls the page done.

That skill is `/article` on this site. It sits beside coding skills because publishing has the same failure mode as shipping code: models improvise. Improvised SEO produces thin meta tags, missing schema, invented citations, and prose full of AI tells. A checklist skill produces pages a crawler and a hiring manager can both trust.

## Why content SEO belongs in an agent skill

Google still asks whether the page helps people. The [creating helpful, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) guide and the [SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) remain the baseline. Structured data stays useful for machines even when rich result features change; [schema.org Article](https://schema.org/Article) and FAQ types give crawlers and LLM tools a clean graph when the visible page matches the markup.

Agents skip those steps unless the skill forbids skipping. Cursor’s own [skills documentation](https://cursor.com/docs/skills) frames skills as reusable jobs. Name the job after the outcome: `write-seo-articles-agents-can-follow`, then put the rules in the file the agent must read. Follow [Google Search Central on LinkedIn](https://www.linkedin.com/company/google-search-central/) for platform updates that should refresh dated claims.

## Lock research before prose

The skill starts with keyword research. Propose three to five longtail candidates of six to eight words. Skim the SERP for intent and gaps. Firecrawl or a plain web search works. Lock one primary. Optional secondaries stay light. Never equal-weight five keywords in one H1.

State the intent in one word group: informational, commercial, or how-to. Mixed intent pages confuse both ranking systems and readers. This series tip is how-to for teams that already run agents on a portfolio or docs site.

## Hard rules that survive model drift

These rules stay in the skill as a locked preference list:

- Meta description at least 120 characters, starting with the primary keyword.
- Summary block: one paragraph, at most 150 words, before the body.
- Primary key phrase in the first sentence of the body.
- One H1; then H2 and H3 only.
- Long-form default around 2000+ words unless a human caps length.
- Real citations; prefer primary docs plus substantive posts; never invent URLs.
- Two to five internal links.
- One in-body image and matching OG image with descriptive alt text.
- Article JSON-LD; FAQPage when FAQ copy exists on the page.
- CTA after the summary and again after the FAQ.
- Visible updated date and author byline.
- stop-slop pass before delivery.

Density stays light. Stuffing the keyword every third sentence tanks trust with readers and with systems that look for people-first pages.

## Portable Markdown plus the live page

Agents should emit a portable Markdown draft with frontmatter the human can paste into another CMS: title, primaryKeyword, secondaryKeywords, intent, slug, metaDescription, canonical, updatedAt, author, images, internal links, external sources, FAQ, and CTAs. On calvinmaighan.com the same draft becomes HTML under `site/tips/` with the shared article chrome, EN fallback copy, and sitemap entry.

That dual output matters for consulting. Clients often want the draft in Notion or a CMS while the portfolio hosts the canonical essay. The skill forbids calling the job done when only one of the two exists.

## Schema that matches the page

JSON-LD must stay honest. Headline, description, dates, author Person, image, and mainEntityOfPage belong on every article. When the page has an FAQ section, add a FAQPage node whose questions match the visible H3s. Schema.org’s [FAQPage](https://schema.org/FAQPage) type exists for that graph. Do not invent questions for markup alone.

Google’s guidance on generative AI features still stresses technical clarity and index eligibility. Follow people-first content first; treat schema as a clarity layer, not a ranking cheat code.

## Voice: stop-slop before publish

Agents default to throat-clearing, binary contrasts, and em dash crutches. The [stop-slop tip](./remove-ai-writing-tells-from-prose.html) in this series covers the cleanup. The /article skill requires that pass. Cut filler, name actors, vary sentence length, keep technical terms exact.

Thought-leadership voice on a consulting site means specific experience signals: what you installed, what failed, what the checklist prevents. Generic landscape copy fails both SEO and sales.

## Answer-first structure for search and assistants

People and AI overviews both reward early answers. The summary block states the answer in plain language under 150 words. The body opens with the primary key phrase in sentence one, then earns the rest of the length with procedure, examples, and failure modes. Tables and step lists belong early when the query is how-to.

Avoid outline theater. The skill says draft straight unless a human asks for an outline gate. Agents that spend the first turn on decorative outlines often never reach citations.

## Citation policy that blocks hallucinations

Every factual claim that needs support gets a high-quality source. Prefer primary documentation, then substantive posts with clear authors. Reddit and LinkedIn help when the thread is real and linkable; skip them when you would invent a URL. Vary domains across a series so the site does not cite the same three pages in every tip.

If research fails, the agent says so in the draft notes and uses the next-best primary source. Silent fabrication is a ship blocker. That rule matters more on a consulting domain than on a throwaway blog because readers hire from trust.

## Images, alt text, and social cards

One in-body image and one OG image keep the page shareable. On this site both can point at the series art when a custom shot does not exist yet. Alt text describes the image for humans; it does not stuff the keyword. Twitter card stays `summary_large_image`. Width and height meta help some platforms reserve space.

When you later commission unique art per tip, keep filenames stable or update canonical OG tags in the same change as the asset.

## i18n and portfolio constraints

calvinmaighan.com keeps EN and FR dictionaries in `site/app.mjs`. Shared chrome strings use `data-i18n`. Article bodies ship in English with fallback text in the HTML. Series kickers can stay plain text while the series rolls out. New public URLs join `site/sitemap.xml`. Sitewide robots work stays in a separate SEO plumbing skill so /article remains about writing.

The agent must not invent new infrastructure or environment variables to publish a tip. Static HTML under `site/tips/` is enough for Netlify publish.

## How /article fits the rest of the series

Tip 1 teaches reading dependency source. Later tips cut tokens, compress context, and remove prose slop. /article consumes those skills: research with scrape tools, keep the draft minimal, strip AI tells, then publish with the same discipline /prod uses for code. Content and code share one operating system for agents.

Teams that only automate coding still lose days to blog and docs debt. Teams that only automate content ship pretty pages that break production. Install both. See [lint](./catch-ai-code-mistakes-with-lint.html) and [production checks](./ship-production-releases-with-agent-checks.html) for the coding side of that system.

## Series chrome and internal links

Standalone articles skip series kickers. Series tips show Tip N of 14 and a next tip control. Internal links should point to related tips and to [contact](../../contact.html) or [tips](../../index.html#tips) on the home page. This finale links back because content SEO sits in the same agent operating system as code gates.

## Quality bar for consulting sites

A portfolio tip should prove a practice you use on client work. Name the skill file. Name the failure mode. Name the command. Soft CTAs belong after the summary and at the end, not every other paragraph. Readers who finish a 2000 word checklist already know whether to book a call.

Refresh dates when claims age. A tip that cites platform docs should get a quarterly pass. The skill’s freshness rule exists so agents do not leave stale advice frozen in a fresh layout.

## Measure whether the tip earns its URL

After publish, check Search Console for coverage and queries when the property exists. A tip that never earns impressions still teaches your team the skill. A tip that ranks for the longtail proves the keyword research step. Update the piece when the SERP intent shifts.

Inside the company, track whether engineers paste the portable Markdown into client repos. Reuse is the consulting signal. If drafts die in `_drafts/`, shorten the done checklist or pair the writer with a reviewer for the first three articles.

This series ends here on purpose. Lint gates code. Prod gates release. Article gates publish. The three skills form a loop agents can run without inventing process each Monday.

## Keep the series map in one place

A 14-tip series needs a slug map so agents do not invent next links. Store Tip N to filename in research notes or AGENTS.md. Prev and next must resolve. Broken series chrome wastes crawl budget and reader trust.

When you retire a tip, leave a redirect page with canonical to the replacement, the same way the old `ai-agent-skills/01.html` path now points at the standalone naming article. Dead URLs on a consulting site look careless.

If you only have time for one improvement after reading this finale, write the /article skill file and force the next blog post through it. Process beats inspiration when agents hold the keyboard.

## Reject invented screenshots and fake quotes

Agents love decorative screenshots and attributed quotes that never happened. The skill bans both unless the asset exists on disk and the quote has a URL. Prefer one real series image over a collage of stock metaphors. Hiring readers notice fakery fast.

## Done checklist

The skill ends with a strict checklist the agent must tick: keyword researched, intent stated, SERP skim noted, meta valid, summary under 150 words, first sentence keyed, slug aligned, heading hierarchy clean, length met, citations real, internal links present, images set, JSON-LD valid, FAQ honest, CTAs placed, date and byline visible, stop-slop done, portable MD written, site page shipped, sitemap updated. Unticked items mean the article is unfinished.

If you want this /article skill installed beside your coding skills so your team ships indexable tips without inventing process each time, [book a call](../../contact.html).


## Keep a swipe file of good openings

Agents improve when you show them three openings that already ranked or converted. Store those openings next to the skill. Require the draft’s first sentence to match the keyword rule and to sound like those examples: specific, active, no throat-clearing.

Update the swipe file when a tip earns traffic. Process without feedback loops becomes ritual. Ritual without results is how teams abandon SEO skills after one quarter.

## Cap secondary keywords

Secondary phrases support the primary; they do not compete with it. List at most three secondaries in frontmatter. If the draft starts optimizing for all of them, cut two. One intent per URL remains the cheapest ranking rule that still works.

## Publish cadence beats binge writing

Ship one tip a week with the checklist rather than twelve tips in a weekend with missing schema. Cadence trains the agent and the team. Binges create drafts that never leave `_drafts/`.

## FAQ

### How long should the primary keyword be?

Six to eight words. Shorter heads fight broad SERPs. Longer phrases read like stuffed titles. Research a few longtails, then lock one primary before drafting.

### Do agents need FAQ schema on every tip?

Use FAQ when the page answers real questions in visible copy. Mark those Q&A in JSON-LD. Skip fake FAQs invented only for rich results.

### What makes an article agent-followable?

Hard rules in a skill file: keyword length, meta that starts with the keyword, summary word cap, heading hierarchy, citation policy, CTA placement, and a done checklist the agent must tick.

### Should AI content chase rankings alone?

No. Google’s people-first guidance still applies. Write for the reader who lands from search or a share, then add technical SEO so crawlers and assistants can parse the page.
