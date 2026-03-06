# Mobile & Touch

Touch drag-and-drop works **out of the box** — the library uses the Pointer Events API which handles both mouse and touch uniformly. However, you need to apply a couple of CSS properties so the browser doesn't intercept the touch gestures.

## Required CSS

### On the draggable element (or its drag handle)

```css
.item {
  touch-action: none;   /* prevent browser scroll/zoom from stealing the pointer */
  user-select: none;    /* prevent text selection during drag */
}
```

If you use a **drag handle**, apply these to the handle only — not the whole item:

```css
.drag-handle {
  touch-action: none;
  user-select: none;
}
```

Applying `touch-action: none` only to the handle means the rest of the item remains scrollable on touch, which is important for long lists.

### Vue inline binding

```vue
<div
  ref="itemRef"
  style="touch-action: none; user-select: none;"
>
  Drag me
</div>
```

Or in `<style scoped>`:

```vue
<style scoped>
  .item {
    touch-action: none;
    user-select: none;
  }
</style>
```

## Why `touch-action: none`?

Without it, the browser interprets a slow finger swipe as scroll intent and never fires `pointermove` on the element. The drag never starts. Setting `touch-action: none` tells the browser: "I'm handling this pointer event myself — don't scroll."

## Why `user-select: none`?

On long-press, mobile browsers try to select text or show a context menu. `user-select: none` suppresses this so the drag gesture starts cleanly.

## Drag handle best practice

For long scrollable lists, only restrict touch on the handle:

```vue
<template>
  <div ref="itemRef" class="item">
    <!-- Only the handle is touch-restricted -->
    <span class="drag-handle">⠿</span>
    <span>Card content users can still scroll over</span>
  </div>
</template>

<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const itemRef = useTemplateRef<HTMLElement>('itemRef');
  makeDraggable(itemRef, { dragHandle: '.drag-handle' });
</script>

<style scoped>
  .drag-handle {
    touch-action: none;
    user-select: none;
    cursor: grab;
  }
</style>
```

## See also

- [Drag Handle](/v2/examples/drag-handle) — restricting drag to a handle element
- [makeDraggable](/v2/guide/core/make-draggable) — `dragHandle` option
