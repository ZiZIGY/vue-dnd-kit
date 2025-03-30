# Vue Drag & Drop Library

<p align="center">
  <a href="https://zizigy.github.io/vue-dnd-hooks/">
    <img src="https://raw.githubusercontent.com/ZiZiGY/vue-dnd-hooks/master/public/logo.svg" width="400" alt="Vue Drag & Drop Logo">
  </a>
</p>

<p align="center">
  A powerful and flexible drag & drop library for Vue.js applications with TypeScript support.
</p>

<p align="center">
  <a href="https://zizigy.github.io/vue-dnd-hooks/" target="_blank">
    <img src="https://img.shields.io/badge/Documentation-Visit-blue?style=flat-square" alt="Documentation">
  </a>
</p>

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
npm install vue-dnd-hooks
```

```bash
yarn add vue-dnd-hooks
```

```bash
pnpm install vue-dnd-hooks
```

## Basic Usage

### App.vue

<sup>📄 Root Application Component</sup>

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import { DragOverlay } from 'vue-dnd-hooks';
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
  import { useDrag } from 'vue-dnd-hooks';

  const emit = defineEmits<{
    (e: 'end'): void;
  }>();

  const { elementRef, handleDragStart, isDragging } = useDrag({
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
  import { useDrop } from 'vue-dnd-hooks';

  const emit = defineEmits<{
    (e: 'drop'): void;
  }>();

  const { elementRef, isOvered } = useDrop({
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

## 📝 Contributing

(Not Ready)

<p align="center">
  <s>We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting pull requests.</s>
</p>

## 🎯 Roadmap

- [ ] File upload with drag & drop
- [ ] React port (probably not, react have dnd-kit)
- [ ] Accessibility improvements (ARIA)

## 🌟 Showcase

Projects using Vue Drag & Drop Library:

- [Project Name](link) - Brief description
- [Your Project Here](link) - Submit your project!

## 💖 Support

If you find this library helpful, please consider:

- Giving it a star on GitHub ⭐
- Sharing it with others

## 📄 License

[MIT](LICENSE) © [ZiZiGY](https://github.com/ZiZiGY)

---

<p align="center">Made with ❤️ for the Vue.js community</p>
