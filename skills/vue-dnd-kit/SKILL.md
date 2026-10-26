---
name: vue-dnd-kit
description: Vue DnD Kit v3 (@vue-dnd-kit/core), drag and drop for Vue 3 — sortable lists, kanban boards, trees, multi-drag, drop zones, animated overlays, virtual lists, keyboard and screen reader support. Use when building or debugging drag and drop in a Vue/Nuxt app with DnDProvider, makeDraggable, makeDroppable, makeSortableList, makeSortableItem, makeSortableTree, makeSelectionArea, useDnD, useDnDActions or the devtools plugin.
metadata:
  author: ZiZIGY
  version: "3.0.0"
  source: https://github.com/ZiZIGY/vue-dnd-kit
---

# Vue DnD Kit

Drag and drop for Vue 3.5+, built from a provider and composables. The library renders
nothing of its own except a floating overlay (a clone of the dragged element by
default). You render your own elements and pass their template refs to the composables.

> This skill describes `@vue-dnd-kit/core` 3.x. v2 had a different API (`useDnDProvider`,
> `makeConstraintArea`, `groups`), so don't mix the two.

```bash
npm i @vue-dnd-kit/core            # required (peer: vue ^3.5)
npm i @vue-dnd-kit/actions         # optional: "move up / move to Done" buttons, scripted drags
npm i -D @vue-dnd-kit/devtools     # optional: a DevTools tab (Vue DevTools / Nuxt DevTools); needs @vue-dnd-kit/actions
```

## Mental model

- **`<DnDProvider>`** owns one drag at a time, the overlay, the selection, sensors, auto-scroll and the live region. Every composable must run in a component **rendered inside** a provider. Calling one in the same component whose template contains the provider throws `No <DnDProvider> found above this component`.
- **Composables take a template ref and options**: `makeX(elementRef, options)`. Options are reactive: a value, a ref or a getter (`() => props.item.id`).
- **Sortable lists are data-driven.** `makeSortableList` returns a draft `items` that reorders live while dragging. Render the draft, not your array. On drop the library writes the new array into your ref, or hands it to you (`event.result`) when the source is read-only.
- **Every list or tree gets its own component.** A list provides a context that its items inject, so two lists created in one component would share it.
- **Keys come from the data.** Items are keyed by `getKey(item)` (default `item.id`), never by index or automatic ids.

## Quick start: a sortable list

```vue
<!-- App.vue -->
<template>
  <DnDProvider>
    <TaskList />
  </DnDProvider>
</template>
<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import TaskList from './TaskList.vue';
</script>
```

```vue
<!-- TaskList.vue -->
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskRow from './TaskRow.vue';

const tasks = ref([{ id: 1, title: 'Write docs' }, { id: 2, title: 'Ship v3' }]);
const listRef = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(listRef, { items: tasks });
</script>

<template>
  <ul ref="list">
    <TaskRow v-for="task in items" :key="task.id" :task="task" />
  </ul>
</template>
```

```vue
<!-- TaskRow.vue -->
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ task: { id: number; title: string } }>();
const el = useTemplateRef<HTMLElement>('el');
const { isPlaceholder } = makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <li ref="el" :class="{ placeholder: isPlaceholder }">{{ task.title }}</li>
</template>
```

That is a complete, accessible list: drag with the mouse or touch (200 ms long press),
or Tab to a row, Space to pick it up, arrows to move it, Space to drop and Escape to
cancel. You also get FLIP animations, a drop animation, auto-scroll and screen reader
announcements.

A list component that takes its array through `v-model`:
`const tasks = defineModel<Task[]>({ required: true })` and then `makeSortableList(listRef, { items: tasks })`.

## Nuxt

```bash
npm i @vue-dnd-kit/nuxt @vue-dnd-kit/core
```

```ts
export default defineNuxtConfig({ modules: ['@vue-dnd-kit/nuxt'] });
```

The module registers `<DnDProvider>` and `<DragPreview>` globally and auto-imports the
composables (`make*`, `useDnD`, `useDnDMonitor`) and the main types. Modifiers,
collision helpers and sensors are opt-in, because their names are generic:
`vueDndKit: { autoImports: { modifiers: true, collision: true, sensors: true }, prefix: '' }`.
Rendering is SSR-safe: lists render on the server, and the overlay and live region
mount on the client.

## What to use for X

