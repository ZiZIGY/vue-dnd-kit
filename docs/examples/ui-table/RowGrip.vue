<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import type { Task } from './tasks';

const props = defineProps<{ task: Task }>();

// UTable renders the rows, so no component of ours is the row: this grip is, in the row's
// first cell. The item is the `<tr>` around it, and the grip is its handle (it gets the
// focus and the attributes): the rest of the row stays free to select text.
const grip = useTemplateRef<HTMLElement>('grip');
makeSortableItem(() => grip.value?.closest('tr') ?? null, {
  id: () => props.task.id,
  handle: grip,
  label: () => props.task.title,
});
</script>

<template>
  <button
    ref="grip"
    type="button"
    class="flex size-7 cursor-grab items-center justify-center rounded-md text-dimmed transition-colors hover:bg-elevated hover:text-highlighted focus-visible:outline-2 focus-visible:outline-primary"
    :aria-label="`Move ${task.title}`"
  >
    <UIcon name="i-lucide-grip-vertical" class="size-4" />
  </button>
</template>
