---
title: "Research what people said last month"
primaryKeyword: "research what people said last month"
intent: howto
slug: research-what-people-said-last-month
metaDescription: "research what people said last month with the last30days skill so product teams pull fresh Reddit, HN, GitHub, and web signal before betting a roadmap on outdated assumptions."
canonical: https://calvinmaighan.com/tips/secret-agent-tips/research-what-people-said-last-month.html
inBodyImage: "../../calvin-article-2.png"
ogImage: "https://calvinmaighan.com/calvin-article-2.png"
updatedAt: 2026-07-22
updatedHuman: July 22, 2026
summary: "Research what people said last month with the last30days skill so your team hears current language, complaints, and workarounds before you lock a roadmap bet. The skill pulls multi-source posts with citations and engagement context instead of a generic model prior from training day. You get faster discovery, clearer copy, and fewer features aimed at problems nobody still has."
standalone: false
kicker: ""
series: ""
nextHref: "./remove-ai-writing-tells-from-prose.html"
nextLabel: "Next article"
nextLocked: "true"
ctaAboveFold: "Book a call"
ctaEnd: "Want last30days wired into your team workflow"
inBodyImageAlt: "Calvin Maighan article series cover for secret agent tips on researching what people said last month"
out: site/tips/secret-agent-tips/research-what-people-said-last-month.html
---

