<div align="center">

<img src="./public/logo.png" width="148" alt="" />

<h1>Vue DnD Kit</h1>

**Drag and drop for Vue 3.**
<br />
Sortable lists, kanban boards, trees, multi-drag and drop zones — animated, keyboard-ready
and accessible out of the box, in your own markup.

<br />

[![npm](https://img.shields.io/npm/v/@vue-dnd-kit/core?color=42b883&label=%40vue-dnd-kit%2Fcore)](https://www.npmjs.com/package/@vue-dnd-kit/core)
[![npm downloads](https://img.shields.io/npm/dm/@vue-dnd-kit/core?color=42b883)](https://www.npmjs.com/package/@vue-dnd-kit/core)
[![license](https://img.shields.io/github/license/zizigy/vue-dnd-kit?color=42b883)](./LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.5+-42b883?logo=vue.js&logoColor=white)](https://vuejs.org)

<br />

[**Documentation**](https://zizigy.github.io/vue-dnd-kit/docs/getting-started/introduction) &nbsp;·&nbsp; [**Examples**](https://zizigy.github.io/vue-dnd-kit/docs/examples) &nbsp;·&nbsp; [**API**](https://zizigy.github.io/vue-dnd-kit/docs/api/dnd-provider) &nbsp;·&nbsp; [**Releases**](https://github.com/ZiZIGY/vue-dnd-kit/releases)

</div>

---

## Features

- **Sortable lists and grids** that reorder live while you drag — vertical, horizontal or in a grid.
- **Lists that share items** — kanban boards, palettes that hand out copies, swaps, rules for what goes where.
- **Trees** with nesting by a sideways drag or by hovering a row, depth limits and rules.
- **Multi-drag** with your own selection (Ctrl/Cmd-click, a rubber band): the block travels together.
- **Drop zones** with accept rules, and drops you confirm, refuse or apply yourself.
- **Animated by default** — items slide to their new places, the drop lands on its slot, a cancel flies back. Tune it, turn it off, or hand it to GSAP or motion.
- **Accessible** — every drag works with <kbd>Space</kbd> and the arrows, moves are announced to screen readers, focus comes back where it was.
- **Virtual lists** with TanStack Virtual or VueUse: thousands of rows.
- **Your data stays yours until the drop** — you render a draft; on drop the library writes the new order into your ref, or hands you the result to apply yourself (stores, servers, undo).
- **No wrapper components** — rows are your own elements, so the components of any UI kit (Nuxt UI, Vuetify, your own) drag as they are.
- **Pluggable input** — pointer, touch and keyboard sensors, your own for anything else, and drags scripted from code.
- **DevTools** — a tab in Vue DevTools and Nuxt DevTools with a live map of every list, a joystick and a log of each drag.
- **TypeScript** throughout, SSR- and Nuxt-ready.

---

## Install

```bash
npm i @vue-dnd-kit/core
# or
yarn add @vue-dnd-kit/core
# or
pnpm add @vue-dnd-kit/core
```

With Nuxt, add the module: it registers the provider and auto-imports the composables.

```bash
npx nuxi module add @vue-dnd-kit/nuxt
```

**Requirements:** Vue 3.5+. Chrome and Edge 104+, Safari 15.4+, Firefox 104+.

---

## Quick start

A sortable list in three files: a provider, a list and its rows.

```vue
<!-- App.vue: the provider goes around the components that drag -->
<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import TaskList from './TaskList.vue';
</script>

<template>
  <DnDProvider>
    <TaskList />
  </DnDProvider>
</template>
```

```vue
<!-- TaskList.vue -->
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskRow from './TaskRow.vue';

const tasks = ref([
  { id: 1, title: 'Sketch the board' },
  { id: 2, title: 'Write the docs' },
  { id: 3, title: 'Ship v3' },
]);

const listRef = useTemplateRef<HTMLElement>('list');
// `items` is the draft: it reorders while you drag. On drop, `tasks` gets the new order.
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
makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <li ref="el">{{ task.title }}</li>
</template>
```

Drag a row — or Tab to it, press <kbd>Space</kbd>, move it with the arrows and press <kbd>Space</kbd> again.

---

## Packages

| Package | What it is |
| --- | --- |
| [`@vue-dnd-kit/core`](https://www.npmjs.com/package/@vue-dnd-kit/core) | The library: `DnDProvider`, sortable lists and trees, draggables, drop zones, drag areas, selection. |
| [`@vue-dnd-kit/nuxt`](https://www.npmjs.com/package/@vue-dnd-kit/nuxt) | Nuxt module: registers the provider and auto-imports the composables and types. |
| [`@vue-dnd-kit/actions`](https://www.npmjs.com/package/@vue-dnd-kit/actions) | Programmatic drags: "move up" buttons, menus, tours and tests, with the normal animations. |
| [`@vue-dnd-kit/devtools`](https://www.npmjs.com/package/@vue-dnd-kit/devtools) | A Vue DnD Kit tab in Vue DevTools and Nuxt DevTools. |

---

## For AI assistants

The repository ships an agent skill: assistants such as Claude Code learn the model of the
library, its rules and its pitfalls.

```bash
npx skills add ZiZIGY/vue-dnd-kit
```

---

## Contributing

Issues and pull requests are welcome.
For larger changes, please open an issue first to discuss the approach.

---

## 💛 Support

If vue-dnd-kit saves you time, consider supporting the project — it helps keep development going.

[![Telegram](https://img.shields.io/badge/Telegram_Wallet-ZiZIGY-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/ZiZIGY)
**WebMoney:** `836516027542`

---

## License

[MIT](./LICENSE) © 2026 [ZiZIGY](https://github.com/ZiZiGY)
