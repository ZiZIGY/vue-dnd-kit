---
title: "3.0.0-beta.2 · Vue DnD Kit"
description: "Files and other apps, drop targets that shape the overlay, drags that don't wait for landings, an overlay that lifts and settles, and filtered lists."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/changelog/v3-0-0-beta-2"
meta:
  "og:description": "Files and other apps, drop targets that shape the overlay, drags that don't wait for landings, an overlay that lifts and settles, and filtered lists."
  "og:title": "3.0.0-beta.2 · Vue DnD Kit"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

ドキュメント/Changelog

# 3.0.0-beta.2

Files and other apps, drop targets that shape the overlay, drags that don't wait for landings, an overlay that lifts and settles, and filtered lists.

[このページを編集](https://github.com/ZiZIGY/vue-dnd-kit/edit/v3/docs/content/en/5.changelog/998.v3-0-0-beta-2.md)

```
npm i @vue-dnd-kit/core@next
```

## Files and other apps

The browser's own drag and drop now runs through the provider, as drags like any other. A drop target, a list or a tree with `**external**` takes files, links and text from other apps: a list makes room for them while they are held, and `**createItem**` turns them into items, several at once. A `**native**` item is dragged out of the page by the mouse: into another app, or into a second window of yours, where the lists of its group take it.

Live Drop images, links or text from other apps; drag a card out, or into this page in a second window X ---- · Y ----

デモを読み込み中…

```
<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Board from './Board.vue';
</script>

<template>
  <DnDProvider>
    <Board />
  </DnDProvider>
</template>
```

Board.vue

```
makeSortableList(grid, {
  items: cards,
  group: 'moodboard',
  external: { files: 'image/*', links: true, text: true },
  // Asked while the drag is held (a tile that says what is coming), then at the drop.
  createItem: fromOutside,
});
```

Tile.vue

```
makeSortableItem(el, {
  item: () => props.card,
  // What other apps get: a link, a file to save, a text.
  native: { data: () => toOutside(props.card) },
});
```

Plain drop zones take files too: `**makeDroppable(el, { external: { files: 'application/pdf' } })**`. The end event says what the other app did with a drag out (`**droppedOutside**`). See [**files and other apps**](https://zizigy.github.io/vue-dnd-kit/ja/docs/guides/native).

## Drop targets shape the overlay

A drop target can change what the drag looks like over it: `**overOverlay**` and `**overDropAnimation**` on `**makeDroppable**`, lists and trees. Its component gets the drag's own overlay as its default slot, to wrap it or leave it out. Overlay components also get `**to**`: where a drop would put the items now.

Live Tick two messages, drag one over Archive and let go X ---- · Y ----

デモを読み込み中…

```
<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Mailbox from './Mailbox.vue';
</script>

<template>
  <!-- The mailbox reads the selection with `useDnD()`: it renders inside the provider. -->
  <DnDProvider>
    <Mailbox />
  </DnDProvider>
</template>
```

Folder.vue

```
makeDroppable(el, {
  id: props.folder.id,
  overOverlay: MovePill, // "Move 2 to Archive" while over it
  overDropAnimation: intoFolder,
});
```

See [**targets that change the overlay**](https://zizigy.github.io/vue-dnd-kit/ja/docs/guides/overlay#targets-that-change-the-overlay) and [**where the drop would go**](https://zizigy.github.io/vue-dnd-kit/ja/docs/guides/overlay#where-the-drop-would-go-to).

## Drags don't wait for landings

A decided drop hands its overlay to a flight of its own, and the next drag starts at once. A press on a landing box catches it mid-flight, and the drag goes on from there. `**onDragSettle**` tells when an overlay is home: the trash below shuts its lid then.

Live Drag a photo into the trash; Undo brings it back X ---- · Y ----

デモを読み込み中…

```
<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Gallery from './Gallery.vue';
</script>

<template>
  <DnDProvider>
    <Gallery />
  </DnDProvider>
</template>
```

- In a multi-drag every clone flies: back home on a cancel, to its slot on a drop, into the zone one after another. `**overlayPreviews**` sets how many items get a clone (5 by default, or `**'all'**`).
- The drop waits for the CSS animations and transitions running in the overlay as it lands: the photo above crumples on its own.
- Each draggable, item and list may bring its own `**dropAnimation**`; the target's `**overDropAnimation**` wins.

## An overlay that lifts and settles

The overlay box now holds a content element, `**[data-dnd-overlay-content]**`: the library moves and sizes the box, you animate the content. The provider's `**overlay-class**` puts your classes on it, and a transition from `**@starting-style**` lifts it as the drag picks up.

Live Pick a candidate up, drag it to Hired, let go X ---- · Y ----

デモを読み込み中…

```
<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import Lane from './Lane.vue';

const lanes = ref([
  {
    id: 'applied',
    title: 'Applied',
    people: [
      { id: 'ava', name: 'Ava Stone', role: 'Designer', hue: 20 },
      { id: 'ben', name: 'Ben Ito', role: 'Engineer', hue: 200 },
      { id: 'cleo', name: 'Cleo Diaz', role: 'Writer', hue: 300 },
    ],
  },
  { id: 'interview', title: 'Interview', people: [{ id: 'dan', name: 'Dan Ruiz', role: 'Engineer', hue: 140 }] },
  { id: 'hired', title: 'Hired', people: [] },
]);
</script>

<template>
  <!-- `overlay-class`: the overlay's content, the whole of what follows the pointer, lifts as one. -->
  <DnDProvider overlay-class="pipeline-hand">
    <div class="pipeline">
      <Lane v-for="lane in lanes" :key="lane.id" :lane="lane" />
    </div>
  </DnDProvider>
</template>

<style scoped>
.pipeline {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
</style>

<!-- Not scoped: the overlay's content element is the library's, rendered outside this component. -->
<style>
@media (prefers-reduced-motion: no-preference) {
  /* Picked up, the whole overlay lifts and tilts; let go, it lies flat again as it lands. */
  .pipeline-hand {
    transition:
      rotate 0.25s cubic-bezier(0.2, 0.8, 0.2, 1),
      scale 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  [data-dnd-overlay='dragging'] > .pipeline-hand {
    rotate: 3deg;
    scale: 1.05;
  }

  /* Where the lift starts: the box appears already `dragging`, a transition needs a before. */
  @starting-style {
    [data-dnd-overlay='dragging'] > .pipeline-hand {
      rotate: 0deg;
      scale: 1;
    }
  }
}
</style>
```

```
[data-dnd-overlay='dragging'] > .pipeline-hand {
  rotate: 3deg;
  scale: 1.05;
}

@starting-style {
  [data-dnd-overlay='dragging'] > .pipeline-hand {
    rotate: 0deg;
    scale: 1;
  }
}
```

When the box turns `**dropping**`, the transition runs back and the drop waits for it. A change of overlay component crossfades (`**overlayTransition**`). See [**the overlay: lift, tilt, settle**](https://zizigy.github.io/vue-dnd-kit/ja/docs/guides/animations#the-overlay-lift-tilt-settle).

## Filtered lists

`**filter**` shows some of a list's items, and a drag sorts among those. The drop writes the whole array, with the hidden items in their places.

Live Pick a tag or search, then drag a task: the array keeps the hidden ones in place X ---- · Y ----

デモを読み込み中…

```
<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import Backlog from './Backlog.vue';
import type { Task } from './TaskRow.vue';

// In priority order: the array is the backlog.
const tasks = ref<Task[]>([
  { id: 1, title: 'Login fails on Safari', tag: 'bug' },
  { id: 2, title: 'Dark mode for settings', tag: 'feature' },
  { id: 3, title: 'Document the export API', tag: 'docs' },
  { id: 4, title: 'Crash when the list is empty', tag: 'bug' },
  { id: 5, title: 'Keyboard shortcuts', tag: 'feature' },
  { id: 6, title: 'Typo in the pricing page', tag: 'docs' },
  { id: 7, title: 'Slow search with 10k rows', tag: 'bug' },
  { id: 8, title: 'Share a board by link', tag: 'feature' },
]);
</script>

<template>
  <DnDProvider>
    <Backlog v-model="tasks" />
  </DnDProvider>
</template>
```

Backlog.vue

```
const { items } = makeSortableList(list, {
  items: tasks,
  filter: (task) => (!tag.value || task.tag === tag.value) && task.title.includes(query.value),
});
```

## And also

- ****Lists resize smoothly.**** A list or a tree grows and shrinks to its new size as items come in and leave, at the drop and for `**animateChanges**` changes ( `**animateSize**`, on by default).
- **`**label**`** on items, lists, trees and drop targets: what screen readers call them ("Sunset.svg dropped at position 2 of 5 in Moodboard.").
- ****Several lists in one component****: items find their list by the DOM.
- **`**snapToGrid**`** snaps one axis when only its size is given.
- ****The cursor**** of the grabbed element stays during the drag ( `**--dnd-cursor**`).
- **`**data-dnd-placeholder="into"**`** while a drop goes into a target inside an item: style the folder the files go into.
- ****Scrolling during a drag****: axis locks keep the drag on its row ( `**containerShift**` for modifiers), and an overlay landing while the page scrolls still finds its slot.
- ****Partial accepts on drop targets****: when `**onBeforeDrop**` takes only some of the dragged items, the target's `**onDrop**` says which ( `**accepted**`, and the new `**rejected**`).
- ****Lists and trees**** take `**activation**`, their items' default, and `**data**`, what `**over.data**` says over them; `**group.put**` takes types, as a drop target's `**accept**` does.
- **`**drag-resume**`** on the provider, for `**onBeforeDrop**` answering `**'continue'**`.
- ****Development warnings**** for two draggables or targets sharing an id, for a drag asked for while `**onBeforeDrop**` decides, and for `**external**` without `**createItem**`. Production builds drop them.
- ****Less work**** at pickup, per frame and on tree drops.

New examples: whole apps, the way you would build them, each in a full-screen demo.

[Project board](https://zizigy.github.io/vue-dnd-kit/ja/docs/examples/board)

**Project board**

Columns you reorder, WIP limits, a confirmation before Done, multi-select and a trash.

[Chess](https://zizigy.github.io/vue-dnd-kit/ja/docs/examples/chess)

**Chess**

Legal moves light up, a pawn asks what it becomes, and a bot plays back with real drags.

[Block editor](https://zizigy.github.io/vue-dnd-kit/ja/docs/examples/block-editor)

**Block editor**

Notion-like blocks moved by their handles, nested, and dragged in from a "/" menu.

[Data table](https://zizigy.github.io/vue-dnd-kit/ja/docs/examples/data-table)

**Data table**

A Nuxt UI table of 2,000 tasks: virtualized, searchable, sorted by its rows' grips.

[All examples](https://zizigy.github.io/vue-dnd-kit/ja/docs/examples)

**All examples**

A calendar, a file manager, a form builder, a design canvas, a page builder.

## Upgrading from beta.1

- ****Renamed options:****
  - `**animate**` → `**animateChanges**` on lists, trees and the provider ( `**<DnDProvider animate-changes>**`);
  - `**keyboard**` → `**keyboardMode**` on `**makeDraggable**` (the provider's `**keyboard**` stays).
- **`**makeSelectionArea**`** has no **`**selection**`** option:**** the band always selects into the provider's selection ( `**useDnD().selection**`).
- ****The overlay box has a content element.**** What the overlay shows sits in `**[data-dnd-overlay] > [data-dnd-overlay-content]**`, and the default clone in a box inside it (the box carries the item's inherited custom properties). A child selector such as `**[data-dnd-overlay] > .card**` no longer matches: write `**[data-dnd-overlay] .card**`. Descendant selectors and `**[data-dnd-overlay='dragging']**` work as before.
- ****A new drag starts while the last one lands.**** `**active**` reads `**null**` as soon as a drop is decided, as before, but the overlay may still be flying when the next drag begins. Code that ran when `**status**` went back to `**'idle'**` after a drop: use `**onDragSettle**`.
- ****The drop waits for the overlay's own animations****, two seconds at most. An overlay component with a long CSS transition on `**status: 'dropping'**` now delays the end of the drop until it finishes.
- ****Lists animate their size**** ( `**animateSize**`). A list whose container has a fixed size isn't affected; to keep the old jump, pass `**animateSize: false**`.
- ****A press on a handle that doesn't move is a click****: a button used as a handle gets its `**click**`.
- ****Overlay components get only the props they declare****: the overlay's props no longer fall through to their root element as attributes.
- **`**defaultStyles: false**`** removes only the looks**** (the dimmed placeholders). What drags rely on stays: no text selection and no scroll anchoring while dragging, the drag cursor, no link callout on a long press on iOS.
- ****A drop target's **`**onDrop**`** gets the end event**** ( `**DnDEndEvent**`): the same fields, plus `**dropped**`, `**accepted**` and `**rejected**`. A partial accept used to show only in `**onDragEnd**`.

## All changes

### Features

- Native drag and drop: `**external**` on drop targets, lists and trees; `**native**` on draggables and items; drags between windows of the app by group; `**droppedOutside**` on the end event. `**createItem**` may return several items and is asked again at the drop.
- `**label**` on items, lists, trees and drop targets, for the announcements.
- `**filter**` on sortable lists.
- Several lists and trees in one component.
- `**snapToGrid**` snaps one axis when only its size is given.
- The drag keeps the grabbed element's cursor ( `**--dnd-cursor**`).
- `**data-dnd-placeholder="into"**` while the drop goes into a target in an item.
- The overlay content element and the provider's `**overlayClass**`; `**animateSize**`.
- Drop targets shape the overlay: `**overOverlay**` and `**overDropAnimation**` on `**makeDroppable**`, lists and trees; `**dropAnimation**` on draggables, items and lists; `**over**` in the drop animation's context.
- Renamed: `**animate**` → `**animateChanges**`, the draggable's `**keyboard**` → `**keyboardMode**`. `**makeSelectionArea**` lost its `**selection**` option.
- The provider's `**overlayTransition**` animates a change of overlay component.
- Overlay components get `**to**`, where a drop would put the items.
- Drags don't wait for landings; a press catches a landing box; `**onDragSettle**` (provider: `**drag-settle**`); `**overlayPreviews**`.
- Multi-drag: plain draggables show a pile; every clone flies home on a cancel; into a zone the clones go in one after another.
- Development warnings for shared ids and for input while a drop is decided.
- A drop target's `**onDrop**` gets `**accepted**` and `**rejected**` (also on `**DnDEndEvent**`).
- `**activation**` and `**data**` on lists and trees; `**group.put**` takes types.
- The provider emits `**drag-resume**`.
- The behaviour styles are always injected; `**defaultStyles: false**` drops only the looks.

### Fixes

- The keyboard sends the slot home over plain targets, crosses lists stacked along their axis, and keeps the overlay on the line past the end of an indicator list.
- A handle press without movement is a click; the selection area captures the pointer only once it moves.
- The clone carries the item's custom properties on a box around it, not inline.
- Indicator lines when nesting in place; insert mode over indicator trees; lists with `**createItem**` ignore the items of other groups.
- `**e.source.remove()**` takes the items only out of the lists they came from.
- Landing overlays no longer jump when drags follow each other quickly, with the default drop animation, GSAP or motion, nor for a frame when the next drag reorders their list.
- A `**native**` mouse drag asks `**canDrag**`; the selection area's cancel key matches `**key**` as well as `**code**`.
- A pointer past the edge of a scrolled list points at the item at that edge: while auto-scroll brings items past it, the slot goes along, and a drop out there lands where the slot is. It used to stay where the pointer last was over an item (virtual lists).
- Auto-scroll measures the way toward an edge from where the drag started: a pointer that is at the edge by its first frame (a busy machine, coalesced input) scrolls too.
- Multi-drag items without a clone show as the drop starts and fade in; a `**'group'**` block over a plain target outside the lists comes apart; a drop lands with the overlay its target showed when let go.
- On a cancel, the other dragged items stay placeholders until their clones are home.
- Keyboard pickups during a landing; an end announced as `**''**` silences the pending move text; a provider unmounting while `**onBeforeDrop**` decides cancels the drag.
- A dropped overlay lands on its slot when the page scrolls mid-flight; axis locks keep the drag on its row when the page scrolls; an element dragged without an overlay stays under the pointer when the page scrolls.

### Performance

- A drag starting or ending updates the attributes of the dragged items only.
- A drop target inside a sortable item asks its list once per detection, not once per target.
- A tree drop finds the moved nodes and their new parent in one walk.
- The clones of a `**'stack'**` multi-drag are taken in one style snapshot.

The commits: [**core-v3.0.0-beta.1...core-v3.0.0-beta.2**](https://github.com/ZiZIGY/vue-dnd-kit/compare/core-v3.0.0-beta.1...core-v3.0.0-beta.2).

```json
{"@context":"https://schema.org","@graph":[{"@id":"https://zizigy.github.io/vue-dnd-kit/ja#website","@type":"WebSite","description":"Drag and drop for Vue 3: sortable lists, kanban boards, trees, multi-drag, animations and accessibility out of the box.","inLanguage":"ja-JP","name":"Vue DnD Kit","url":"https://zizigy.github.io/vue-dnd-kit/ja","translationOfWork":{"@id":"https://zizigy.github.io/vue-dnd-kit#website"}},{"@id":"https://zizigy.github.io/vue-dnd-kit/ja/docs/changelog/v3-0-0-beta-2#webpage","@type":"WebPage","description":"Files and other apps, drop targets that shape the overlay, drags that don't wait for landings, an overlay that lifts and settles, and filtered lists.","name":"3.0.0-beta.2","url":"https://zizigy.github.io/vue-dnd-kit/ja/docs/changelog/v3-0-0-beta-2","isPartOf":{"@id":"https://zizigy.github.io/vue-dnd-kit/ja#website"},"potentialAction":[{"@type":"ReadAction","target":["https://zizigy.github.io/vue-dnd-kit/ja/docs/changelog/v3-0-0-beta-2"]}]}]}
```

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
