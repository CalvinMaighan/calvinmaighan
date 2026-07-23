---
kicker: ""
series: ""
nextLocked: "true"
nextLabel: "Next article"
nextHref: "./keep-ai-coding-changes-minimal-with-ponytail.html"
standalone: false
out: site/tips/secret-agent-tips/cut-ai-agent-tokens-with-caveman.html
title: "Cut AI agent tokens with caveman"
primaryKeyword: "cut AI agent tokens with caveman"
secondaryKeywords: ["caveman communication mode","compress agent output tokens","terse AI agent replies"]
intent: informational
slug: "cut-ai-agent-tokens-with-caveman"
metaDescription: "cut AI agent tokens with caveman by forcing terse, filler-free agent replies while keeping code and errors exact. Use intensity levels, measure real savings, and drop compression when clarity is on the line."
canonical: "https://calvinmaighan.com/tips/secret-agent-tips/cut-ai-agent-tokens-with-caveman.html"
updatedAt: "2026-07-22"
author: "Calvin Maighan"
ogImage: "https://calvinmaighan.com/calvin-article-3.png"
inBodyImage: "../../calvin-article-3.png"
inBodyImageAlt: "Cover for skill 3: cut AI agent tokens with caveman"
internalLinks: ["./scrape-websites-for-ai-agent-research.html","./read-dependency-source-code-with-opensrc.html","../name-ai-agent-skills-after-the-job.html","../../index.html#contact"]
externalSources: ["https://github.com/JuliusBrussee/caveman","https://github.com/JuliusBrussee/caveman/blob/HEAD/skills/caveman/SKILL.md","https://blog.jetbrains.com/ai/2026/07/speak-to-ai-agents-like-cavemen-tosave-tokens/","https://cursor.com/docs/skills"]
faq:
  - q: "Will caveman break code in diffs?"
    a: "The skill rules say code, commands, and error strings stay verbatim. Compression targets narration. Still spot-check the first week on your stack."
  - q: "Which intensity should a product team start with?"
    a: "Start with lite or full. Lite keeps articles and full sentences. Full drops articles and allows fragments. Ultra is for operators who already trust the style."
  - q: "Why do blog claims and coding benchmarks disagree?"
    a: "Chat answers are mostly prose, so filler removal looks huge. Agentic sessions are mostly code and tool payloads, which caveman correctly leaves alone. JetBrains measured that gap on SkillsBench."
  - q: "When must the agent leave caveman mode?"
    a: "Security warnings, irreversible confirms, and multi-step sequences where missing conjunctions create ambiguity. Resume compression after the clear part."
ctaAboveFold: "Book a call"
ctaEnd: "Want token budgets and skill kits tuned for your agent fleet? Book a call. Next tip covers keeping coding changes minimal with ponytail."
---

# Cut AI agent tokens with caveman

**Summary**

cut AI agent tokens with caveman. You can cut AI agent tokens with caveman by installing a skill that strips filler, hedging, and throat-clearing from agent narration while leaving code, commands, and errors byte-exact. The open JuliusBrussee/caveman skill advertises large output savings on chatty answers. JetBrains’ SkillsBench write-up shows smaller gains on agentic coding because code and tool calls dominate. Use caveman for status, reviews, and Q&A. Drop it for security warnings and ambiguous multi-step sequences. Measure your own sessions before you promise finance a 65% bill cut.

Product teams that cut AI agent tokens with caveman attack the part of the bill they can shrink without starving the model of code. Caveman is a communication skill. It tells the agent to drop filler, pleasantries, and hedging, keep technical terms exact, and answer in tight fragments when fragments carry the meaning. Code blocks stay untouched. Error strings stay untouched. The savings live in the sentences between tool calls.

## What caveman changes

