# Vue Drag & Drop Library - Core Package

[![Beta](https://img.shields.io/badge/status-beta-yellow.svg)](https://github.com/zizigy/vue-dnd-kit)

> ⚠️ **Warning**: This project is in active development (beta). The API may change between minor versions. Not recommended for production use until version 1.0.0.

<p align="center">
  <a href="https://zizigy.github.io/vue-dnd-hooks/">
    <img src="https://raw.githubusercontent.com/ZiZiGY/vue-dnd-hooks/master/public/logo.svg" width="400" alt="Vue Drag & Drop Logo">
  </a>
</p>

<p align="center">
  Core package of the Vue Drag & Drop library with essential hooks and functionality.
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
- [x] Complete documentation
- [ ] Tests
- [ ] Stable API (version 1.0.0)

## Features

### Core Capabilities

- 🎯 **Simple Composables API**

  - Intuitive hooks-based approach
  - Clean and declarative syntax
  - Minimal boilerplate code

- 🎨 **Full Customization**

  - Custom drag overlays
  - Flexible styling system
  - Animation support
  - Custom drag handles

- 📱 **Advanced Input Support**

  - Touch devices support
  - Mouse events
  - Multi-touch gestures

### Performance

- ⚡ **Optimized Rendering**

  - Virtual DOM friendly
  - Minimal re-renders
  - Efficient DOM updates
  - Memory leak prevention

- 🔄 **Smart Auto-scrolling**

  - Smooth scroll animations
  - Configurable thresholds
  - Performance-optimized
  - Works with nested scrollable containers

### Developer Experience

- 🔍 **TypeScript Ready**

  - Full type coverage
  - Type inference
  - IDE autocompletion
  - Type-safe events

- 📐 **Layout Features**

  - Grid system support
  - Flex layout compatible
  - Responsive design ready
  - Dynamic constraints

### Advanced Features

- 🎯 **Smart Grouping**

  - Element groups
  - Zone filtering
  - Nested groups
  - Dynamic group validation

- 📊 **Rich Events System**

  - Comprehensive lifecycle events
  - Custom event handlers
  - Drag state tracking
  - Position coordinates

- 🛡️ **Built-in Utilities**

  - Geometry calculations
  - Bounding box tracking
  - Position management
  - Intersection detection

### Integration

- 🔌 **Framework Integration**
  - Vue 3 Composition API
  - Nuxt.js compatible
  - Works with SSR
  - Plugin ecosystem ready

## Installation

Choose your preferred package manager:

```bash
npm install @vue-dnd-kit/core @vueuse/core
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
