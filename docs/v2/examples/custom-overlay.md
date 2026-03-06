# Custom Overlay per Draggable

Each draggable element can specify its own overlay component via the `render` option in `makeDraggable`. When that element is dragged, `DefaultOverlay` renders your component instead of a clone of the original element.

<script setup>
import Example from '@examples-v2/CustomOverlay/Example.vue';
</script>

## Demo

<Example />

Tasks show a card-style overlay with priority badge. Notes show a tilted sticky-note overlay. Each item type has its own visual identity while dragging.

## Setup

Pass `render: markRaw(MyOverlayComponent)` when registering the draggable:

```ts
import { markRaw } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';
import TaskOverlay from './TaskOverlay.vue';

makeDraggable(itemRef, {
  render: markRaw(TaskOverlay),
  data: () => ({ id: props.id, label: props.label, priority: props.priority }),
});
```

::: tip `markRaw`
Wrap the component with `markRaw()` so Vue doesn't make it deeply reactive. This is required for components stored in reactive state.
:::

## Writing the overlay component

The overlay component is rendered **inside** `DefaultOverlay`'s already-positioned container, so you don't need to handle positioning yourself. Use `useDnDProvider()` to read the dragged item's data:

```vue
<script setup lang="ts">
  import { computed } from 'vue';
  import { useDnDProvider } from '@vue-dnd-kit/core';

  const { entities } = useDnDProvider();

  const draggingData = computed(() => {
    const [node] = entities.draggingMap.keys();
    if (!node) return null;
    return entities.draggableMap.get(node)?.data?.() as {
      label: string;
      priority: string;
    } | null;
  });
</script>

<template>
  <div class="task-overlay">
    <span>📋 {{ draggingData?.label }}</span>
    <span class="priority">{{ draggingData?.priority }}</span>
  </div>
</template>
```

## Global overlay override

To replace the overlay for the **entire provider** (not per-item), use the `#overlay` slot on `DnDProvider`, or set `provider.overlay.render` from any descendant:

```vue
<!-- Slot approach -->
<DnDProvider>
  <template #overlay>
    <MyGlobalOverlay />
  </template>
</DnDProvider>
```

```ts
// Programmatic approach (from any child component)
import { markRaw, onMounted } from 'vue';
import { useDnDProvider } from '@vue-dnd-kit/core';
import MyGlobalOverlay from './MyGlobalOverlay.vue';

const provider = useDnDProvider();
onMounted(() => {
  provider.overlay.render.value = markRaw(MyGlobalOverlay);
});
```

## Without `h()` — plain component reference

The simplest way to specify a render component is a plain import:

```ts
import { markRaw } from 'vue';
import MyOverlay from './MyOverlay.vue';

makeDraggable(itemRef, {
  render: markRaw(MyOverlay),
});
```

## Passing props via TSX

Since the `render` component receives no props (it reads state from `useDnDProvider()`), you normally don't need to pass props. If you do need a parametric component, use `@vitejs/plugin-vue-jsx` and define an inline component with TSX:

**Install:**
```bash
npm install -D @vitejs/plugin-vue-jsx
```

**vite.config.ts:**
```ts
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  plugins: [vue(), vueJsx()],
});
```

**Usage — inline component with props via TSX:**
```ts
// MyComponent.vue or a .tsx file
import { defineComponent, markRaw } from 'vue';
import MyOverlay from './MyOverlay.vue';

const color = 'blue';

makeDraggable(itemRef, {
  // Wrap in defineComponent so it's a proper component, not a VNode
  render: markRaw(
    defineComponent(() => () => <MyOverlay color={color} />)
  ),
});
```

This is the escape hatch when you need static props baked into the component. For dynamic data that changes per drag, the `data` option + `useDnDProvider()` inside the overlay is the recommended pattern.

## See also

- [Changing Overlay](/v2/examples/changing-overlay) — replacing the overlay globally per drop zone
- [DnDProvider](/v2/guide/core/dnd-provider) — `#overlay` slot
- [makeDraggable](/v2/guide/core/make-draggable) — `render` and `data` options
