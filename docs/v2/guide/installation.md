# Installation

This page describes how to install Vue DnD Kit v2 and wire it into your Vue 3 app.

## Prerequisites

- **Vue 3** (Composition API)
- A build setup that supports Vue 3 (e.g. [Vite](https://vitejs.dev/), Vue CLI, or Nuxt 3)

Vue DnD Kit v2 has **no external dependencies** besides Vue. You do not need VueUse, Sortable.js, or any other library.

## Install the package

From your project root, install `@vue-dnd-kit/core`:

```bash
npm install @vue-dnd-kit/core
```

```bash
yarn add @vue-dnd-kit/core
```

```bash
pnpm add @vue-dnd-kit/core
```

**Peer dependency:** Vue 3. The package is built for Vue 3 and does not support Vue 2.

## Set up the DnD context

Vue DnD Kit v2 does not use a global plugin. You enable drag and drop by wrapping the part of your app that needs it with **`DnDProvider`**.

Typically you wrap the root component or a layout that contains all draggable and droppable areas:

```vue
<!-- App.vue -->
<script setup>
  import { DnDProvider } from '@vue-dnd-kit/core';
</script>

<template>
  <DnDProvider>
    <YourApp />
  </DnDProvider>
</template>
```

Everything inside `DnDProvider` can use `makeDraggable`, `makeDroppable`, `makeSelectionArea`, and `makeConstraintArea`. You can also use multiple providers in different branches of the tree if you want separate DnD contexts.

## Verify the installation

1. Ensure `DnDProvider` wraps your app (or the subtree where you want DnD).
2. Follow the [Quick Start](/v2/guide/quick-start) to add a draggable element and a drop zone.
3. If the element can be dragged and dropped, the installation is correct.

No global registration or plugin options are required.

## TypeScript

The library is written in TypeScript and ships with type definitions. In a TypeScript project you get full typings and editor support without extra configuration.

## What's next

- [Quick Start](/v2/guide/quick-start) — build your first draggable item and drop zone.
- [DnDProvider](/v2/guide/core/dnd-provider) — provider API and options.
