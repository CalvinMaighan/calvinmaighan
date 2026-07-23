---
title: "Remove AI writing tells from prose"
primaryKeyword: "remove AI writing tells from prose"
intent: howto
slug: remove-ai-writing-tells-from-prose
metaDescription: "remove AI writing tells from prose with a stop-slop pass so public writing sounds like a person with judgment, not a model performing intelligence."
canonical: https://calvinmaighan.com/tips/secret-agent-tips/remove-ai-writing-tells-from-prose.html
updatedAt: 2026-07-22
updatedHuman: July 22, 2026
summary: "remove AI writing tells from prose before you publish anything that left an agent chat. stop-slop cuts filler, false agency, binary contrasts, and em dash crutches. I run it on articles, proposals, and UI microcopy. Read the draft aloud. If it sounds like a keynote, cut until it sounds like a colleague. Trust ranks longer than clever cadence."
standalone: false
kicker: "Tip 8 of 14"
series: "14 secret agent tips for product teams"
nextHref: "./design-landing-pages-without-ai-slop.html"
nextLabel: "Next article"
nextLocked: "true"
ctaAboveFold: "Book a call"
ctaEnd: "If you want cleaner public writing in your agent workflow"
inBodyImageAlt: "Cover art for removing AI writing tells from prose"
out: site/tips/secret-agent-tips/remove-ai-writing-tells-from-prose.html
---

remove AI writing tells from prose if you care whether readers trust you. Template cadence is obvious now. People may not name the patterns. They still feel them.

stop-slop is the skill I use for that cleanup. Credit to the public craft notes around [Hardik Pandya's writing](https://hvpandya.com). Pair it with [Google's helpful content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) and honest [Article schema](https://schema.org/Article) when the piece is public. Ranking without trust is temporary.

## What I cut

Throat-clearing openers. Emphasis crutches. Adverb stacks. Binary "not X, but Y" templates. False agency where "the solution emerges." Quotable fluff that sounds carved for LinkedIn. Em dashes used as perfume.

What I keep: active voice, specific nouns, varied rhythm, technical terms exact, your actual point.

## Where I run it

Every public article. Proposal narratives. UI microcopy that came from an agent. Incident mail when an agent drafted the first pass. I do not run it as a personality eraser on private scratch notes.

On this portfolio, `/article` requires a stop-slop pass before done. That rule exists because I got tired of publishing sentences that sounded smarter than they were.

## A quick human check

Read the draft aloud once. If you hear a keynote, cut until you hear a colleague. Score directness, rhythm, trust, authenticity, density. Below the bar means another pass, not a synonym swap.

Keep code identifiers and legal names exact while you delete the adverbs around them. stop-slop is not caveman. Public essays stay grammatical. They stop performing intelligence.

## Team habit

Paste the quick checks into a docs PR template. Humans catch what the skill misses. Agents reintroduce slop every draft. Make the pass a checklist item, not a mood.

Brand style guides still apply after the cleanup. Clean clay shapes better than sloppy clay with a logo stamped on top.

## Patterns I kill on sight

"In today's fast-paced world." Delete and start with the fact.

"It is important to note that." Delete. If it mattered, you would already be saying it.

"Not only X, but also Y." State Y. Add X only if it earns space.

"The landscape is evolving." Name the change with a date, a product, or a metric.

"Let's dive in." You are already in. Write the next useful sentence.

"At the end of the day." End the paragraph instead.

These phrases are not evil. They are empty. Empty sentences on a consulting site tax trust.

## A 10-minute pass that works

1. Search the draft for "not" contrasts and rewrite the positive claim.
2. Search for em dashes and replace with periods or commas.
3. Cut the first sentence of every section if it only announces the section.
4. Replace three adjectives with one concrete noun each.
5. Read the summary aloud. If you would not say it to a peer over coffee, rewrite.

I keep this list in the skill and in a PR checklist for docs. Agents forget. Checklists remember.

## Where stop-slop meets SEO

Helpful content guidance and stop-slop point the same way. Answer the query. Show experience. Avoid filler that exists to hit a word count. A dense 900-word answer that solves the job beats a 2,400-word tour of synonyms.

Schema does not fix soggy prose. [Article](https://schema.org/Article) markup on empty cadence still reads empty to humans. Clean the words first.

## Before and after from real drafts

Before: "In this comprehensive guide, we will explore how modern teams can leverage AI agents to unlock unprecedented productivity across the entire software development lifecycle."

After: "This guide shows how I wire agent skills so a SaaS team ships smaller PRs with fewer invented APIs."

Before: "The platform seamlessly empowers stakeholders to collaborate in real time while maintaining robust security postures."

After: "Admins invite teammates. Roles gate billing. Sessions expire after seven days."

The after versions sound less impressive in a pitch deck. They survive a technical buyer. That is the trade I want on a consulting site.

## People-pleasing is also slop

"Happy to help." "Great question." "I would love to partner with visionary teams." These lines soothe the writer. They do not inform the reader. Cut them from public pages. Keep warmth in how you explain the work, not in empty praise.

## Failure modes

Using stop-slop to erase voice until everything sounds like beige cardboard. Specific stories should survive. Fake drama should not.

Running it on terse code comments and creating essays in the margins. Leave technical comments tight.

Skipping it because "the model is better now." The tells evolve. The pass stays.

Treating the pass as optional on "short" posts. Short posts still get shared. Short slop spreads faster.

## Sources

- [Hardik Pandya](https://hvpandya.com)
- [Google helpful content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Schema.org Article](https://schema.org/Article)
- Related: [Name AI agent skills after the job](../name-ai-agent-skills-after-the-job.html)
- Series: [tips on calvinmaighan.com](../../index.html#tips)

## FAQ

### Will stop-slop make copy boring?

It removes fake drama. Specific stories stay interesting.

### Should I run it on code comments?

Only when comments are prose. Leave terse technical comments alone.

### What about brand style guides?

Run stop-slop first, then apply brand constraints.

### How often do agents reintroduce slop?

Every draft. Keep the pass on the checklist.

### Can I automate stop-slop in CI?

You can fail a docs PR on banned phrases. You still need a human ear for voice. CI catches laziness. It does not catch emptiness that uses fresh words.

### Should marketing keep a separate voice guide?

Yes. stop-slop clears model sludge. Brand guides set the voice that remains. Run them in that order.
