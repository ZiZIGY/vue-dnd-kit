<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList, restrictToParent } from '@vue-dnd-kit/core';
import OptionRow from './OptionRow.vue';
import { createOption, useForm, type Field, type Option } from './form';

/** The options of a dropdown or a multiple choice: drag them into order, rename, add, remove. */
const props = defineProps<{ field: Field }>();
const form = useForm();

const setOptions = (options: Option[]) => form.update(props.field.id, { options });

const list = useTemplateRef<HTMLElement>('list');
// A list of its own (no group): options stay in their field. Read-only like the others:
// the drop goes through the form, so Undo takes a reorder back too.
const { items } = makeSortableList(list, {
  id: 'options',
  items: () => props.field.options,
  axis: 'y',
  modifiers: [restrictToParent],
  animateChanges: true,
  onDrop: (event) => {
    event.preventDefault();
    setOptions(event.result.get('options')!);
  },
});

// Typing in one option is one step of Undo: the edits share a key.
const rename = (option: Option, label: string) =>
  form.update(
    props.field.id,
    { options: props.field.options.map((item) => (item.id === option.id ? { ...item, label } : item)) },
    `option:${option.id}`,
  );
const remove = (option: Option) => setOptions(props.field.options.filter((item) => item.id !== option.id));
const add = () => setOptions([...props.field.options, createOption(`Option ${props.field.options.length + 1}`)]);
</script>

<template>
  <div>
    <ul ref="list" class="flex flex-col gap-1">
      <OptionRow
        v-for="option in items"
        :key="option.id"
        :option="option"
        :removable="field.options.length > 1"
        @rename="rename(option, $event)"
        @remove="remove(option)"
      />
    </ul>
    <UButton label="Add option" icon="i-lucide-plus" size="sm" color="neutral" variant="ghost" class="mt-1.5" @click="add" />
  </div>
</template>
