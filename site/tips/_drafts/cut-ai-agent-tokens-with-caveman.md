---
kicker: ""
series: ""
nextLocked: "true"
nextLabel: "Next article"
nextHref: "./keep-ai-coding-changes-minimal-with-ponytail.html"
standalone: false
out: site/tips/secret-agent-tips/cut-ai-agent-tokens-with-caveman.html
title: "Agent talk less with caveman"
primaryKeyword: "agent talk less with caveman"
secondaryKeywords: ["caveman communication mode","compress agent output tokens","terse AI agent replies"]
intent: informational
slug: "cut-ai-agent-tokens-with-caveman"
metaDescription: "agent talk less with caveman by forcing terse, filler-free agent replies while keeping code and errors exact. Use intensity levels, measure real savings, and drop compression when clarity is on the line."
canonical: "https://calvinmaighan.com/tips/secret-agent-tips/cut-ai-agent-tokens-with-caveman.html"
updatedAt: "2026-07-26"
updatedHuman: "July 26, 2026"
author: "Calvin Maighan"
ogImage: "https://calvinmaighan.com/calvin-article-3.png"
inBodyImage: "../../calvin-article-3.png"
inBodyImageAlt: "Cover for tip 3: agent talk less with caveman"
internalLinks: ["./scrape-websites-for-ai-agent-research.html","./read-dependency-source-code-with-opensrc.html","../name-ai-agent-skills-after-the-job.html","../../contact.html"]
externalSources: ["https://github.com/JuliusBrussee/caveman","https://github.com/JuliusBrussee/caveman/blob/HEAD/skills/caveman/SKILL.md","https://blog.jetbrains.com/ai/2026/07/speak-to-ai-agents-like-cavemen-tosave-tokens/","https://cursor.com/docs/skills"]
ctaAboveFold: "Book a call"
ctaEnd: "Want token budgets and skill kits tuned for your agent fleet"
summary: "agent talk less with caveman by installing a skill that strips filler, hedging, and throat-clearing from agent narration while code, commands, and error strings stay byte-exact. The open JuliusBrussee/caveman skill advertises large savings on chatty answers. JetBrains measured smaller gains on agentic coding because diffs and tool payloads dominate those sessions. Use it for status, review, and research summaries. Drop it for security warnings and multi-step sequences. Measure your own mix before you promise finance a number."
---

Agent talk less with caveman when your token bill grows faster than your shipped features. Read one long agent session and count the sentences that carried no information. The apology, the plan announcement, the recap of what it is about to do, the summary of what it did. Your team pays for every one of them and reads none of them.

I reach for this skill third because it costs nothing to install and it makes the next eleven skills cheaper to run. Caveman targets narration. Code blocks, commands, and error strings stay exactly as written.

## What caveman changes

