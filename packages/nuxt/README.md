# @vue-dnd-kit/nuxt

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Official Nuxt module for [Vue DnD Kit](https://zizigy.github.io/vue-dnd-kit/) v3: drag and drop for Vue with sortable lists, kanban boards, trees, multi-drag, rubber-band selection and animations.

- [📖 Documentation](https://zizigy.github.io/vue-dnd-kit/)
- [✨ Release Notes](./CHANGELOG.md)

## Features

- Registers `<DnDProvider>` and `<DragPreview>` (the clone of a dragged item, for custom overlays) as global components (with an optional prefix).
- Auto-imports the composables: `makeDraggable`, `makeDroppable`, `makeSortableList`, `makeSortableItem`, `makeSortableTree`, `makeSelectionArea`, `useDnD`, `useDnDMonitor`.
- Auto-imports the main option and event types (`SortableListOptions`, `SortableDropEvent`, `DnDEvent`, …) as type-only imports.
- Modifiers and collision helpers are opt-in, because their names (`snapToGrid`, `restrictToParent`, `closestCenter`) are generic.
- SSR-safe: lists render on the server; the overlay, the screen reader instructions and the live region mount on the client.
- With [`@vue-dnd-kit/devtools`](https://www.npmjs.com/package/@vue-dnd-kit/devtools) installed: a "Vue DnD Kit" tab in the Nuxt DevTools (development only, see [DevTools](#devtools)).

## Quick setup

```bash
npm install @vue-dnd-kit/nuxt @vue-dnd-kit/core
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vue-dnd-kit/nuxt'],
});
```

## Usage

Wrap your layout (or a page) in `DnDProvider`. The composables use `inject`, so call them in **child components** of the provider, not in the component that renders it.

```vue
<!-- layouts/default.vue -->
<template>
  <DnDProvider>
    <slot />
    <!-- Optional: a custom overlay instead of the default clone. -->
    <template #overlay="{ items }">
      <TaskCard v-if="items.length === 1" :task="items[0].item" />
      <TaskStack v-else :tasks="items.map((entry) => entry.item)" />
    </template>
  </DnDProvider>
</template>
```

```vue
<!-- components/TaskList.vue -->
<script setup lang="ts">
const tasks = ref([
  { id: 1, title: 'Write the RFC' },
  { id: 2, title: 'Ship v3' },
]);

const { items } = makeSortableList(useTemplateRef('list'), {
  items: tasks, // the library writes the new order here on drop
  onDrop: (event: SortableDropEvent) => console.log(event.from, event.to),
});
</script>

<template>
  <ul ref="list">
    <TaskItem v-for="task in items" :key="task.id" :task="task" />
  </ul>
</template>
```

```vue
<!-- components/TaskItem.vue -->
<script setup lang="ts">
const props = defineProps<{ task: { id: number; title: string } }>();
makeSortableItem(useTemplateRef('item'), { id: () => props.task.id });
</script>

<template>
  <li ref="item">{{ task.title }}</li>
</template>
```

## Options

```ts
export default defineNuxtConfig({
  modules: ['@vue-dnd-kit/nuxt'],
  vueDndKit: {
    // Component name prefix: 'Dnd' registers <DndDnDProvider>. Default: none.
    prefix: '',
    // Register <DnDProvider> and <DragPreview> globally. Default: true.
    components: true,
    // `false` turns all auto-imports off.
    autoImports: {
      composables: true, // makeDraggable, makeSortableList, useDnD, …
      types: true, // type-only imports of the option and event types
      modifiers: false, // restrictToVerticalAxis, snapToGrid, …
      collision: false, // pointerFirst, closestCenter, …
    },
    // The Nuxt DevTools tab when @vue-dnd-kit/devtools is installed (development only). Default: true.
    devtools: true,
  },
});
```

`useDnDContext` and `provideDnDContext` (sharing a provider with a shadow root or another Vue app) are never auto-imported; import them from `@vue-dnd-kit/core`. The same goes for generic type names such as `Key`, `Active` or `Modifier`:

```ts
import type { Key } from '@vue-dnd-kit/core';
```

## DevTools

Install [`@vue-dnd-kit/devtools`](https://www.npmjs.com/package/@vue-dnd-kit/devtools) as a dev dependency and the module does the rest, in development only:

```bash
npm i -D @vue-dnd-kit/devtools @vue-dnd-kit/actions
```

Run `nuxt dev`, open the Nuxt DevTools (<kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>D</kbd>, or the Nuxt icon at the bottom of the page) and pick the **Vue DnD Kit** tab: a joystick that drags any item for real, a live mini-map of every list, tree and drop target, live editing of every option, the providers' state and a log of the drags. The module serves the tab at `/__vue-dnd-kit-devtools/` (open it in a window of its own too) and installs the page's side with a client plugin. Production builds get nothing of it. `vueDndKit.devtools: false` turns it off.

## Migrating from 1.x (Vue DnD Kit v2)

- Requires `@vue-dnd-kit/core` v3. See the core migration guide for the API changes.
- The overlay is the provider's own; customize it with its `#overlay` slot. `DragPreview` is a new component: the clone of one dragged item, for overlays that lay several out themselves.
- `makeAutoScroll`, `makeConstraintArea`, `useDnDProvider` and `injectionKey` are no longer exported or auto-imported. Auto-scroll is built in; use modifiers (`restrictToParent`, `restrictToElement`) instead of constraint areas, and `useDnD()` instead of `useDnDProvider()`.
- Types are auto-imported now, so explicit `import type` lines can go (except for the generic names above).

## Compatibility

| | Version |
| --- | --- |
| Nuxt | `^4.0.0` |
| `@vue-dnd-kit/core` | `^3.0.0` |
| Vue | `^3.5.0` |

## Development

```bash
yarn install
yarn test # prepares .nuxt types, then checks the export manifest against packages/core/src/index.ts
yarn prepack # builds dist/
```

The list of exports lives in `src/manifest.ts`. When core gains or loses an export, `test/manifest.test.ts` fails until the manifest is updated.

## License

MIT


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@vue-dnd-kit/nuxt/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@vue-dnd-kit/nuxt

[npm-downloads-src]: https://img.shields.io/npm/dm/@vue-dnd-kit/nuxt.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@vue-dnd-kit/nuxt

[license-src]: https://img.shields.io/npm/l/@vue-dnd-kit/nuxt.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@vue-dnd-kit/nuxt

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
