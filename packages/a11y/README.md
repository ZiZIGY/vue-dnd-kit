# Vue Drag & Drop Library - Accessibility Package

[![Beta](https://img.shields.io/badge/status-beta-yellow.svg)](https://github.com/zizigy/vue-dnd-kit)

> ⚠️ **Warning**: This project is in active development (beta). The API may change between minor versions. Not recommended for production use until version 1.0.0.

<p align="center">
  <a href="https://zizigy.github.io/vue-dnd-hooks/">
    <img src="https://raw.githubusercontent.com/ZiZiGY/vue-dnd-hooks/master/public/logo.svg" width="400" alt="Vue Drag & Drop Logo">
  </a>
</p>

<p align="center">
  Accessibility package for Vue Drag & Drop library with keyboard navigation and screen reader support.
</p>

<p align="center">
  <a href="https://zizigy.github.io/vue-dnd-hooks/" target="_blank">
    <img src="https://img.shields.io/badge/Documentation-Visit-blue?style=flat-square" alt="Documentation">
  </a>
</p>

<p align="center">
  Inspired by the popular <a href="https://dndkit.com/" target="_blank">React DnD Kit</a> library, adapted for Vue.js
</p>

## Project Status

This project is in active development. We're working toward a stable API, but until version 1.0.0, there may be breaking changes.

Roadmap:

- [x] Basic drag & drop functionality
- [ ] Keyboard navigation
- [ ] Screen reader announcements
- [ ] Focus management
- [ ] Complete documentation
- [ ] Tests
- [ ] Stable API (version 1.0.0)

## Features

### Accessibility Features

- 🎮 **Keyboard Navigation**

  - Arrow keys for movement
  - Enter to drop
  - Escape to cancel
  - Space to pick up

- 🔊 **Screen Reader Support**

  - Announcements for drag start/end
  - Status updates during drag
  - ARIA attributes

- 🔍 **Focus Management**

  - Proper focus handling
  - Focus trap during drag operations
  - Focus restoration

## Installation

## Installation

Choose your preferred package manager:

```bash
npm install @vue-dnd-kit/core
```

```bash
yarn add @vue-dnd-kit/core
```

```bash
pnpm install @vue-dnd-kit/core
```

## Basic Usage

### App.vue

<sup>📄 Root Application Component</sup>

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import { DragOverlay } from '@vue-dnd-kit/core';
  import Draggable from './components/Draggable.vue';
  import Droppable from './components/Droppable.vue';

  const handleDrop = () => (elementInDropZone.value = true);

  const handleEnd = () => (elementInDropZone.value = false);

  const elementInDropZone = ref<boolean>(false);
</script>

<template>
  <div>
    <Draggable v-if="!elementInDropZone"> drag me </Draggable>
    <Droppable @drop="handleDrop">
      <Draggable
        v-if="elementInDropZone"
        @end="handleEnd"
      >
        im in drop zone
      </Draggable>
    </Droppable>

    <DragOverlay />
  </div>
</template>
```

### Draggable.vue

<sup>🧩 components/Draggable.vue</sup>

```vue
<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';

  const emit = defineEmits<{
    (e: 'end'): void;
  }>();

  const { elementRef, handleDragStart, isDragging } = useDraggable({
    events: { onEnd: () => emit('end') },
  });
</script>

<template>
  <div
    ref="elementRef"
    @pointerdown="handleDragStart"
    :class="{ dragging: isDragging }"
  >
    <slot />
  </div>
</template>

<style scoped>
  .dragging {
    opacity: 0.5;
  }
</style>
```

### Droppable.vue

<sup>🧩 components/Droppable.vue</sup>

```vue
<script setup lang="ts">
  import { useDroppable } from '@vue-dnd-kit/core';

  const emit = defineEmits<{
    (e: 'drop'): void;
  }>();

  const { elementRef, isOvered } = useDroppable({
    events: { onDrop: () => emit('drop') },
  });
</script>

<template>
  <div
    ref="elementRef"
    :class="{
      droppable: true,
      'is-overed': isOvered,
    }"
  >
    drop here
    <slot />
  </div>
</template>

<style scoped>
  .droppable {
    width: 100px;
    height: 100px;
    border: 1px solid black;
  }
  .is-overed {
    background-color: #f0f0f0;
    border: 1px dashed red;
  }
</style>
```

## 📄 License

[MIT](LICENSE) © [ZiZiGY](https://github.com/ZiZiGY)

---

<p align="center">Made with ❤️ for the Vue.js community</p>
