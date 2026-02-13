# Quick Start

This guide gets you from zero to a draggable item and a drop zone in a few steps.

## Installation

If you haven't already, install the core package:

```bash
npm install @vue-dnd-kit/core
```

With yarn or pnpm:

```bash
yarn add @vue-dnd-kit/core
# or
pnpm add @vue-dnd-kit/core
```

Peer dependency: Vue 3. For more options and setup details, see [Installation](/v2/guide/installation).

---

## 1. Wrap your app with DnDProvider

Drag and drop only works inside a `DnDProvider`. Wrap the root (or the part of the tree that needs DnD):

```vue
<template>
  <DnDProvider>
    <YourApp />
  </DnDProvider>
</template>

<script setup lang="ts">
  import { DnDProvider } from '@vue-dnd-kit/core';
</script>
```

## 2. Make an element draggable

Use **`useTemplateRef`** to pass the element to `makeDraggable`. The ref name in the template must match the string you pass to `useTemplateRef`.

```vue
<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const itemRef = useTemplateRef<HTMLElement>('itemRef');

  makeDraggable(itemRef, { dragHandle: '.handle' });
</script>

<template>
  <div ref="itemRef" tabindex="0">
    <span class="handle">⋮⋮</span>
    <span>Drag me</span>
  </div>
</template>
```

You can still use `ref<HTMLElement | null>(null)` and bind it with `ref="itemRef"` — that remains supported. **`useTemplateRef`** is the recommended API (Vue 3.5+): it keeps the template ref name in one place and improves type inference.

## 3. Make a zone droppable

Same idea: use **`useTemplateRef`** for the drop zone element and pass it to `makeDroppable`.

```vue
<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';

  const zoneRef = useTemplateRef<HTMLElement>('zoneRef');

  makeDroppable(zoneRef, {
    events: { onDrop: (e) => console.log(e) },
  });
</script>

<template>
  <div ref="zoneRef" class="drop-zone">Drop here</div>
</template>
```

---

## What's next

- [DnDProvider](/v2/guide/core/dnd-provider) — provider API and options
- [makeDraggable](/v2/guide/core/make-draggable) — draggable options, payload, drag handle
- [makeDroppable](/v2/guide/core/make-droppable) — drop events and validation
