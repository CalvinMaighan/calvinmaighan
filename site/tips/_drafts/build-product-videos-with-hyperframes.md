---
title: "Build product videos with HyperFrames"
primaryKeyword: "build product videos with HyperFrames"
intent: howto
slug: build-product-videos-with-hyperframes
metaDescription: "build product videos with HyperFrames using HTML compositions and deterministic timing so launch clips, PR explainers, and decks stay editable by agents and humans."
canonical: https://calvinmaighan.com/tips/secret-agent-tips/build-product-videos-with-hyperframes.html
inBodyImage: "../../calvin-article-10.png"
ogImage: "https://calvinmaighan.com/calvin-article-10.png"
updatedAt: 2026-07-26
updatedHuman: July 26, 2026
summary: "Build product videos with HyperFrames when you need motion with a contract: HTML compositions, timing attributes, and renders an agent can revise without timeline spaghetti. I use the skill pack for launch clips, pull request explainers, slideshow decks, and captioned talking-head packages. Write the beat sheet first, freeze the media assets, and show real product UI whenever you can capture it."
standalone: false
kicker: ""
series: ""
nextHref: "./catch-ai-code-mistakes-with-lint.html"
nextLabel: "Next article"
nextLocked: "true"
ctaAboveFold: "Book a call"
ctaEnd: "If you want a repeatable product video pipeline"
inBodyImageAlt: "Cover for tip 10: build product videos with HyperFrames"
out: site/tips/secret-agent-tips/build-product-videos-with-hyperframes.html
---

Build product videos with HyperFrames the next time launch week needs motion your team can still edit on Thursday. The usual path goes fine until someone asks to change scene three, the timeline tool renumbers everything, the captions drift, and your designer spends a day repairing a forty-five second clip.

HyperFrames keeps compositions in HTML with timing attributes, so an agent can revise a scene the way it revises a component. The skill pack routes from the entry skill into core, creative, animation, CLI, and specialized flows such as product-launch-video and pr-to-video. For motion fundamentals, [Web Animations](https://www.w3.org/TR/web-animations-1/) and [MDN CSS animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations) still hold. When you publish, [VideoObject schema](https://schema.org/VideoObject) helps machines read the asset.

## Start with story

Write the beat sheet before you open a composition. Agents pad scenes when the story stays vague, and one promise with one proof beats a vanity montage.

Then pick the flow that matches the job. PR-to-video turns a diff into a changelog story for investors or ship notes. Product-launch-video turns a URL or a brief into a promo path. Slideshow covers decks with a presenter attached.

## Determinism is the feature

Seek-safe keyframes beat timeline spaghetti in week three, when the copy changes and nobody remembers which layer held the old headline. Lint and preview in the CLI loop, and catch timing errors before an overnight render.

Resolve BGM, voice, and brand assets through media-use so renders read from frozen local files. Mystery audio rips teach you copyright law mid-launch.

## Brand and truth

Keep brand tokens inside the composition. Neon on a beige product confuses the audience you already paid to acquire. Skip the AI b-roll where real UI exists, because viewers notice invented screens and the trust never comes back in the same session.

Export for the channel you will actually post to. Widescreen for site embeds, vertical when distribution demands it, and no six-ratio render farm unless somebody owns each upload.

## A shoot list that works for SaaS

1. Cold open with the user problem in one sentence on screen.
2. Show the real product solving it in under twenty seconds.
3. Name the mechanism rather than the buzzword.
4. Close with one call to action matching the page you will embed on.

A second call to action usually means a second clip. Agents pad endings with "and also" slides, so cut them in preview.

## Audio and captions

Resolve voice and music through media-use, freeze the files, and keep a ledger entry for each. Caption tracks belong to accessibility and to distribution, so sync talking-head overlays to the transcript rather than to a guess.

A loud royalty-free track fighting the voiceover makes the product feel cheap. Silence with good foley often reads more premium than a generic drop.

## The revision loop I trust

Change copy in the HTML source, preview, adjust timing attributes, preview again, and render only when a scrub through the cut feels right. Agents that jump to final encode spend hours fixing captions that preview would have exposed in seconds.

Keep a short changelog in the composition folder: date, what changed, who approved. Video files leave no useful git blame on their own.

## Failure modes

Skipping the beat sheet, which produces beautiful emptiness.

Letting agents invent UI that does not exist.

Skipping preview because the render will tell you. Renders are expensive teachers.

Porting a Remotion project nobody asked you to port. A passing mention is not a migration request.

Rendering six aspect ratios with no owner for the uploads.

## Prompts that waste less film

A weak prompt reads "Make a cool launch video for our SaaS."

A strong one reads: "45-second widescreen launch clip. Promise: extract invoices with page-level evidence. Proof: three UI beats from these PNGs. CTA: book a call. Brand tokens from `brand.json`. No fake UI."

Give the agent the beat sheet, the assets, and the forbidden list. Creativity without constraints invents features you do not ship.

## Cost control

Renders burn time, previews burn minutes, and script mistakes burn both. Freeze assets early and cap revision rounds in the brief: two preview cycles, then encode. Agents chase perfect kerning on a short clip forever when nobody sets the limit.

On client work I price the composition system and the first two videos rather than infinite regenerations. The skill pack stays in the repo so the team reskins later without calling me about a comma.

## When to skip it

A raw interview that only needs captions goes to a captions skill. A live product recording with no motion design goes to your editor. HyperFrames earns its place when composition, brand, and agent editability all matter at once.

## Ship the habit this week

Write one beat sheet for a clip you already owe someone, freeze the assets, and run two preview cycles before the first render. Put the final file on a real page with a clear poster frame and match the last-frame call to action to the page it sits on.

Tip 9 kept the [landing page free of AI slop](./design-landing-pages-without-ai-slop.html). Tip 11 moves back to code, where you [catch AI code mistakes with lint](./catch-ai-code-mistakes-with-lint.html) before the release gates run.

If you want a repeatable product video pipeline, [book a call](../../contact.html). More notes live in the [tips index](../../index.html#tips).

## Sources

- [W3C Web Animations](https://www.w3.org/TR/web-animations-1/)
- [MDN using CSS animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations)
- [Schema.org VideoObject](https://schema.org/VideoObject)

## FAQ

### Why HyperFrames instead of Remotion?

Choose HyperFrames when you want HTML-first compositions and this skill ecosystem. Port an existing Remotion project only on an explicit request.

### Can non-developers edit?

With a tight component set and a one-page guide, marketers change copy and assets safely. Structure stays with engineering.

### How long should a launch clip be?

Long enough for one promise and one proof. Everything past that is vanity footage.

### Do I need custom music?

No, but resolve licensed or generated audio through media-use and freeze the file so the render never drifts.