You research what people said last month when you refuse to ship from vibes and stale blog roundups. The [last30days skill](https://github.com/mvanhorn/last30days-skill) exists for that job: pull what people actually posted across Reddit, X, YouTube, TikTok, Hacker News, GitHub, Polymarket, and the web, then synthesize with citations. Product teams use it as a scout. It does not replace talking to your customers. It tells you which questions deserve those conversations this week.

Nielsen Norman Group still maps [which UX research methods](https://www.nngroup.com/articles/which-ux-research-methods/) fit which questions. Teresa Torres pushes [continuous interviewing](https://www.producttalk.org/continuous-interviewing/) as an ongoing habit. Marty Cagan's work on [evidence-based product decisions](https://www.svpg.com/evidence/) keeps the bar on proof. last30days sits upstream of those habits: a dated, citable scan of public signal so you walk into interviews and experiments with sharper hypotheses.

## Why "last month" matters for agent research

Models carry training cutoffs and generic advice. A coding agent without a research skill will invent "users want" statements from that prior. Public conversation moves faster than weights update, especially in AI tooling, pricing reactions, and workflow pain.

A thirty-day window forces freshness. You see the complaint that started after a vendor changed packaging. You see the workaround that replaced last quarter's favorite app. You see language people use today, which is gold for onboarding copy and SEO tips later in this series.

Wider windows help for slow categories. Label them. "Last 18 months in payroll ops" is a different claim than "last 30 days in AI code editors." Agents should state the window in the first paragraph of every research memo.

## What last30days is good for

**Positioning and language.** Which metaphors show up when people describe the job? Which words signal pain?

**Competitive reaction.** What did users say the week a rival shipped a feature?

**Incident and outage aftermath.** What broke trust, and what restored it?

**Hiring and tooling trends.** Which skills and stacks people recommend right now?

**Content angles.** Which questions already draw comments, so your article or video has demand?

It is weaker for silent majority behavior inside your product. Pair it with analytics, support tags, sales call notes, and interviews.

## How to brief the skill

Bad brief: "Research AI agents."

Good brief: "Research what product engineers said in the last 30 days about flaky AI coding diffs in pull requests. Focus on review pain, trust, and workflow rules. Prefer Reddit, HN, and GitHub discussions with concrete examples."

Include:

1. Topic and audience
2. Decision the research will inform
3. Sources to prefer or skip
4. Geographic or segment constraints if real
5. Output shape: memo with citations, themes, and open questions

Agents wander when the decision is missing. Tie every run to a choice: ship, cut, price, rewrite, or interview next.

## A repeatable research loop

1. **State the decision.** One sentence.
2. **Run last30days** with a tight brief.
3. **Cluster themes** with example links, not orphan quotes.
4. **Score confidence.** High when many independent sources agree; low when one viral thread dominates.
5. **Pick next evidence.** Interview script, support query, or prototype test.
6. **Write a dated observation** into product memory ([tip 6](./persist-codebase-knowledge-across-ai-chats.html)).
7. **Act or schedule a re-run** when the bet is time-sensitive.

Skip step 6 and the insight dies in a Slack thread. Skip step 5 and you confuse social heat with product truth.

## Reading social signal without fooling yourself

**Engagement is not prevalence.** A loud thread can be a niche. Note sample size and platform bias.

**Builders over-index on builder forums.** Reddit and HN skew technical. Your buyers might live in LinkedIn comments, vertical Discords, or private Slack groups you cannot scrape. Say what you could not see.

**Vendors seed narratives.** Weight first-person workflow posts over polished launch threads.

**Safety and privacy.** Do not scrape behind logins you lack rights to. Do not store personal data from posts in your company memory. Keep the theme and the public URL.

**Primary docs still win for facts.** Social listening finds sentiment and language. Specs, statutes, and benchmarks still need primary sources.

## Outputs your team can use Monday

Demand a memo with four sections:

1. **Decision under review**
2. **Themes** (3 to 7) with two citations each
3. **Language bank** (phrases to steal for UI and docs)
4. **Next evidence** (who to interview, what to measure)

Optional appendix: raw links. Keep the main memo short enough a PM reads it before standup.

For content teams, add a fifth section: article or video angles ranked by demonstrated demand. Tip 8 on [removing AI writing tells from prose](./remove-ai-writing-tells-from-prose.html) then keeps the draft human once the angle is chosen.

## Product examples

**Example A: AI code review feature.** last30days surfaces repeated anger about agents rewriting unrelated files. You ship a "touch only listed paths" guard and a PR checklist. Social signal named the pain; your users confirm it in five interviews.

**Example B: Pricing page rewrite.** Research shows buyers compare you to a rival on "setup time," not on model brands. You lead with time-to-first-value. Copy changes in a week because the language bank was specific.

**Example C: Kill a roadmap item.** Heat around a feature is nostalgia from power users who churned. Support volume for that feature is near zero. You cut the bet and say why, with dates.

## Agent install notes

Install the skill where your coding or research agent loads skills. Keep API keys for optional sources in your secret store, not in the repo. Run a doctor or health check when sources fail so the agent admits gaps instead of hallucinating quotes.

Name the skill after the job if you wrap it: `research-what-people-said-last-month` beats a cute internal codename when humans scan the skill list under pressure.

Require citations. If the agent cannot link a claim, the claim does not enter the memo. Invented URLs are a hard fail in review.

## Pair with your internal evidence

Social listening is one input in an evidence stack:

- last30days for public language and timely themes
- support and sales notes for your customers
- product analytics for behavior
- interviews for jobs-to-be-done depth
- experiments for causal proof

When social and first-party evidence disagree, first-party wins for your roadmap. Social still helps you understand the market you do not yet serve.

## Cadence suggestions

- **Weekly:** one run tied to the riskiest open decision
- **Per launch:** pre-launch scan and day-3 reaction scan
- **Per incident:** 72-hour reputation and workaround scan
- **Per hiring push:** tooling and skill language scan for role posts

Cadence without decisions becomes magazine reading. Protect the team's time.

## Anti-patterns

- Running a vague topic with no decision attached
- Treating a single viral post as a segment
- Pasting quotes into marketing without checking context
- Letting the agent invent sources when APIs fail
- Skipping the write-back to memory
- Using social sentiment to override regulated or safety requirements

## Ship checklist

1. Install last30days and verify source health.
2. Write a one-page brief template with a Decision line.
3. Run one real decision this week end to end.
4. Store themes as dated memory observations.
5. Schedule the next evidence step on the calendar.
6. Re-run only when the decision is still open or the market moved.

Research is a verb. last30days makes the verb cheap enough that teams actually do it before they build.

## Consulting use on this portfolio

On fractional AI and SaaS engagements I run last30days before rewriting positioning or agent workflows. Clients see citations, not my gut. We store the dated memo in their memory MCP so the next agent session inherits the market note. That loop turns public chatter into a durable product asset instead of a slide that dies after the meeting.

## Building a language bank that ships

The language bank is the most stolen section of the memo. Pull exact phrases people use for the job, the pain, and the workaround. Do not polish them into brand voice yet. Put the raw phrases next to your current UI copy. The gaps are your rewrite list.

Example: if practitioners say "the agent rewrote my PR" and your marketing says "autonomous software engineering," you have a trust problem, not a feature gap. Change the headline to match the fear you can resolve. Then prove the guardrails in the product.

I keep language banks in the same repo as the product glossary. Agents that draft UI strings must open the bank first. That is how research reaches the pixels.

## Query design that avoids echo chambers

Run at least two query families per decision:

1. **Problem-shaped:** "AI coding PR too many files", "agent broke CI", "reviewer rejects AI diffs"
2. **Solution-shaped:** "minimal AI commits", "YAGNI coding agents", "small PR agent workflow"

If both families surface the same theme, confidence rises. If only solution-shaped queries light up, you may be sampling advocates. If only problem-shaped queries light up, you may have demand without a known category name.

Log the queries in the memo. Future you will thank present you when a stakeholder asks how you sampled.

## When the sample is thin

Say it. "Twelve substantive posts in thirty days, mostly hobbyists" is a valid finding. Thin samples still inform: they may tell you the category is quiet, private, or poorly named. Do not pad with model priors to look complete. Completeness theater is how roadmaps grow features nobody asked for.

If the category is private enterprise, switch methods: win/loss interviews, support tag mining, and design partners. last30days still helps for adjacent public tooling pain that your buyers also feel.

## Turning research into ticket titles

End every memo with three ticket-shaped lines. Not epics. Tickets: "Add path allowlist to agent PRs", "Rewrite pricing hero around setup time", "Kill unused export wizard." Product managers can schedule tickets. They cannot schedule vibes.

I score each ticket with confidence from the sample. High confidence tickets enter the next sprint discussion. Low confidence tickets become interview questions. That mapping is the whole point of the skill.

## Share-out format for Slack

Post a 8-line summary: decision, top theme, two links, language phrase, next evidence, owner, date. Attach the full memo. Busy founders read eight lines. Researchers still get the appendix.

## Competitive launch week playbook

When a rival launches, run last30days within 48 hours with queries for the feature name, the pain it claims to solve, and the complaint language. Store the memo with the launch date in the title. Product and marketing then share one evidence pack instead of three conflicting Slack theories.

## Sources

- [last30days skill on GitHub](https://github.com/mvanhorn/last30days-skill)
- [Which UX research methods (Nielsen Norman Group)](https://www.nngroup.com/articles/which-ux-research-methods/)
- [Continuous interviewing (Product Talk)](https://www.producttalk.org/continuous-interviewing/)
- [Evidence-based product decisions (SVPG)](https://www.svpg.com/evidence/)
- Related: [Persist codebase knowledge across AI chats](./persist-codebase-knowledge-across-ai-chats.html)
- Series cards on [calvinmaighan.com tips](../../index.html#tips)
 Fresh signal beats polished guessing when the market moves every sprint. Record the window dates in every memo so next quarter knows what aged out.

## FAQ

### What is the last30days skill?

last30days is an agent skill that researches what people actually said about a topic in the last month across sources like Reddit, X, YouTube, Hacker News, GitHub, and the web, then returns citations and engagement context.

### Does last30days replace customer interviews?

No. It complements interviews and analytics. Use it for fast market and language signal, then validate with your users through interviews, support logs, and product data.

### How fresh should the window be?

Thirty days fits fast-moving AI and SaaS topics. Narrow to a week for breaking incidents. Widen only when the category moves slowly and you still label the date range in the writeup.

### What do I store after a run?

Store dated findings, quote links, and product implications in your codebase or product memory. Do not store personal data from posts. Keep the decision, not the raw scrape dump.

### When is social listening the wrong tool?

Skip it for private enterprise workflows with no public chatter, for regulated claims that need primary docs, and when you already have enough first-party evidence for the decision.