The [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) repository packages the skill for Claude Code, Cursor, Codex, and a long list of other agents. Its [SKILL.md](https://github.com/JuliusBrussee/caveman/blob/HEAD/skills/caveman/SKILL.md) defines intensity levels: lite, full, ultra, plus wenyan variants. Lite keeps grammar and cuts fluff. Full drops articles and allows fragments. Ultra compresses harder while still banning invented abbreviations that cost decode clarity without saving tokens.

Teach the shape to your team in one line: state the thing, the action, the reason, then the next step. "Inline object prop creates a new reference each render. Wrap it in `useMemo`." That replaces a paragraph narrating the journey of discovery.

## Honest numbers beat slogan numbers

Marketing copy around caveman leads with large output-token cuts, which holds when the answer is mostly prose. Agentic coding behaves differently. [JetBrains' SkillsBench write-up](https://blog.jetbrains.com/ai/2026/07/speak-to-ai-agents-like-cavemen-tosave-tokens/) forced caveman on across paired tasks, found no meaningful quality drop, and measured output-token savings near the high single digits on agentic work. Their reasoning is the part your finance partner needs: code, diffs, and tool payloads dominate those sessions, and caveman leaves all three alone.

Promise leaner status and clearer review notes. Measure the bill. Skip the two-thirds claim on a coding fleet that already emits mostly patches.

## Where it pays the same day

Long runs come first. Agents narrate every tool call, and "Sure, I will now inspect the file, then I will consider the options" burns tokens and patience. Caveman turns that into "Checking auth middleware. Guard uses `<` not `<=`. Fix next." Your engineers still follow along.

Review comments come second. Short findings land better in a pull request, and full intensity strips the throat-clearing reviewers already skip.

Research summaries come third. Tip 2 showed how to [scrape websites for AI agent research](./scrape-websites-for-ai-agent-research.html) and keep artifacts on disk. Caveman handles the layer above: claim, URL, quote, decision, with no essay about crossing tabs.

## Install it as a job-named skill

Wrap the upstream skill and call it `compress-agent-replies`, or keep the name caveman when slash invocation already lives in muscle memory. Either way the description states the activation conditions: token pressure, long sessions, status-heavy work. It also lists the exits.

Keep these four exits in the skill body, because compression that creates ambiguity buys you an incident instead of a saving:

- Security warnings stay in full sentences.
- Irreversible confirmations stay explicit.
- Multi-step sequences keep their conjunctions when order can be misread.
- A confused human triggers a reset to normal language.

## Compression is not evidence

Caveman shrinks the talking. It adds nothing to what the agent knows. [Read dependency source code with opensrc](./read-dependency-source-code-with-opensrc.html) when the library is the question, scrape when the page is the question, and compress when the agent starts performing its reasoning for an audience of none. A team that only compresses still hallucinates. A team that only researches still pays twice to explain the research.

## A week-long rollout

1. Install caveman for one pilot pod.
2. Force full intensity on chat-heavy tasks for two days.
3. Force it on coding tasks for two days.
4. Compare the token dashboard and ask reviewers about friction.
5. Keep the level that wins on your mix, and document the exits.

Small coding savings still justify keeping it for planning and research threads. Large chat savings justify making it the default for support macros and internal question answering. One intensity everywhere is a slogan.

## Failure modes

Invented shorthand tops the list. Compression styles that produce `cfg` and `impl` save nothing under real tokenizers and tax the reader. Prefer short real words, and keep API names exact.

Status theater comes next. Decorative tables and emoji checklists look friendly and still cost money. Caveman pushes them out of default replies, and your customer-facing voice stays warm regardless.

Silent overconfidence is the dangerous one. Terse answers sound more certain than the evidence supports, so require citations for factual claims even when the sentence runs five words.

## Ship the habit this week

Install caveman on one pod, run the four-day comparison, and write down the intensity that wins. Token thrift alone still leaves you with giant diffs to review, which is why tip 4 covers how to [keep AI coding changes minimal with ponytail](./keep-ai-coding-changes-minimal-with-ponytail.html). Caveman cleans the talk. Ponytail cleans the patch.

If you want a calibrated install across Cursor, Claude Code, and your internal agents, [book a call](../../contact.html). I set the intensity defaults, the measurement, and the clarity exits so compression never becomes a liability.

## Sources

- [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)
- [caveman SKILL.md](https://github.com/JuliusBrussee/caveman/blob/HEAD/skills/caveman/SKILL.md)
- [JetBrains SkillsBench write-up](https://blog.jetbrains.com/ai/2026/07/speak-to-ai-agents-like-cavemen-tosave-tokens/)
- [Cursor Agent Skills](https://cursor.com/docs/skills)

## FAQ

### Will caveman break code in diffs?

The skill rules keep code, commands, and error strings verbatim. Compression targets narration. Spot-check the first week on your stack anyway.

### Which intensity should a product team start with?

Lite or full. Lite keeps articles and full sentences, full drops articles and allows fragments. Ultra suits operators who already trust the style.

### Why do blog claims and coding benchmarks disagree?

Chat answers are mostly prose, so filler removal looks dramatic. Agentic sessions are mostly code and tool payloads, which caveman leaves alone. JetBrains measured that gap on SkillsBench.

### When must the agent leave caveman mode?

Security warnings, irreversible confirmations, and multi-step sequences where a missing conjunction changes the order. Resume compression once the risky part is clear.
