# Custom Render per Draggable

By default, `DragPreview` clones the outer HTML of the dragged element and shows the clone at the preview position. The `render` option in `makeDraggable` lets you replace that clone with any Vue component — so each draggable type can look completely different while being dragged.

<script setup>
import Example from '@examples-v2/CustomOverlay/Example.vue';
</script>

## Demo

<Example />

Tasks show a card-style preview with a priority badge. Notes show a tilted sticky-note preview. Both are rendered by `DragPreview`, just with different components per item type.

## How it works

`DragPreview` loops over `entities.draggingMap` and for each dragged element checks whether a `render` component is registered. If yes — renders that component. If no — falls back to the HTML clone:

```ts
// Simplified DragPreview logic
for (const [node, draggable] of entities.draggingMap) {
  const customRender = entities.draggableMap.get(node)?.render;
  if (customRender) {
    // → renders <component :is="customRender" />
  } else {
    // → renders a clone: <div v-html="draggable.initialOuterHTML" />
  }
}
```

The render component is placed **inside** the already-positioned preview container, so it does not need to handle transforms or absolute positioning.

## Setup

Pass `render: markRaw(MyComponent)` to `makeDraggable`:

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
Always wrap the component with `markRaw()` so Vue doesn't make it deeply reactive. Components stored in reactive maps must be raw.
:::

## Writing the render component

The component receives no props from the library. Use `useDnDProvider()` to read drag state, and `data` to pass payload:

```vue
<script setup lang="ts">
  import { computed } from 'vue';
  import { useDnDProvider } from '@vue-dnd-kit/core';

  const { entities } = useDnDProvider();

  // Read the data() payload registered on the draggable
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
  <div class="task-preview">
    📋 {{ draggingData?.label }}
    <span>{{ draggingData?.priority }}</span>
  </div>
</template>
```

No `transform` or `position` needed — the parent preview container handles that.

## Using TSX for inline components

If you need to pass static props to the render component, install `@vitejs/plugin-vue-jsx` and use JSX syntax directly — no `defineComponent` wrapper required:

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

**In a `.vue` file with `<script lang="tsx">` or a `.tsx` file:**
```tsx
import { markRaw } from 'vue';
import MyOverlay from './MyOverlay.vue';

// Just reference the component — no h(), no defineComponent
makeDraggable(itemRef, {
  render: markRaw(MyOverlay),
});

// Or inline with JSX if you need to bake in static props:
makeDraggable(itemRef, {
  render: markRaw(() => <MyOverlay color="blue" label={props.label} />),
});
```

The arrow function `() => <MyOverlay />` is a valid functional component in Vue — no `defineComponent` needed.

## Difference from preview customization

| Concept | API | Controls |
|---|---|---|
| **Render per draggable** | `render` in `makeDraggable` | How this specific element looks while being dragged |
| **Overlay component** | `#preview` slot / `provider.preview.render` | The entire drag container — positioning, animation, what's shown |

The `render` option works *inside* the preview. Replacing the preview component replaces the whole system including positioning logic. See [Changing Overlay](/v2/examples/changing-overlay) for the latter.

## See also

- [Changing Overlay](/v2/examples/changing-overlay) — replacing the preview component entirely
- [makeDraggable](/v2/guide/core/make-draggable) — `render` and `data` options
- [DnDProvider](/v2/guide/core/dnd-provider) — `#preview` slot
