<p align="center">
  <a href="https://zizigy.github.io/vue-dnd-kit/">
    <img src="https://raw.githubusercontent.com/ZiZIGY/vue-dnd-kit/master/public/logo.png" width="148" alt="Vue DnD Kit">
  </a>
</p>

<h1 align="center">@vue-dnd-kit/core</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/@vue-dnd-kit/core"><img src="https://img.shields.io/npm/v/@vue-dnd-kit/core.svg" alt="npm version"></a>
  <a href="https://github.com/ZiZIGY/vue-dnd-kit/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/@vue-dnd-kit/core.svg" alt="License"></a>
</p>

Drag and drop for Vue 3: sortable lists, kanban boards, trees, multi-drag, files from other
apps and drop zones — animated, keyboard-ready and announced to screen readers out of the box,
in your own markup.

**[Documentation and live examples →](https://zizigy.github.io/vue-dnd-kit/)**

## Install

```bash
npm i @vue-dnd-kit/core
```

Vue 3.5 or newer. Coming from v2: see [migrating from v2](https://zizigy.github.io/vue-dnd-kit/docs/getting-started/migrating-from-v2).

## A sortable list

```vue
<!-- App.vue -->
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
  { id: 1, title: 'Write the docs' },
  { id: 2, title: 'Ship v3' },
]);
// `items` is the draft: it reorders while you drag; the drop writes the new order to `tasks`.
const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), { items: tasks });
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
makeSortableItem(useTemplateRef<HTMLElement>('row'), { item: () => props.task });
</script>

<template>
  <li ref="row">{{ task.title }}</li>
</template>
```

## What it does

- **Sortable lists, grids and trees** that reorder live, and lists that share items: groups,
  copies, swaps, rules for what goes where.
- **Multi-drag** with your own selection and a rubber band.
- **Drop zones** with accept rules, and drops you confirm, refuse or apply yourself.
- **Files and other apps**: the browser's own drag and drop through the same lists and zones.
- **Animations by default**, or your own with GSAP or motion.
- **The keyboard and screen readers**: drags by slots, announcements, ARIA attributes.
- **Virtual lists**, **sensors** of your own, **modifiers**, and SSR.

Related packages: [`@vue-dnd-kit/nuxt`](https://www.npmjs.com/package/@vue-dnd-kit/nuxt) (the
Nuxt module), [`@vue-dnd-kit/devtools`](https://www.npmjs.com/package/@vue-dnd-kit/devtools)
(a DevTools tab), [`@vue-dnd-kit/actions`](https://www.npmjs.com/package/@vue-dnd-kit/actions)
(drags scripted from code).

## License

[MIT](https://github.com/ZiZIGY/vue-dnd-kit/blob/master/LICENSE) © [ZiZIGY](https://github.com/ZiZIGY)
