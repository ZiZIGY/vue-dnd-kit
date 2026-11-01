<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import type { Option } from './form';

const props = defineProps<{ option: Option; removable: boolean }>();
const emit = defineEmits<{ rename: [label: string]; remove: [] }>();

const el = useTemplateRef<HTMLElement>('el');
const grip = useTemplateRef<HTMLElement>('grip');
// Dragged by its grip, so the text stays editable.
makeSortableItem(el, { item: () => props.option, handle: grip });
</script>

<template>
  <!-- Lifted in hand, as a row of the form is (see `FormRow.vue`); an empty block in its slot. -->
  <li
    ref="el"
    class="flex items-center gap-1 rounded-md bg-default in-data-[dnd-overlay]:[box-shadow:0_0_0_2px_var(--ui-primary),0_12px_24px_-10px_rgb(0_0_0/0.45)] data-[dnd-placeholder]:bg-elevated data-[dnd-placeholder]:opacity-100 data-[dnd-placeholder]:*:invisible"
  >
    <button
      ref="grip"
      type="button"
      :aria-label="`Move ${option.label}`"
      class="grid h-8 w-5 shrink-0 cursor-grab touch-none place-items-center rounded-sm text-dimmed hover:bg-elevated hover:text-highlighted focus-visible:outline-2 focus-visible:outline-primary"
    >
      <UIcon name="i-lucide-grip-vertical" class="size-4" />
    </button>
    <UInput
      :model-value="option.label"
      size="sm"
      :aria-label="`Option ${option.label}`"
      class="min-w-0 flex-1"
      @update:model-value="emit('rename', String($event))"
    />
    <UButton
      icon="i-lucide-x"
      size="xs"
      color="neutral"
      variant="ghost"
      :disabled="!removable"
      :aria-label="`Remove ${option.label}`"
      data-dnd-no-clone
      @click="emit('remove')"
    />
  </li>
</template>
