---
title: "3.0.0-beta.1 · Vue DnD Kit"
description: "The first beta of v3, released on October 30, 2026. A rewrite with sortable lists and trees built in."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/changelog/v3-0-0-beta-1"
meta:
  "og:description": "The first beta of v3, released on October 30, 2026. A rewrite with sortable lists and trees built in."
  "og:title": "3.0.0-beta.1 · Vue DnD Kit"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Dokumentation/Changelog

# 3.0.0-beta.1

The first beta of v3, released on October 30, 2026. A rewrite with sortable lists and trees built in.

[Diese Seite bearbeiten](https://github.com/ZiZIGY/vue-dnd-kit/edit/master/docs/content/en/5.changelog/999.v3-0-0-beta-1.md)

v3 is a rewrite. One package, `**@vue-dnd-kit/core**`, does drag and drop, sortable lists and trees; `**@vue-dnd-kit/actions**` scripts drags from code, `**@vue-dnd-kit/devtools**` adds a tab to the Vue DevTools, and `**@vue-dnd-kit/nuxt**` sets it up in Nuxt.

Live Move stops between days; the chips below name the other gestures X ---- · Y ----

Demo wird geladen…

```
<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Trip from './Trip.vue';
</script>

<template>
  <DnDProvider>
    <Trip />
  </DnDProvider>
</template>
```

## What it brings

- ****Sortable lists, grids and trees****, built in: you render a draft of your array that reorders while you drag, and the drop writes the new order into your ref (or hands you `**e.result**`).
- ****Lists that share items****: groups, copies, swaps, rules for what goes where.
- ****Multi-drag**** with your own selection, and a rubber band ( `**makeSelectionArea**`).
- ****Drop zones**** with accept rules, and drops you confirm, refuse or apply yourself ( `**onBeforeDrop**`).
- ****Animations by default****: items slide, the drop lands on its slot, a cancel flies back.
- ****The keyboard and screen readers****: drags by slots, announcements, ARIA attributes.
- ****Areas**** ( `**makeDragArea**`): an axis, bounds, a grid, auto-scroll or a longer press for a part of the page, under one provider.
- ****Virtual lists****, ****sensors**** of your own, and ****DevTools****.

Start with the [**introduction**](https://zizigy.github.io/vue-dnd-kit/de/docs/getting-started/introduction). Coming from v2, see [**migrating from v2**](https://zizigy.github.io/vue-dnd-kit/de/docs/getting-started/migrating-from-v2).

```json
{"@context":"https://schema.org","@graph":[{"@id":"https://zizigy.github.io/vue-dnd-kit/de#website","@type":"WebSite","description":"Drag and drop for Vue 3: sortable lists, kanban boards, trees, multi-drag, animations and accessibility out of the box.","inLanguage":"de-DE","name":"Vue DnD Kit","url":"https://zizigy.github.io/vue-dnd-kit/de","translationOfWork":{"@id":"https://zizigy.github.io/vue-dnd-kit#website"}},{"@id":"https://zizigy.github.io/vue-dnd-kit/de/docs/changelog/v3-0-0-beta-1#webpage","@type":"WebPage","description":"The first beta of v3, released on October 30, 2026. A rewrite with sortable lists and trees built in.","name":"3.0.0-beta.1","url":"https://zizigy.github.io/vue-dnd-kit/de/docs/changelog/v3-0-0-beta-1","isPartOf":{"@id":"https://zizigy.github.io/vue-dnd-kit/de#website"},"potentialAction":[{"@type":"ReadAction","target":["https://zizigy.github.io/vue-dnd-kit/de/docs/changelog/v3-0-0-beta-1"]}]}]}
```

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
