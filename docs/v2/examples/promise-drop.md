# Async Drop Validation (Promises)

This example shows how to use **Promise-based drop validation** in Vue DnD Kit v2 with the new `makeDraggable` / `makeDroppable` API.

<script setup>
import Example from '@examples-v2/PromiseDrop/Example.vue';
</script>

## Demo

<Example />

## Overview

Sometimes you need to **confirm** or **validate** a drop before it is applied:

- ask the user for confirmation (`window.confirm`, custom modal, etc.)
- validate against an API or business rules
- decide dynamically whether to accept or decline the drop

Vue DnD Kit v2 lets you return a **Promise** from the `onDrop` handler. The drag system will:

- **wait** for the Promise to resolve or reject
- interpret the result to decide what to do next

## Behavior model (v2)

In v2, `onDrop` may return:

- `void` — accept drop immediately
- `boolean` — `false` = decline this drop only (drag stays active), anything else = accept
- `Promise<void | boolean>` — same, but async

Additionally, you can **reject** the Promise (throw) to cancel the drag entirely.

Summary:

- **Resolve `false`** → decline this drop, drag stays active, user can move and drop elsewhere
- **Resolve `void` / `true`** → accept drop, finish drag
- **Reject / throw** → cancel drag with cancel events (`onDragCancel`, `onSelfDragCancel`)

## Example code

### Core `onDrop` handler

```ts
import type { IDragEvent } from '@vue-dnd-kit/core';

function handleDrop(e: IDragEvent): Promise<void | boolean> {
  return new Promise((resolve) => {
    const ok = window.confirm('Are you sure you want to drop here?');
    if (!ok) {
      // Decline this drop only: drag stays active
      resolve(false);
      return;
    }

    // Accept drop and finish drag
    resolve();
  });
}
```

### Wiring it into `makeDroppable`

```ts
import { makeDroppable } from '@vue-dnd-kit/core';
import { useTemplateRef, ref } from 'vue';

const droppableRef = useTemplateRef<HTMLElement>('droppableRef');
const isOver = ref(false);

makeDroppable(droppableRef, {
  events: {
    onEnter() {
      isOver.value = true;
    },
    onLeave() {
      isOver.value = false;
    },
    onDrop(e) {
      isOver.value = false;
      return handleDrop(e);
    },
  },
});
```

### Draggable side

Any `makeDraggable` setup works; you do **not** need special payloads for Promise-based validation:

```ts
import { makeDraggable } from '@vue-dnd-kit/core';
import { useTemplateRef, ref } from 'vue';

const draggableRef = useTemplateRef<HTMLElement>('draggableRef');
const isDragging = ref(false);

makeDraggable(draggableRef, {
  events: {
    onSelfDragStart() {
      isDragging.value = true;
    },
    onSelfDragEnd() {
      isDragging.value = false;
    },
    onSelfDragCancel() {
      isDragging.value = false;
    },
  },
});
```

## When to use this pattern

- User confirmation before destructive actions
- API / server-side validation before accepting a drop
- Complex business rules (permissions, quotas, constraints)
- Multi-step flows where the user can cancel in the middle

Combine it with loading indicators when `state === 'pending'` to provide clear feedback while the Promise is in progress.

## Source

- [Async Drop (Promise) example component](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/PromiseDrop/Example.vue)
