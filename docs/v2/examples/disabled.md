# Disabled

Both `makeDraggable` and `makeDroppable` accept a `disabled` option. Disabled draggables cannot be picked up; disabled droppables silently reject all drops.

<script setup>
import Example from '@examples-v2/Disabled/Example.vue';
</script>

## Demo

<Example />

**Blocked task** cannot be dragged. **Locked zone** cannot receive drops.

## Disabling a draggable

```ts
makeDraggable(itemRef, {
  disabled: true,
});
```

A disabled draggable is completely inert — no pointer events start a drag.

## Disabling a droppable

```ts
makeDroppable(zoneRef, {
  disabled: true,
});
```

A disabled droppable is ignored during collision detection — `onEnter`, `onDrop`, and `onLeave` are never called.

## Dynamic disabled state

Pass a reactive `Ref<boolean>` to toggle at runtime:

```vue
<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const isLocked = ref(false);
  const itemRef = useTemplateRef<HTMLElement>('itemRef');

  makeDraggable(itemRef, {
    disabled: isLocked,
  });
</script>

<template>
  <div ref="itemRef" :class="{ locked: isLocked }">...</div>
  <button @click="isLocked = !isLocked">Toggle lock</button>
</template>
```

## Visual feedback

Show disabled state visually so users understand why an item is inert:

```css
.item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none; /* optional: also block hover effects */
}
```

```vue
<div
  ref="itemRef"
  :class="{ 'item--disabled': isDisabled }"
>
  ...
</div>
```

## See also

- [makeDraggable](/v2/guide/core/make-draggable)
- [makeDroppable](/v2/guide/core/make-droppable)
- [Groups](/v2/examples/groups) — restricting drops by group instead of disabling

## Source

- [Example.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Disabled/Example.vue)
