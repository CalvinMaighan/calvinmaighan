---
title: 'Serve resume PDF at the site root'
type: 'feature'
created: '2026-08-06'
status: 'done'
route: 'one-shot'
---

# Serve resume PDF at the site root

## Intent

**Problem:** The resume was stored outside the site's deployed static root, so `calvinmaighan.dev/resume.pdf` could not resolve correctly.

**Approach:** Relocate the validated PDF into `site/` and teach the Bun server to return PDF assets with an explicit inline disposition and the correct MIME type.

## Suggested Review Order

- Register PDF responses with the browser-safe MIME type.
  [`serve.ts:20`](../../site/serve.ts#L20)

- Keep the resume viewable inline with a stable download filename.
  [`serve.ts:54`](../../site/serve.ts#L54)