The [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) repository packages a skill for Claude Code, Cursor, Codex, and a long list of other agents. The [SKILL.md](https://github.com/JuliusBrussee/caveman/blob/HEAD/skills/caveman/SKILL.md) sets intensity levels: lite, full, ultra, plus wenyan variants. Lite keeps grammar and cuts fluff. Full drops articles and allows fragments. Ultra compresses harder while still forbidding invented abbreviations that hurt decode clarity.

Pattern to teach teammates: state the thing, the action, the reason, then the next step. “Inline object prop creates a new reference each render. Wrap it in useMemo.” That beats a paragraph that announces the journey of discovery.

## Honest numbers beat slogan numbers

Marketing copy around caveman often leads with large output-token cuts on chatty answers. That can be true when the answer is mostly prose. Agentic coding is a different animal. [JetBrains’ SkillsBench write-up](https://blog.jetbrains.com/ai/2026/07/speak-to-ai-agents-like-cavemen-tosave-tokens/) forced caveman on across paired tasks and found no meaningful quality drop, while output-token savings landed near the high single digits on agentic work. Their explanation is the one your finance partner needs: code, diffs, and tool payloads dominate those sessions, and caveman correctly leaves them alone.

Use that nuance in planning. Promise clearer status and leaner narration. Measure cost. Do not promise a two-thirds cut on a coding fleet that already emits mostly patches.

## Where caveman pays immediately

### Status updates during long runs

Agents love narrating every tool call. “Sure, I will now inspect the file, then I will consider…” burns tokens and patience. Caveman turns that into “Checking auth middleware. Guard uses < not <=. Fix next.” Humans still follow. The meter spins less.

### Code review comments

Short review notes land better in pull requests. Caveman’s sibling commands in the upstream kit lean into one-line findings. Even without those extras, full intensity review voice reduces throat-clearing that reviewers skip.

### Research summaries after scrapes

Tip 2 taught you to [scrape websites for AI agent research](./scrape-websites-for-ai-agent-research.html) and keep artifacts on disk. Caveman helps the summary layer: claim, URL, quote, decision. No essay about the journey across tabs.

## Install it as a job-named skill

Do not bury the skill under a cute brand folder. Follow [name AI agent skills after the job](../name-ai-agent-skills-after-the-job.html) and call it something like compress-agent-replies if you wrap the upstream skill, or keep caveman if slash invocation is already muscle memory for the team. The description should say when to activate: token pressure, long sessions, status-heavy work. It should also list the auto-clarity exits.

### Auto-clarity exits you must keep

- Security warnings stay in full sentences.
- Irreversible confirms stay explicit.
- Multi-step sequences keep conjunctions when order can be misread.
- User confusion triggers a normal-language reset.

Compression that creates ambiguity is not a savings. It is a future incident.

## Pair with source reading, not against it

Caveman shrinks narration. It does not replace evidence. [Read dependency source code with opensrc](./read-dependency-source-code-with-opensrc.html) when the library is the question. Scrape when the page is the question. Compress when the agent starts performing its reasoning for an audience of none. Teams that only compress still hallucinate. Teams that only research still waste tokens explaining the research twice.

## Operational playbook for a week

1. Install caveman for one pilot pod.
2. Force full intensity on chat-heavy tasks for two days.
3. Force it on coding tasks for two days.
4. Compare token dashboards and review friction.
5. Keep the level that wins on your mix. Document the exits.

If coding savings look small, keep caveman for planning and research threads. If chat savings look large, make it default for support macros and internal Q&A bots. One intensity across every surface is a slogan, not a plan.

## Failure modes

### Fake abbreviations

Some compression styles invent shorthand like “cfg” or “impl.” Upstream caveman ultra guidance warns that many of those tokens do not save money under real tokenizers and they tax the reader. Prefer short real words. Keep API names exact.

### Emoji status theater

Decorative tables and emoji checklists look friendly and still cost tokens. Caveman’s rules push them out of default replies. Your brand voice in customer emails can stay warm. Agent-to-engineer channels can stay dense.

### Silent overconfidence

Terse answers can sound more certain than the evidence supports. Require citations for factual claims even when the sentence is five words. Compression removes fluff. It does not remove the need for proof.

## How this sets up tip 4

Token thrift without change thrift still produces giant diffs. The next tip, [keep AI coding changes minimal with ponytail](./keep-ai-coding-changes-minimal-with-ponytail.html), attacks over-building. Caveman cleans the talk. Ponytail cleans the patch. Together they keep agent sessions cheap and reviewable.

If you want a calibrated install across Cursor, Claude Code, and your internal agents, [book a call](../../index.html#contact). I help product teams set intensity defaults, measurement, and the clarity exits so compression never becomes a liability.

## The short operating rule

Cut filler. Keep code exact. Measure on your workload. Drop caveman when clarity is the product. That is how you cut AI agent tokens with caveman without lying to yourself about the size of the win.

One last operator note: keep a short "clarity card" pinned in your team channel. Four bullets: security warnings in full sentences, irreversible confirms explicit, multi-step order preserved, user confusion resets to normal mode. When someone pastes a confusing caveman reply, point at the card instead of debating style. The card turns taste into policy.

If your agents also write customer-facing prose, route that work through a different skill with stop-slop rules and full sentences. Caveman is for machine-heavy loops. Reader-facing loops need a human register. Split the jobs the same way you split research tools.

Ship the clarity card. Keep the measurements. Move on to minimal diffs in tip 4.

## Worked example: long CI repair session

An agent spent forty minutes repairing a flaky suite. With default narration, half the transcript was ceremony. With caveman full, the transcript read like a lab notebook: failing test name, hypothesis, command, result, next probe. The patch size stayed the same. The human time to audit the session dropped. Token use on narration dropped with it.

That is the shape of a real win. Caveman did not invent a better fix. It removed the Broadway performance around the fix.

## Choosing intensity by channel

Internal engineering chat: full. Executive summaries that leave the engineering channel: lite. Customer-facing drafts: off, then run a separate editing pass. Classical wenyan modes are optional culture, not a default for mixed EN/FR product teams in Montreal. Keep the experiments fun in a sandbox. Keep production defaults boring.

Document the channel map in one markdown table next to the skill. Agents cannot guess your politics about tone.

## Metrics worth logging

- Output tokens per session, before and after.
- Human “please clarify” follow-ups per session.
- Escape hatches used for security or irreversible steps.
- Reviewer complaints about terse comments that hid risk.

If follow-ups rise faster than tokens fall, dial intensity down. Savings that create more turns can erase themselves.

## Teaching the team without making a joke of it

Caveman invites jokes. Jokes are fine once. Process needs a straight face. Frame the skill as an engineering control, like log levels. Nobody ships debug logs to production for fun. Nobody should ship purple prose to a token meter for fun either.

Run a fifteen-minute lunch demo. Show the same bug fix with and without caveman. Show the JetBrains caveat so people trust you. Then set the default and move on.

## Sample before and after replies

Before: "Sure! I would be happy to help investigate this issue. It seems like the problem might be related to how the authentication middleware validates tokens. I will take a look at the relevant files and get back to you with a detailed analysis." After: "Bug in auth middleware. Token expiry check uses < not <=. Patch next." Same facts. Fewer tokens. Faster human parse.

Before on a research summary: "I explored several sources and gathered a comprehensive overview of the competitive landscape across multiple dimensions." After: "Three vendors. Only Acme lists SCIM on Pro. Sources: [urls]." The second version can ship into a decision record without editing.

## Rolling caveman into shared agents

Shared agents need a default intensity and an override phrase. "normal mode" and "stop caveman" should remain sacred. So should "security detail" as a local escape. Publish those phrases in the team handbook. If only one engineer knows the escape hatch, on-call becomes theater when compression hides a warning.

For multi-agent setups, compress subagent chatter harder than the parent summary. Parents speak to humans. Children speak to parents. Ultra can be fine between machines. Lite may be better at the human boundary.

## Compatibility with stop-slop and brand voice

Caveman and stop-slop share enemies: filler, false contrasts, em dash crutches, adverb stacks. They differ in audience. Stop-slop polishes prose for readers. Caveman compresses agent chatter for meters and speed. Use stop-slop on articles and customer emails. Use caveman inside agent sessions. Do not run caveman on public marketing copy unless you want a brand incident.

On this site, articles stay in thought-leadership voice. Agents working on the site can still talk caveman while they edit. Humans read the article. Agents read the skill.

## Thirty-day adoption scorecard

Week one: install and demo. Week two: default full on engineering agents. Week three: review metrics and escape-hatch logs. Week four: freeze the channel map and write the exception list. If leadership asks for a single ROI number, give two: narration token change, and human audit time change. Both matter. Only one shows up on the model invoice.

## A closing field guide

Token compression is a lever, not a religion. Flip it for engineering agents. Measure. Keep the exits. Refuse to market chatty-benchmark percentages as coding-fleet savings. Your credibility with finance and with engineers both depend on that honesty.

If you remember one operating line, remember this: cut filler, keep code exact, measure your mix, protect clarity. That is how product teams cut AI agent tokens with caveman and still ship work humans trust.


## Keep the feedback loop short

After one week on caveman, compare two numbers side by side: narration tokens and clarification turns. If both fall, keep the intensity. If clarification turns rise, step down a level before you abandon the skill. Compression that causes rework is expensive theater.

## FAQ

### Will caveman break code in diffs?
The skill rules say code, commands, and error strings stay verbatim. Compression targets narration. Still spot-check the first week on your stack.

### Which intensity should a product team start with?
Start with lite or full. Lite keeps articles and full sentences. Full drops articles and allows fragments. Ultra is for operators who already trust the style.

### Why do blog claims and coding benchmarks disagree?
Chat answers are mostly prose, so filler removal looks huge. Agentic sessions are mostly code and tool payloads, which caveman correctly leaves alone. JetBrains measured that gap on SkillsBench.

### When must the agent leave caveman mode?
Security warnings, irreversible confirms, and multi-step sequences where missing conjunctions create ambiguity. Resume compression after the clear part.
