---
title: "Research what people said last month"
primaryKeyword: "research what people said last month"
intent: howto
slug: research-what-people-said-last-month
metaDescription: "research what people said last month with the last30days skill so product teams pull fresh Reddit, HN, GitHub, and web signal before betting a roadmap on outdated assumptions."
canonical: https://calvinmaighan.com/tips/secret-agent-tips/research-what-people-said-last-month.html
inBodyImage: "../../calvin-article-7.png"
ogImage: "https://calvinmaighan.com/calvin-article-7.png"
updatedAt: 2026-07-26
updatedHuman: July 26, 2026
summary: "Research what people said last month with the last30days skill so your team hears current language, complaints, and workarounds before you lock a roadmap bet. The skill pulls multi-source posts with citations and engagement context instead of a model prior from training day. You get faster discovery, sharper copy, and fewer features aimed at problems nobody still has."
standalone: false
kicker: ""
series: ""
nextHref: "./remove-ai-writing-tells-from-prose.html"
nextLabel: "Next article"
nextLocked: "true"
ctaAboveFold: "Book a call"
ctaEnd: "Want last30days wired into your team workflow"
inBodyImageAlt: "Cover for tip 7: research what people said last month"
out: site/tips/secret-agent-tips/research-what-people-said-last-month.html
---

Research what people said last month before you spend a quarter building for a complaint that expired. Ask an agent what your users want and it answers from a training prior with no date on it. The vendor changed packaging in May, half the market moved to a workaround in June, and your roadmap still cites a blog post from last year.

The [last30days skill](https://github.com/mvanhorn/last30days-skill) does that scan: pull what people posted across Reddit, X, YouTube, TikTok, Hacker News, GitHub, Polymarket, and the web, then synthesize with citations. I use it as a scout, never as a substitute for talking to customers. It tells you which conversations deserve your week.

Nielsen Norman Group maps [which UX research methods](https://www.nngroup.com/articles/which-ux-research-methods/) fit which questions. Teresa Torres makes the case for [continuous interviewing](https://www.producttalk.org/continuous-interviewing/). Marty Cagan holds the bar on [evidence-based product decisions](https://www.svpg.com/evidence/). last30days sits upstream of all three, giving you a dated, citable scan so you enter interviews with a sharper hypothesis.

## Why the window matters

Models carry training cutoffs and generic advice, so an agent without a research skill invents "users want" statements from that prior. Public conversation moves faster than weights, especially around AI tooling, pricing reactions, and workflow pain.

Thirty days forces freshness. You catch the complaint that started when a vendor repackaged their plans. You catch the workaround that replaced last quarter's favorite app. You catch the words people use today, which feed onboarding copy and every article you publish afterward.

Slow categories deserve wider windows, labeled as such. "Last eighteen months in payroll operations" is a different claim than "last thirty days in AI code editors." Require the window in the first paragraph of every memo.

## Brief it properly

A weak brief reads "Research AI agents."

A strong brief reads "Research what product engineers said in the last 30 days about flaky AI coding diffs in pull requests. Focus on review pain, trust, and workflow rules. Prefer Reddit, Hacker News, and GitHub discussions with concrete examples."

Include the topic and audience, the decision this research informs, the sources to prefer or skip, any real segment constraints, and the output shape. Agents wander when the decision is missing, so tie every run to a choice: ship, cut, price, rewrite, or interview next.

## The loop

1. State the decision in one sentence.
2. Run last30days with a tight brief.
3. Cluster themes with example links rather than orphan quotes.
4. Score confidence. Many independent sources agreeing beats one viral thread.
5. Pick the next evidence: an interview script, a support query, a prototype test.
6. Write a dated observation into product memory per [tip 6](./persist-codebase-knowledge-across-ai-chats.html).
7. Act, or schedule a re-run when the bet is time-sensitive.

Skip step six and the insight dies in a Slack thread. Skip step five and you mistake social heat for product truth.

## Read the signal honestly

Engagement is not prevalence. A loud thread can represent a niche, so note the sample size and the platform bias.

Builders over-index on builder forums. Reddit and Hacker News skew technical while your buyers may live in LinkedIn comments, vertical Discords, or private Slack groups nobody can scrape. Say what you could not see.

Vendors seed narratives, so weight first-person workflow posts above polished launch threads.

Respect the boundaries. Stay out of logins you lack rights to, keep personal data from posts out of company memory, and hold the theme plus the public URL.

Primary docs still win on facts. Social listening finds sentiment and language. Specs, statutes, and benchmarks need their own sources.

## The memo your team will read

1. The decision under review
2. Three to seven themes, each with two citations
3. A language bank of phrases worth stealing for the UI and the docs
4. Next evidence, naming who to interview and what to measure

Keep raw links in an appendix and the memo short enough to read before standup. Content teams add a fifth section ranking article angles by demonstrated demand, and tip 8 on [removing AI writing tells from prose](./remove-ai-writing-tells-from-prose.html) keeps the resulting draft human.

Close every memo with three ticket-shaped lines. Not epics. "Add a path allowlist to agent pull requests." "Rewrite the pricing hero around setup time." "Kill the unused export wizard." Product managers schedule tickets.

## Three runs that changed a decision

An AI code review feature: the scan surfaced repeated anger about agents rewriting unrelated files, so the team shipped a touch-only-listed-paths guard and a review checklist. Five interviews confirmed the pain the scan named.

A pricing page rewrite: buyers compared the product to a rival on setup time rather than model brands, so the hero led with time-to-first-value. The copy shipped in a week because the language bank was specific.

A cancelled roadmap item: the heat came from power users who had already churned, and support volume for the feature sat near zero. The team cut the bet and documented why, with dates.

## Where it sits in the evidence stack

Use last30days for public language and timely themes. Use support and sales notes for your actual customers. Use analytics for behavior, interviews for depth, and experiments for causal proof. When social signal and first-party evidence disagree, first-party wins your roadmap. Social still explains the market you do not serve yet.

## Ship the habit this week

Take one live roadmap question, write the decision in a sentence, and run a single scan against it. Store the dated memo in your memory server so the next agent session inherits the market note instead of rebuilding it. That loop turns public chatter into an asset that outlives the meeting.

If you want last30days wired into your team workflow, [book a call](../../contact.html). More notes live in the [tips index](../../index.html#tips).

## Sources

- [last30days skill on GitHub](https://github.com/mvanhorn/last30days-skill)
- [Which UX research methods (Nielsen Norman Group)](https://www.nngroup.com/articles/which-ux-research-methods/)
- [Continuous interviewing (Product Talk)](https://www.producttalk.org/continuous-interviewing/)
- [Evidence-based product decisions (SVPG)](https://www.svpg.com/evidence/)

## FAQ

### What is the last30days skill?

An agent skill that researches what people said about a topic in the last month across Reddit, X, YouTube, Hacker News, GitHub, and the web, returning citations and engagement context.

### Does it replace customer interviews?

No. Use it for fast market and language signal, then validate with your users through interviews, support logs, and product data.

### How fresh should the window be?

Thirty days fits fast-moving AI and SaaS topics. Narrow to a week for a breaking incident. Widen for slow categories, and label the range in the writeup.

### What do I store after a run?

Dated findings, quote links, and product implications. Skip personal data from posts, and keep the decision rather than the raw scrape.

### When is social listening the wrong tool?

Private enterprise workflows with no public chatter, regulated claims that need primary docs, and any decision where your first-party evidence already answers the question.