| Task | Use | Reference |
| --- | --- | --- |
| Reorder a list or grid; kanban columns that exchange cards | `makeSortableList` + `makeSortableItem`, `group` | [sortable](references/sortable.md) |
| Palette that copies into a list, trash zone, drop outside to remove | `group: { pull: 'clone' }`, `clone`, `e.source.remove()`, `dropOutside` | [sortable](references/sortable.md) |
| Swap two items instead of shifting | `behavior: 'swap'` | [sortable](references/sortable.md) |
| Insertion line instead of moving items | `placeholder: 'indicator'` + `indicator` | [sortable](references/sortable.md) |
| Store, server or immutable state (controlled) | read-only `items` + `e.preventDefault()` + `e.result` | [sortable](references/sortable.md) |
| File tree / nested outline | `makeSortableTree` (flat rendering by depth) | [tree](references/tree.md) |
| Free drag, drop zones, drop into a folder item | `makeDraggable` + `makeDroppable` | [draggable-droppable](references/draggable-droppable.md) |
| Lock drags to one axis; snap, restrict to a container | `axis: 'x' \| 'y'`, `modifiers` | [draggable-droppable](references/draggable-droppable.md#modifiers) |
| Provider options, global events, `useDnD`, monitors | `DnDProvider`, `useDnD`, `useDnDMonitor` | [provider](references/provider.md) |
| Drag several items; rubber-band selection | `selected`, `multiple`, `makeSelectionArea` | [multi-drag](references/multi-drag.md) |
| Custom drag preview, preview size | `overlay`, `#overlay` slot, `DragPreview`, `overlayFit` | [overlay](references/overlay.md) |
| Tune or replace animations (GSAP, motion) | `animation`, `dropAnimation`, `animate` | [animations](references/animations.md) |
| 10k+ rows (TanStack Virtual, VueUse) | `activeIndex`, `captureLayout`, keys by id | [virtualization](references/virtualization.md) |
| Keyboard, screen readers, "Move up" buttons | `announcements`, `keyboard`, `useDnDActions` | [accessibility](references/accessibility.md) |
| Custom input (gamepad, joystick), scripted drags | `defineSensor`, `useSensor`, `@vue-dnd-kit/actions` | [sensors-actions](references/sensors-actions.md) |
| Styling drag states, CSS hooks | `data-dnd-*` attributes, returned refs | [styling](references/styling.md) |
| Inspect drags in Vue DevTools | `@vue-dnd-kit/devtools` | [devtools](references/devtools.md) |
| Something behaves oddly | — | [pitfalls](references/pitfalls.md) |

## API at a glance

```ts
import {
  DnDProvider, DragPreview,                                      // components
  makeDraggable, makeDroppable,                                  // free drag, drop zones
  makeSortableList, makeSortableItem, makeSortableTree,          // sortable
  makeSelectionArea,                                             // rubber band
  useDnD, useDnDMonitor, useDnDContext, provideDnDContext,       // state, events, sharing
  defineSensor, useSensor, pointerSensor, keyboardSensor,        // input
  pointerFirst, pointerWithin, rectIntersection, closestCenter, closestCorners,  // collisions
  restrictToVerticalAxis, restrictToHorizontalAxis, restrictToWindowEdges,
  restrictToParent, restrictToElement, restrictToFirstScrollableAncestor,
  snapToGrid, snapCenterToCursor,                                // modifiers
} from '@vue-dnd-kit/core';
```

## Key rules

1. **Render the returned `items`** (the draft), keyed by item key: `v-for="t in items" :key="t.id"`.
2. **Pass ids as getters** in child components: `makeSortableItem(el, { id: () => props.task.id })` or `{ item: () => props.task }`.
3. **The source decides who writes.** A writable ref (`ref`, `defineModel()`, `toRef(props.column, 'tasks')`) is written by the library on drop. A getter, computed or readonly ref is not written: call `e.preventDefault()` in `onDrop` (or `onBeforeDrop`) and apply `e.result`.
4. **`onDrop` runs before the write**, synchronously: `items` still holds the old order and `e.result` the new one. Use the provider's `@drag-end` or `useDnDMonitor({ onDragEnd })` for after the write.
5. **Copying needs `clone`; accepting plain draggables needs `createItem`.** Without them, copies and inserts are refused.
6. **Lists exchange items only within the same `group` name.** By default each list is a group of its own.
7. **Hold component options in `shallowRef`** (or pass the component directly): `overlay: shallowRef(MyOverlay)`. Never put a component in a deep `ref`.
8. **Overlay components fill a box** that resizes to the target slot. Give the root `width: 100%; height: 100%`.
9. **Use `shallowRef` for big arrays** (thousands of rows). The library never deep-traverses your data.
10. **Let the library animate sortable items.** Don't wrap them in `<TransitionGroup>`, because the library already animates moves (FLIP on `translate`). For data changes that no drag made, turn on the list's `animate` option.
