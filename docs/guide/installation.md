# Installation

Vue DnD Kit is designed as a modular ecosystem, allowing you to install only the packages you need for your project. This guide will help you get started with the installation process.

## Requirements

- Vue 3.2 or higher
- Node.js 14 or higher
- npm 6+ or yarn 1.22+

## Dependencies

Vue DnD Kit has a peer dependency on [@vueuse/core](https://vueuse.org/), which provides essential composition utilities. This dependency is not bundled with Vue DnD Kit to avoid duplicate installations when your project already uses VueUse.

```bash
# npm
npm install @vueuse/core

# yarn
yarn add @vueuse/core

# pnpm
pnpm add @vueuse/core
```

## Installing Packages

### Core Package

The core package is the foundation of Vue DnD Kit and provides essential drag and drop functionality:

```bash
# npm
npm install @vue-dnd-kit/core

# yarn
yarn add @vue-dnd-kit/core

# pnpm
pnpm add @vue-dnd-kit/core
```

For most projects, the core package is all you need to get started with basic drag and drop functionality.

### Additional Packages

Depending on your needs, you may want to install additional packages:

#### Components Package

Ready-to-use components for common drag and drop patterns:

```bash
# npm
npm install @vue-dnd-kit/components

# yarn
yarn add @vue-dnd-kit/components

# pnpm
pnpm add @vue-dnd-kit/components
```

#### Utilities Package

Utility functions for collision detection, geometry calculations, and more:

```bash
# npm
npm install @vue-dnd-kit/utilities

# yarn
yarn add @vue-dnd-kit/utilities

# pnpm
pnpm add @vue-dnd-kit/utilities
```

## Full Installation

If you want to install all packages at once:

```bash
# npm
npm install @vueuse/core @vue-dnd-kit/core @vue-dnd-kit/components @vue-dnd-kit/utilities

# yarn
yarn add @vueuse/core @vue-dnd-kit/core @vue-dnd-kit/components @vue-dnd-kit/utilities

# pnpm
pnpm add @vueuse/core @vue-dnd-kit/core @vue-dnd-kit/components @vue-dnd-kit/utilities
```

## Setting Up in Your Project

### Register the Plugin

After installation, you need to register the Vue DnD Kit plugin in your main application file:

```js
// main.js or main.ts
import { createApp } from 'vue';
import App from './App.vue';
import VueDnDKitPlugin from '@vue-dnd-kit/core';

const app = createApp(App);

// Register the Vue DnD Kit plugin
app.use(VueDnDKitPlugin);

app.mount('#app');
```

This step is crucial as it sets up the global state management and event handling required for drag and drop functionality.

### Using in Components

Now you can import and use Vue DnD Kit in your components:

```vue
<script setup>
  import { useDraggable, useDroppable } from '@vue-dnd-kit/core';

  // Your component logic here
</script>
```

## TypeScript Support

Vue DnD Kit is written in TypeScript and provides full type definitions. No additional setup is required to use it with TypeScript projects.

## Verifying Installation

To verify that Vue DnD Kit is correctly installed, you can create a simple component:

```vue
<script setup>
  import { useDraggable } from '@vue-dnd-kit/core';

  const {
    elementRef,
    isDragging,
    isOvered,
    isAllowed,
    handleDragStart,
    pointerPosition,
    id,
  } = useDraggable({
    id: 'test-draggable',
    // Additional options can be specified here
  });
</script>

<template>
  <div
    ref="elementRef"
    :class="{ dragging: isDragging }"
    @pointerdown="handleDragStart"
  >
    Drag me to test installation
    <div v-if="isDragging">
      Current position: {{ pointerPosition.current.value.x }},
      {{ pointerPosition.current.value.y }}
    </div>
  </div>
</template>

<style scoped>
  div {
    padding: 20px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    cursor: grab;
    user-select: none;
    width: 200px;
  }

  .dragging {
    opacity: 0.5;
    cursor: grabbing;
    background-color: #e0e0e0;
  }
</style>
```

If the element becomes draggable and changes appearance when dragged, your installation is working correctly.

## Coming Soon

Additional packages such as `@vue-dnd-kit/devtools` are planned for future releases to enhance your development experience.

## Next Steps

Now that you have installed Vue DnD Kit, you can proceed to the [Quick Start](/guide/quick-start) guide to learn how to create your first drag and drop interface.
