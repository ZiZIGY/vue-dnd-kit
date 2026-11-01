<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeSortableItem, useDnD } from '@vue-dnd-kit/core';
import FieldView from './FieldView.vue';
import { useForm, type Field } from './form';

const props = defineProps<{ field: Field; stacked: boolean }>();
const form = useForm();
const { status } = useDnD();

const el = useTemplateRef<HTMLElement>('el');
// The whole card drags; its toolbar doesn't (buttons never start a drag). Its row is in
// indicator mode: the card stays put while you drag, and `indicator` says on which side of
// it a line shows where the field would go.
const { indicator } = makeSortableItem(el, { item: () => props.field });
const side = computed(() => (indicator.value?.side === 'before' || indicator.value?.side === 'after' ? indicator.value.side : null));
const selected = computed(() => form.selected?.id === props.field.id);

// Space picks the card up (the provider's keys); Enter opens its settings.
function onKeydown(event: KeyboardEvent) {
  if (event.target !== event.currentTarget || status.value !== 'idle') return;
  if (event.key === 'Enter') form.select(props.field.id);
  else if (event.key === 'Delete' || event.key === 'Backspace') form.remove(props.field.id);
  else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'd') form.duplicate(props.field.id);
  else return;
  event.preventDefault();
}
</script>

<template>
  <div
    ref="el"
    :aria-label="`${field.label || 'Untitled'} field`"
    :aria-current="selected || undefined"
    class="group/field relative min-w-0 flex-1 cursor-grab rounded-md p-3 transition-[box-shadow,background-color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary data-[dnd-placeholder]:outline-2 data-[dnd-placeholder]:outline-dashed data-[dnd-placeholder]:outline-accented"
    :class="selected ? 'bg-primary/5 ring-2 ring-primary' : 'ring-1 ring-transparent hover:ring-accented'"
    @click="form.select(field.id)"
    @keydown="onKeydown"
  >
    <!-- A picture of the field: it can't be typed in, and a press on it starts a drag. -->
    <div inert class="pointer-events-none">
      <FieldView :field="field" />
    </div>

    <UFieldGroup
      size="xs"
      data-dnd-no-clone
      class="absolute -top-3 right-2 shadow-sm transition-opacity group-hover/field:opacity-100 focus-within:opacity-100"
      :class="selected ? 'opacity-100' : 'opacity-0'"
    >
      <UTooltip text="Duplicate" :kbds="['meta', 'd']">
        <UButton
          icon="i-lucide-copy"
          color="neutral"
          variant="outline"
          class="bg-default"
          :aria-label="`Duplicate ${field.label}`"
          @click.stop="form.duplicate(field.id)"
        />
      </UTooltip>
      <UTooltip text="Delete" :kbds="['delete']">
        <UButton
          icon="i-lucide-trash-2"
          color="neutral"
          variant="outline"
          class="bg-default hover:text-error"
          :aria-label="`Delete ${field.label}`"
          @click.stop="form.remove(field.id)"
        />
      </UTooltip>
    </UFieldGroup>

    <!-- Where the dragged field goes: beside this one, or above and below in a stacked row. -->
    <span
      v-if="side"
      aria-hidden="true"
      class="pointer-events-none absolute rounded-full bg-primary shadow-[0_0_0_3px] shadow-primary/20"
      :class="
        stacked
          ? ['inset-x-1 h-0.5', side === 'before' ? '-top-[7px]' : '-bottom-[7px]']
          : ['inset-y-1 w-0.5', side === 'before' ? '-left-[7px]' : '-right-[7px]']
      "
    />
  </div>
</template>
