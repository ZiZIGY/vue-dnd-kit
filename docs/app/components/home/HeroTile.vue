<script setup lang="ts">
  import { makeSortableItem } from '@vue-dnd-kit/core';

  const props = defineProps<{ tile: { id: number; filled: boolean } }>();
  const el = useTemplateRef<HTMLElement>('el');
  makeSortableItem(el, { item: () => props.tile });
</script>

<template>
  <div
    ref="el"
    class="group relative flex size-16 cursor-grab items-end justify-between p-1.5 font-mono text-[10px] tracking-[0.1em] ring-1 ring-inset transition-colors duration-300 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:size-[4.5rem]"
    :class="
      tile.filled
        ? 'bg-primary text-inverted ring-primary'
        : 'bg-default text-dimmed ring-accented hover:bg-elevated hover:text-highlighted'
    "
  >
    <span>{{ String(tile.id).padStart(2, '0') }}</span>
    <span
      aria-hidden="true"
      class="size-1.5"
      :class="tile.filled ? 'bg-inverted' : 'border border-current'"
    />
  </div>
</template>
