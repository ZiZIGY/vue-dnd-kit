<div align="center">

<img src="https://raw.githubusercontent.com/ZiZiGY/vue-dnd-kit/v2/public/logo.svg" width="320" alt="Vue DnD Kit" />

<br />
<br />

**Headless drag-and-drop for Vue 3.**
<br />
No imposed markup. No hard-coded styles. Just logic.

<br />

[![npm](https://img.shields.io/npm/v/@vue-dnd-kit/core?color=41b883&label=%40vue-dnd-kit%2Fcore)](https://www.npmjs.com/package/@vue-dnd-kit/core)
[![npm downloads](https://img.shields.io/npm/dm/@vue-dnd-kit/core?color=41b883)](https://www.npmjs.com/package/@vue-dnd-kit/core)
[![license](https://img.shields.io/github/license/zizigy/vue-dnd-kit?color=41b883)](./LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-41b883?logo=vue.js&logoColor=white)](https://vuejs.org)

<br />

[**Documentation**](https://zizigy.github.io/vue-dnd-kit/v2/guide/introduction) &nbsp;·&nbsp; [**Examples**](https://zizigy.github.io/vue-dnd-kit/v2/examples/sorting-lists) &nbsp;·&nbsp; [**Changelog**](./packages/core/CHANGELOG.md)

</div>

---

## Features

- **Composable API** — `makeDraggable` and `makeDroppable` attach to any element via a template ref. No wrapper components, no render props.
- **Smart helpers** — `suggestSort`, `suggestSwap`, `suggestCopy`, `suggestRemove` handle positioning and array manipulation, so you never have to write `splice` logic by hand.
- **Multi-drag** — `makeSelectionArea` lets users select multiple items and drag them together. All helpers handle multi-drag natively.
- **Nested zones** — trees, Kanban boards, and nested droppables work out of the box. The library automatically resolves the correct target array based on cursor position.
- **Full preview control** — `DragPreview` exposes a default slot. Wrap it in `<Transition>`, `AnimatePresence` from motion-v, GSAP, or anything else. Per-item custom previews via `render` option.
- **Keyboard navigation** — built-in with configurable keys and step size.
- **Async drop** — return a `Promise` from `onDrop` to pause the operation while waiting for user confirmation. Preview stays visible until resolved.
- **Auto-scroll** — viewport and individual scrollable containers, with configurable threshold and speed.
- **Constraints** — restrict movement to an axis or keep the preview inside a container boundary.
- **Zero dependencies** — Vue 3 as the only peer dependency.
- **Tree-shakeable** — import only what you use.
- **Full TypeScript** — everything is typed.

---

## Install

```bash
npm install @vue-dnd-kit/core
# or
yarn add @vue-dnd-kit/core
# or
pnpm add @vue-dnd-kit/core
```

**Peer dependency:** Vue `^3.5`

---

## Quick start

```vue
<!-- App.vue -->
<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { DnDProvider, makeDroppable } from '@vue-dnd-kit/core';
  import SortableItem from './SortableItem.vue';

  const items = ref(['One', 'Two', 'Three', 'Four']);
  const zoneRef = useTemplateRef<HTMLElement>('zone');

  makeDroppable(zoneRef, {
    events: {
      onDrop(e) {
        const r = e.helpers.suggestSort('vertical');
        if (r) items.value = r.targetItems as string[];
      },
    },
  }, () => items.value);
</script>

<template>
  <DnDProvider>
    <div ref="zone" class="list">
      <SortableItem
        v-for="(item, i) in items"
        :key="item"
        :index="i"
        :items="items"
      >
        {{ item }}
      </SortableItem>
    </div>
  </DnDProvider>
</template>
```

```vue
<!-- SortableItem.vue -->
<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const props = defineProps<{ index: number; items: string[] }>();
  const el = useTemplateRef<HTMLElement>('el');
  const { isDragging } = makeDraggable(el, {}, () => [props.index, props.items]);
</script>

<template>
  <div ref="el" :style="{ opacity: isDragging ? 0 : 1 }">
    <slot />
  </div>
</template>
```

---

## Packages

| Package | Description |
|---------|-------------|
| [`@vue-dnd-kit/core`](./packages/core) | Core library — composables, `DnDProvider`, `DragPreview` |
| [`@vue-dnd-kit/utilities`](./packages/utilities) | Extra utility helpers |

---

## Documentation

Full docs with live examples:
**[zizigy.github.io/vue-dnd-kit](https://zizigy.github.io/vue-dnd-kit/v2/guide/introduction)**

Covers: sorting, swap, copy, multi-drag, trees, Kanban, custom preview, animations, keyboard navigation, async drop, constraints, auto-scroll and more.

---

## Contributing

Issues and pull requests are welcome.
For larger changes, please open an issue first to discuss the approach.

---

## License

[MIT](./LICENSE) © 2025 [ZiZIGY](https://github.com/ZiZiGY)
