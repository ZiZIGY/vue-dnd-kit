# Vue Drag & Drop Library - Utilities Package

[![Beta](https://img.shields.io/badge/status-beta-yellow.svg)](https://github.com/zizigy/vue-dnd-kit)

> ⚠️ **Warning**: This project is in active development (beta). The API may change between minor versions. Not recommended for production use until version 1.0.0.

<p align="center">
  <a href="https://zizigy.github.io/vue-dnd-hooks/">
    <img src="https://raw.githubusercontent.com/ZiZiGY/vue-dnd-hooks/master/public/logo.svg" width="400" alt="Vue Drag & Drop Logo">
  </a>
</p>

<p align="center">
  Utilities package for the Vue Drag & Drop library with helper functions and composables.
</p>

<p align="center">
  <a href="https://zizigy.github.io/vue-dnd-hooks/" target="_blank">
    <img src="https://img.shields.io/badge/Documentation-Visit-blue?style=flat-square" alt="Documentation">
  </a>
</p>

<p align="center">
  Extends the core functionality of <a href="https://github.com/zizigy/vue-dnd-kit" target="_blank">@vue-dnd-kit/core</a> with useful utilities
</p>

## Project Status

This project is in active development. We're working toward a stable API, but until version 1.0.0, there may be breaking changes.

Roadmap:

- [x] Basic utility composables
- [ ] Geometry calculations
- [ ] Tests
- [ ] Stable API (version 1.0.0)

## Features

### Composables

- 🔄 **useAutoScroll**

  - Automatic scrolling when pointer approaches container edges
  - Configurable threshold and speed
  - Performance optimized with requestAnimationFrame

- 📏 **useBounding**

  - Track element bounding box in real-time
  - Automatic updates on resize and position changes
  - Efficient DOM updates with ResizeObserver

- 📐 **useElementSize**

  - Monitor element dimensions
  - Reactive width and height values
  - Optimized with ResizeObserver

- 🧮 **useGeometry**

  - Calculate relationships between points
  - Get direction, distance, angle, and delta
  - Perfect for pointer-based interactions

- 🔍 **useSizeObserver**

  - Low-level size observation utility
  - Callback-based API for custom logic
  - Efficient DOM monitoring

### Utility Functions

- 📊 **Geometry Utilities**
  - Calculate delta between points
  - Determine direction of movement
  - Measure angles between points

## Installation

Choose your preferred package manager:

```bash
npm install @vue-dnd-kit/utilities
```

```bash
yarn add @vue-dnd-kit/utilities
```

```bash
pnpm install @vue-dnd-kit/utilities
```

## Basic Usage

### Auto-Scrolling

```vue
<script setup>
  import { ref } from 'vue';
  import { useAutoScroll } from '@vue-dnd-kit/utilities';
  import type { IPoint } from '@vue-dnd-kit/core';

  const container = ref(null);
  const pointerPosition = ref({ x: 0, y: 0 });

  const { isScrolling } = useAutoScroll(container, pointerPosition, {
    threshold: 50, // Start scrolling 50px from edges
    speed: 10, // Scroll speed in px per frame
  });

  const updatePointer = (event) => {
    pointerPosition.value = { x: event.clientX, y: event.clientY };
  };
</script>

<template>
  <div
    ref="container"
    @pointermove="updatePointer"
    class="scrollable-container"
  >
    <!-- Content -->
    <div
      v-if="isScrolling"
      class="scroll-indicator"
      >Scrolling...</div
    >
  </div>
</template>
```

### Tracking Element Bounds

```vue
<script setup>
  import { ref } from 'vue';
  import { useBounding } from '@vue-dnd-kit/utilities';

  const element = ref(null);
  const bounds = useBounding(element);
</script>

<template>
  <div
    ref="element"
    class="tracked-element"
  >
    Element position: {{ bounds.x }}, {{ bounds.y }}
    <br />
    Size: {{ bounds.width }} x {{ bounds.height }}
  </div>
</template>
```

## Dependencies

This package requires `@vue-dnd-kit/core` as a peer dependency:

```bash
npm install @vue-dnd-kit/core
```

## 📄 License

[MIT](LICENSE) © [ZiZiGY](https://github.com/ZiZiGY)

---

<p align="center">Made with ❤️ for the Vue.js community</p>
