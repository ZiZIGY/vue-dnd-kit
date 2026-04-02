# Nuxt Integration

`@vue-dnd-kit/nuxt` is the official Nuxt module for Vue DnD Kit v2. It auto-imports all composables and registers `DnDProvider` / `DragPreview` as global components — no manual imports required.

## Installation

```bash
npm install @vue-dnd-kit/nuxt @vue-dnd-kit/core
```

```bash
yarn add @vue-dnd-kit/nuxt @vue-dnd-kit/core
```

```bash
pnpm add @vue-dnd-kit/nuxt @vue-dnd-kit/core
```

## Setup

Add the module to `nuxt.config.ts`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vue-dnd-kit/nuxt'],
})
```

That's it. The module automatically:

- Registers `DnDProvider` and `DragPreview` as global components (no import needed in templates)
- Sets up auto-imports for all composables — `makeDraggable`, `makeDroppable`, `makeSelectionArea`, `makeConstraintArea`, `makeAutoScroll`, `useDnDProvider`, and more

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

## SSR

The module is fully SSR-compatible. `DnDProvider` renders its slot content on the server (so your page HTML is complete), and activates drag-and-drop logic only after hydration on the client. There is no flash of missing content and no hydration mismatch.

## TypeScript

Types are not auto-imported — import them explicitly from `@vue-dnd-kit/core`:

```ts
import type { IDragEvent, IDragItem } from '@vue-dnd-kit/core';
```

## Compatibility

| Package | Version |
| --- | --- |
| Nuxt | `^4.0.0` |
| `@vue-dnd-kit/core` | `^2.4.0` |
| Vue | `^3.5.0` |
