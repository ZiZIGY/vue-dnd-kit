# Drag Handle

Restrict dragging to a specific handle element. Clicking anywhere else on the item does nothing — only the grip icon initiates the drag.

<script setup>
import Example from '@examples-v2/DragHandle/Example.vue';
</script>

## Demo

<Example />

Grab the **⠿ icon** on the left of the card and drag it between the two zones. Clicking the card body has no effect.

## Overview

A drag handle is any CSS selector passed as `dragHandle` to `makeDraggable`. Only pointer-down events that originate inside a matching element start the drag sequence.

Use cases:
- **Task boards** — row content is interactive (inputs, buttons), drag via dedicated grip
- **Form builders** — fields have options/controls; handle keeps drag intent unambiguous
- **Tables** — row action columns coexist with a reorder handle

## Setup

```ts
makeDraggable(itemRef, {
  dragHandle: '.drag-handle',
});
```

The `dragHandle` value is a CSS selector evaluated against the draggable element's subtree. Any element matching it can start a drag. The rest of the item stays fully interactive.

## Template

```vue
<template>
  <div ref="itemRef" class="item">
    <!-- Only this button starts a drag -->
    <button class="drag-handle" aria-label="Drag handle">
      <GripIcon />
    </button>

    <!-- This content is NOT draggable and can hold clicks, inputs, etc. -->
    <span>{{ label }}</span>
  </div>
</template>
```

::: tip touch-action
Add `touch-action: none` to the handle element so mobile browsers do not intercept the pointer stream for scrolling before the drag threshold is reached.
:::

## See also

- [Base Drop](/v2/examples/base-drop) — simplest drag without a handle
- [Multi Selection](/v2/examples/multi-selection) — handle + checkbox selection together
- [makeDraggable](/v2/guide/core/make-draggable) — full options reference
