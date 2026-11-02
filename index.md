---
title: "Vue DnD Kit — drag and drop for Vue"
description: "Sortable lists, kanban boards, trees and multi-drag for Vue 3 — animated, keyboard-ready and accessible out of the box."
canonical_url: "https://zizigy.github.io/vue-dnd-kit"
meta:
  "og:description": "Sortable lists, kanban boards, trees and multi-drag for Vue 3 — animated, keyboard-ready and accessible out of the box."
  "og:title": "Vue DnD Kit — drag and drop for Vue"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

v3 — Drag and drop for Vue 3Vue 3 · TypeScript · SSR

01Kanban

**Boards that trade cards**

02Trees

**Nesting by a nudge**

03Multi-drag

**Many items, one move**

04Sortable

**Lists that sort themselves**

05Animated

**Motion by default**

06A11y

space←↑↓→

**Keyboard first-class**

07Virtual

**Ten thousand rows**

Drag the cards — or Tab to one and use the arrow keys

# Drag and drop,<br>built for Vue.

Sortable lists, kanban boards, trees and multi-drag for Vue 3 — animated, keyboard-ready and accessible out of the box.

npm i @vue-dnd-kit/core

[Get started](https://zizigy.github.io/vue-dnd-kit/docs/getting-started/introduction)

Free and open source. MIT licensed.

00How it works

## Composables,<br>not components.

Your markup, your styles. Hand a template ref to a composable and the element drags, sorts and drops — with the animation, keyboard and screen reader work done for you.

- 01 `**makeSortableList**`Lists, grids and kanban columns that reorder as you drag — and trade items within a group.
- 02 `**makeSortableTree**`Nested data, rendered flat: depth by a sideways nudge, drops into folders, virtualization.
- 03 `**makeDraggable · makeDroppable**`Anything else: boards, canvases, uploads — your own rules for what goes where.

01Drag & drop

## Drag and drop

A draggable, a drop target and a rule for what goes where. Targets light up when they take the drag and refuse what they don't; what a drop does is up to you.

[Docs](https://zizigy.github.io/vue-dnd-kit/docs/guides/drag-and-drop)

Live Sort the files into the folders X ---- · Y ----

Loading the demo…

02Sortable

## Lists and grids

Render a draft of your array and it reorders live while you drag. On drop, the new order is written into your ref. Vertical, horizontal or a grid of any size.

[Docs](https://zizigy.github.io/vue-dnd-kit/docs/guides/sortable-lists)

Live Rearrange the apps, or move one into the dock X ---- · Y ----

Loading the demo…

03Kanban

## Kanban boards

Lists in one group trade items. Copy from a palette, take plain draggables in, or swap instead of shifting — the receiving list makes room as you hover.

[Docs](https://zizigy.github.io/vue-dnd-kit/docs/guides/shared-lists)

Live Move cards between the columns X ---- · Y ----

Loading the demo…

04Trees

## Trees

Rendered flat with depths, so they virtualize. Drag sideways to change the level or hover a folder to drop inside; limit depth and decide what nests where.

[Docs](https://zizigy.github.io/vue-dnd-kit/docs/guides/trees)

Live Drag sideways to change the depth X ---- · Y ----

Loading the demo…

05Multi-drag

## Multi-drag

Select with Ctrl/Cmd-click or draw a box, then drag one: the whole selection travels together and lands in order, even across lists.

[Docs](https://zizigy.github.io/vue-dnd-kit/docs/guides/multi-drag)

Live Ctrl/Cmd-click or draw a box, then drag X ---- · Y ----

06Constraints

## Axes, bounds and grids

A drag area sets the rules for everything dragged inside it: lock an axis, keep drags within its edges, snap to a grid — and change them while the app runs.

[Docs](https://zizigy.github.io/vue-dnd-kit/docs/guides/constraints)

Live Switch the rules, then drag a shape X ---- · Y ----

Loading the demo…

07And more

## Ready for real apps.

01

### Animated

FLIP while sorting, a drop that lands on its slot, data changes that animate. Bring GSAP or motion if you like.

02

### Accessible

Keyboard drags by slots, live announcements and ARIA attributes that never override yours.

03

### Virtual lists

TanStack Virtual and VueUse: thousands of rows, still sortable, still animated.

04

### Controlled

Pinia, a server or immutable data: skip the default write and apply the result yourself.

08Ecosystem

## A small core, a few sharp tools.

Everything drags with the core. Add the rest when you need it.

01

@vue-dnd-kit/devtools

### DevTools

A tab in Vue DevTools and Nuxt DevTools: a live mini-map, a joystick that drags anything, options you edit while the app runs.

02

@vue-dnd-kit/actions

### Programmatic drags

“Move up”, “move to Done”, guided tours and tests — real drags, announced and animated, from code.

03

@vue-dnd-kit/nuxt

### Nuxt module

Auto-imported composables, global components and SSR-safe defaults.

04

npx skills add

### For AI agents

An agent skill that teaches Claude Code and other assistants how the library works.

npx skills add ZiZIGY/vue-dnd-kit

**01**

1,243

End-to-end tests in three browsers

**02**

469

Unit tests

**03**

21KB

Draggables and drop zones, gzipped

**04**

9

Languages of these docs

## Choose where to start.

[**01**<h3>**Read the guide**</h3>From installation to your first sortable list in five minutes.](https://zizigy.github.io/vue-dnd-kit/docs/getting-started/introduction) [**02**<h3>**Browse examples**</h3>Live demos with their code, ready to copy or open in StackBlitz.](https://zizigy.github.io/vue-dnd-kit/docs/examples)

```json
{"@context":"https://schema.org","@graph":[{"@id":"https://zizigy.github.io/vue-dnd-kit#website","@type":"WebSite","description":"Drag and drop for Vue 3: sortable lists, kanban boards, trees, multi-drag, animations and accessibility out of the box.","inLanguage":"en-US","name":"Vue DnD Kit","url":"https://zizigy.github.io/vue-dnd-kit","workTranslation":[{"@id":"https://zizigy.github.io/vue-dnd-kit/ru#website"},{"@id":"https://zizigy.github.io/vue-dnd-kit/zh#website"},{"@id":"https://zizigy.github.io/vue-dnd-kit/ja#website"},{"@id":"https://zizigy.github.io/vue-dnd-kit/ko#website"},{"@id":"https://zizigy.github.io/vue-dnd-kit/es#website"},{"@id":"https://zizigy.github.io/vue-dnd-kit/pt#website"},{"@id":"https://zizigy.github.io/vue-dnd-kit/de#website"},{"@id":"https://zizigy.github.io/vue-dnd-kit/fr#website"}]},{"@id":"https://zizigy.github.io/vue-dnd-kit#webpage","@type":"WebPage","description":"Sortable lists, kanban boards, trees and multi-drag for Vue 3 — animated, keyboard-ready and accessible out of the box.","url":"https://zizigy.github.io/vue-dnd-kit","isPartOf":{"@id":"https://zizigy.github.io/vue-dnd-kit#website"},"potentialAction":[{"@type":"ReadAction","target":["https://zizigy.github.io/vue-dnd-kit"]}]}]}
```

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
