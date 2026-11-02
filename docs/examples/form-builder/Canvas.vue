<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import FormRow from './FormRow.vue';
import NewRowZone from './NewRowZone.vue';
import { ROWS, useForm } from './form';

/** The page being built: its title, its rows of fields, and the space below them. */
defineProps<{ stacked: boolean }>();
const form = useForm();

const list = useTemplateRef<HTMLElement>('list');
// The rows, in a group of their own: a row moves by its grip, and the others slide out of
// its way. Fields and rows never mix, so neither enters the other's lists.
const { items } = makeSortableList(list, {
  id: ROWS,
  items: () => form.state.rows,
  group: 'rows',
  axis: 'y',
  animateChanges: true,
  onDrop: form.drop,
});
</script>

<template>
  <section aria-label="Form" class="h-full overflow-y-auto bg-muted px-3 py-5 @lg:px-8 @lg:py-8" @click.self="form.select(null)">
    <article
      class="mx-auto flex min-h-full max-w-2xl flex-col rounded-lg bg-default py-6 pr-5 pl-8 shadow-sm ring ring-default @lg:px-10 @lg:py-8"
      @click.self="form.select(null)"
    >
      <UInput
        :model-value="form.state.title"
        variant="none"
        placeholder="Untitled form"
        aria-label="Form title"
        :ui="{ base: 'p-0 text-xl font-bold tracking-tight text-highlighted @lg:text-2xl' }"
        @update:model-value="form.editHeader({ title: String($event) })"
      />
      <UTextarea
        :model-value="form.state.description"
        variant="none"
        placeholder="Add a description"
        aria-label="Form description"
        :rows="1"
        autoresize
        :ui="{ base: 'mt-1 resize-none p-0 text-sm text-muted' }"
        @update:model-value="form.editHeader({ description: String($event) })"
      />

      <div ref="list" class="mt-6 flex flex-col gap-3" :class="{ 'mb-3': items.length }">
        <FormRow v-for="(row, index) in items" :key="row.id" :row="row" :index="index" :stacked="stacked" />
      </div>
      <NewRowZone :before="null" />

      <!-- A picture of the form's button: the preview's is the real one. -->
      <div class="mt-5 flex" aria-hidden="true">
        <UButton label="Submit" tabindex="-1" class="pointer-events-none" />
      </div>
    </article>
  </section>
</template>
