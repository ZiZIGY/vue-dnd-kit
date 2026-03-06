# Keyboard Navigation

Keyboard drag-and-drop works **out of the box** — no extra configuration required. You only need to make the draggable element focusable.

<script setup>
import Example from '@examples-v2/Keyboard/Example.vue';
</script>

## Demo

<Example />

Tab to focus an item, then use the keyboard shortcuts shown in the hint bar.

## Default key bindings

| Action | Keys |
|---|---|
| Start drag | `Space` or `Enter` |
| Move overlay | `Arrow` keys |
| Move faster | Hold `Shift` while pressing arrows |
| Drop | `Space` or `Enter` |
| Cancel drag | `Escape` |

## Making an element focusable

Use a native `<button>` (focusable by default) or add `tabindex="0"` to any element:

```vue
<!-- Option A: native button — focusable and keyboard-activated by default -->
<button ref="itemRef" type="button">Drag me</button>

<!-- Option B: any element with tabindex -->
<div ref="itemRef" tabindex="0">Drag me</div>
```

Both work identically with `makeDraggable`.

## Accessibility attributes

Add `aria-grabbed` to communicate drag state to screen readers:

```vue
<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const itemRef = useTemplateRef<HTMLElement>('itemRef');
  const { isDragging } = makeDraggable(itemRef);
</script>

<template>
  <button
    ref="itemRef"
    type="button"
    :aria-grabbed="isDragging"
    aria-label="Drag this item"
  >
    Drag me
  </button>
</template>
```

## Focus styles

Make sure your draggable elements have clear `:focus-visible` styles so keyboard users can see which item is focused:

```css
.item:focus-visible {
  outline: 2px solid rgba(99, 102, 241, 0.8);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
}
```

## Customising key bindings

Access the provider's `keyboard.keys` object to change which keys trigger each action:

```ts
import { useDnDProvider } from '@vue-dnd-kit/core';

const provider = useDnDProvider();

// Replace defaults
provider.keyboard.keys.forDrag = ['KeyG'];        // G to grab
provider.keyboard.keys.forDrop = ['KeyG'];        // G to drop
provider.keyboard.keys.forCancel = ['Escape'];
provider.keyboard.keys.forMove = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
provider.keyboard.keys.forMoveFaster = ['ShiftLeft'];

// Adjust movement speed (px per keypress)
provider.keyboard.step = 8;
provider.keyboard.moveFaster = 4; // multiplier when Shift held
```

## See also

- [makeDraggable](/v2/guide/core/make-draggable)
- [useDnDProvider](/v2/guide/core/use-dnd-provider)
