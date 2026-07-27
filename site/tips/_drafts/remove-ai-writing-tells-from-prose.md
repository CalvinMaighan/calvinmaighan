---
title: "Remove AI writing tells from prose"
primaryKeyword: "remove AI writing tells from prose"
intent: howto
slug: remove-ai-writing-tells-from-prose
metaDescription: "remove AI writing tells from prose with a stop-slop pass so public writing sounds like a person with judgment, not a model performing intelligence."
canonical: https://calvinmaighan.com/tips/secret-agent-tips/remove-ai-writing-tells-from-prose.html
inBodyImage: "../../calvin-article-8.png"
ogImage: "https://calvinmaighan.com/calvin-article-8.png"
updatedAt: 2026-07-26
updatedHuman: July 26, 2026
summary: "Remove AI writing tells from prose before you publish anything that left an agent chat. A stop-slop pass cuts filler, false agency, binary contrasts, adverb stacks, and em dash crutches. I run it on articles, proposals, and UI microcopy. Read the draft aloud, and when you hear a keynote, cut until you hear a colleague. Readers who cannot name the patterns still feel them, and trust outlasts clever cadence."
standalone: false
kicker: ""
series: ""
nextHref: "./design-landing-pages-without-ai-slop.html"
nextLabel: "Next article"
nextLocked: "true"
ctaAboveFold: "Book a call"
ctaEnd: "If you want cleaner public writing in your agent workflow"
inBodyImageAlt: "Cover for tip 8: remove AI writing tells from prose"
out: site/tips/secret-agent-tips/remove-ai-writing-tells-from-prose.html
---

Remove AI writing tells from prose before your buyer decides a machine wrote your pitch. Your reader may never name the pattern. They still slow down at the third "not just X, but Y", the adverb stack, the paragraph that ends on a line built for screenshots. Something feels rented, and the trust you were building leaks out.

stop-slop is the skill I run on that cleanup, with credit to the craft notes around [Hardik Pandya's writing](https://hvpandya.com). Pair it with [Google's helpful content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) and honest [Article schema](https://schema.org/Article) on public pages. Ranking without trust lasts one visit.

## What the pass cuts

Throat-clearing openers. Emphasis crutches. Adverb stacks. Binary "not X, but Y" templates. False agency, where a solution emerges and a complaint becomes a fix without a human doing either. Quotable fluff carved for a LinkedIn screenshot. Em dashes sprinkled like perfume.

It keeps active voice, specific nouns, uneven rhythm, exact technical terms, and your actual point.

## Where I run it

Every public article. Proposal narratives. UI microcopy that came out of an agent. Incident email when an agent drafted the first pass. Private scratch notes get left alone, because the skill is a publishing gate rather than a personality eraser.

On this portfolio the `/article` skill blocks "done" until the pass runs. That rule exists because I published sentences that sounded smarter than they were and cringed at them a month later.

## Patterns worth killing on sight

"In today's fast-paced world." Delete it and start with the fact.

"It is important to note that." Delete it. If it mattered, you would already be saying it.

"Not only X, but also Y." State Y, and add X when it earns the space.

"The landscape is evolving." Name the change with a date, a product, or a number.

"Let's dive in." The reader is already in. Write the next useful sentence.

"At the end of the day." End the paragraph instead.

Empty sentences cost more on a consulting site than anywhere else, because your prose is the sample of your thinking.

## The ten-minute pass

1. Search for "not" contrasts and rewrite each as the positive claim.
2. Search for em dashes and replace them with periods or commas.
3. Cut the first sentence of any section that only announces the section.
4. Replace three adjectives with one concrete noun each.
5. Read the summary aloud, and rewrite anything you would not say to a peer over coffee.

Keep that list in the skill and in the docs pull request template. Agents forget between drafts. Checklists do not.

## Two rewrites from real drafts

Before: "In this comprehensive guide, we will explore how modern teams can leverage AI agents to unlock unprecedented productivity across the entire software development lifecycle."

After: "This guide shows how I wire agent skills so a SaaS team ships smaller pull requests with fewer invented APIs."

Before: "The platform seamlessly empowers stakeholders to collaborate in real time while maintaining robust security postures."

After: "Admins invite teammates. Roles gate billing. Sessions expire after seven days."

The rewrites read smaller in a pitch deck and survive a technical buyer. On a consulting site that trade pays.

## Where it meets SEO

Helpful content guidance and stop-slop pull in the same direction. Answer the query, show real experience, and drop the filler that exists to hit a word count. A dense 900-word answer that solves the job beats a 2,400-word tour of synonyms.

Structured data will not rescue soggy prose. [Article](https://schema.org/Article) markup on empty cadence still reads empty to a human. Clean the words first, then mark them up honestly.

## Failure modes

Sanding away voice until the page reads like beige cardboard. Specific stories should survive the pass, and only the fake drama should die.

Running it over terse code comments and producing essays in the margins. Leave technical comments tight.

Skipping it because the model got better. The tells shift with each model generation. The pass stays.

Treating it as optional on short posts. Short posts get shared faster, so short slop travels further.

## Ship the habit this week

Take the last thing an agent drafted for you, run the five-step pass, and read both versions aloud to one colleague. Add the checks to your docs pull request template so the next draft starts closer.

Tip 7 gives you the angle and the language bank from [what people said last month](./research-what-people-said-last-month.html). This pass keeps the draft from sounding like every other article on that angle. Tip 9 carries the same discipline into layout, where you [design landing pages without AI slop](./design-landing-pages-without-ai-slop.html).

If you want cleaner public writing in your agent workflow, [book a call](../../contact.html). More notes live in the [tips index](../../index.html#tips).

## Sources

- [Hardik Pandya](https://hvpandya.com)
- [Google helpful content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Schema.org Article](https://schema.org/Article)

## FAQ

### Will stop-slop make copy boring?

It removes manufactured drama, not detail. Specific stories, numbers, and opinions all survive the pass and carry more weight once the filler leaves.

### Should I run it on code comments?

Only where comments run as prose. Terse technical comments already do their job, and expanding them wastes the reader's time.

### What about brand style guides?

Run stop-slop first, then apply brand constraints. Voice rules land better on clean sentences than on padded ones.

### How often do agents reintroduce slop?

Every draft. Model updates shift which tells appear, so keep the pass on the checklist rather than in your memory.

### Can I automate it in CI?

You can fail a docs pull request on banned phrases, which catches laziness. A human ear still catches emptiness written in fresh words.
