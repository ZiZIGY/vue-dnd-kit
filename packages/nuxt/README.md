# @vue-dnd-kit/nuxt

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Official Nuxt module for [Vue DnD Kit](https://zizigy.github.io/vue-dnd-kit/) — a lightweight, high-performance drag and drop library for Vue 3.

- [📖 Documentation](https://zizigy.github.io/vue-dnd-kit/v2/guide/nuxt)
- [✨ Release Notes](./CHANGELOG.md)

## Features

- Auto-imports all composables (`makeDraggable`, `makeDroppable`, `makeSelectionArea`, and more)
- Registers `DnDProvider` and `DragPreview` as global components — use them in templates without importing
- Fully SSR-compatible — no hydration mismatches, content rendered on server

## Quick Setup

```bash
npm install @vue-dnd-kit/nuxt @vue-dnd-kit/core
```

Add to `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@vue-dnd-kit/nuxt'],
})
```

## Usage

Wrap your layout with `DnDProvider`, then use composables inside **child components**. `makeDraggable` and other composables rely on `inject` — they must run inside a descendant of `DnDProvider`, not in the same component.

```vue
<!-- layouts/default.vue -->
<template>
  <DnDProvider>
    <slot />
    <DragPreview />
  </DnDProvider>
</template>
```

```vue
<!-- components/DraggableItem.vue -->
<script setup>
const el = useTemplateRef('el');
makeDraggable(el, {
  payload: () => [0, items.value],
});
</script>

<template>
  <div ref="el">Drag me</div>
</template>
```

For TypeScript types, import explicitly from the core package:

```ts
import type { IDragEvent, IDragItem } from '@vue-dnd-kit/core';
```

## Compatibility

| | Version |
| --- | --- |
| Nuxt | `^4.0.0` |
| `@vue-dnd-kit/core` | `^2.4.0` |
| Vue | `^3.5.0` |

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
