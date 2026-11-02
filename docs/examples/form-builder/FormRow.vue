<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeSortableItem, makeSortableList } from '@vue-dnd-kit/core';
import FieldCard from './FieldCard.vue';
import FieldOverlay from './FieldOverlay.vue';
import NewRowZone from './NewRowZone.vue';
import { MAX_COLUMNS, cloneField, rowList, useForm, type Row } from './form';

const props = defineProps<{ row: Row; index: number; stacked: boolean }>();
const form = useForm();

const el = useTemplateRef<HTMLElement>('el');
const grip = useTemplateRef<HTMLElement>('grip');
const list = useTemplateRef<HTMLElement>('list');

// The row is an item of the form's rows, dragged by its grip...
makeSortableItem(el, { item: () => props.row, handle: grip });

// ...and a list of up to three fields side by side, in the group of the palette. `put`
// refuses a field when the row is full (moves inside it are always allowed). The list
// reads the form and never writes it: `form.drop` applies each drop, for Undo.
const { items, isOver, isAccepting } = makeSortableList(list, {
  id: rowList(props.row.id),
  items: () => props.row.fields,
  group: { name: 'fields', put: ({ keys }) => props.row.fields.length + keys.length <= MAX_COLUMNS },
  // Fields stack on a phone, as the exported form's grid does.
  strategy: () => (props.stacked ? 'vertical' : 'horizontal'),
  placeholder: 'indicator',
  overlay: FieldOverlay,
  // Alt-drag copies a field.
  clone: cloneField,
  // Fields added, removed or brought back by Undo slide into place.
  animateChanges: true,
  onDrop: form.drop,
});

const full = computed(() => isOver.value && !isAccepting.value);
</script>

<template>
  <!-- In hand, the row's copy is lifted: a background, a ring and a shadow, as one
       `box-shadow` (the copy's root carries the row's `--tw-*` variables inline, which would
       cancel `ring-*` and `shadow-*`). Its slot is an empty block. -->
  <div
    ref="el"
    class="group/row relative rounded-md in-data-[dnd-overlay]:bg-default in-data-[dnd-overlay]:[box-shadow:0_0_0_2px_var(--ui-primary),0_24px_48px_-16px_rgb(0_0_0/0.45)] data-[dnd-placeholder]:bg-elevated data-[dnd-placeholder]:opacity-100 data-[dnd-placeholder]:*:invisible"
  >
    <NewRowZone :before="row.id" />

    <button
      ref="grip"
      type="button"
      :aria-label="`Move row ${index + 1}`"
      data-dnd-no-clone
      class="absolute top-2.5 -left-6 grid h-7 w-5 cursor-grab touch-none place-items-center rounded-sm text-dimmed opacity-0 transition-opacity group-hover/row:opacity-100 hover:bg-elevated hover:text-highlighted focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-primary pointer-coarse:opacity-60"
    >
      <UIcon name="i-lucide-grip-vertical" class="size-4" />
    </button>

    <div
      ref="list"
      class="flex gap-3 rounded-md transition-[outline-color]"
      :class="[stacked ? 'flex-col' : '', full ? 'outline-2 outline-offset-2 outline-error/60 outline-dashed' : '']"
    >
      <FieldCard v-for="field in items" :key="field.id" :field="field" :stacked="stacked" />
    </div>

    <p
      v-if="full"
      class="absolute right-2 -bottom-3 rounded-sm bg-default px-1.5 text-xs font-medium text-error ring ring-error/40"
    >
      A row holds {{ MAX_COLUMNS }} fields
    </p>
  </div>
</template>
