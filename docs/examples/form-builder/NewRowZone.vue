<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import { newRowList, useForm, type Field } from './form';

/**
 * An empty list of the 'fields' group: a field dropped on it gets a row of its own. `form.drop`
 * reads the list's id and makes the row there: above the row `before`, or after the last
 * one (`null`, the rest of the page).
 */
const props = defineProps<{ before: string | null }>();
const form = useForm();

const NONE: readonly Field[] = [];
const el = useTemplateRef<HTMLElement>('el');
const { isOver, isAccepting } = makeSortableList(el, {
  id: newRowList(props.before),
  items: () => NONE,
  group: 'fields',
  placeholder: 'indicator',
  // A band across the page: up and down are the keys that cross it, to the next list.
  strategy: 'horizontal',
  onDrop: form.drop,
});

const empty = computed(() => form.state.rows.length === 0);
</script>

<template>
  <!-- Between rows: a band over the gap above the row, which only a drag can reach. The
       arrow keys reach it too: it is the next list up or down. -->
  <div
    v-if="before"
    ref="el"
    class="pointer-events-none absolute inset-x-0 -top-[18px] z-10 h-6 in-data-[dnd-dragging]:pointer-events-auto"
  >
    <span
      class="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_0_3px] shadow-primary/20 transition-opacity"
      :class="isOver ? 'opacity-100' : 'opacity-0'"
    />
  </div>

  <!-- After the last row: the rest of the page, outlined while a field is dragged. -->
  <div
    v-else
    ref="el"
    class="flex min-h-20 flex-1 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed p-4 text-center text-sm transition-colors"
    :class="
      isOver
        ? 'border-primary bg-primary/5 text-primary'
        : isAccepting || empty
          ? 'border-accented text-muted'
          : 'border-transparent text-dimmed'
    "
  >
    <template v-if="empty">
      <UIcon name="i-lucide-mouse-pointer-click" class="mb-1 size-6 text-dimmed" />
      <p class="font-medium text-highlighted">Your form is empty</p>
      <p>Drag fields here, or click one in the palette.</p>
    </template>
    <template v-else-if="isAccepting">Drop here for a new row</template>
  </div>
</template>
