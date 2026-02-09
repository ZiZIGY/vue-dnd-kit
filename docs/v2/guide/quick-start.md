# Quick Start

## 1. Wrap your app with DnDProvider

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

## 2. Make elements draggable

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const listRef = ref([1, 2, 3]);
  const itemRef = ref<HTMLElement | null>(null);

  makeDraggable(itemRef, { dragHandle: '.handle' }, () => [0, listRef.value]);
</script>

<template>
  <div ref="itemRef" tabindex="0">
    <span class="handle">⋮⋮</span>
    <span>Drag me</span>
  </div>
</template>
```

## 3. Make zones droppable

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';

  const zoneRef = ref<HTMLElement | null>(null);

  makeDroppable(zoneRef, {
    events: { onDrop: (e) => console.log('Dropped:', e.payload) },
  });
</script>

<template>
  <div ref="zoneRef" class="drop-zone">Drop here</div>
</template>
```
