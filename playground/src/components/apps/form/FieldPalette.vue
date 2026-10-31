<script setup lang="ts">
  import { inject, ref, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import PaletteItem from './PaletteItem.vue';
  import { FORM_BUILDER, createPalette } from './form';

  const builder = inject(FORM_BUILDER)!;
  const templates = ref(createPalette());

  const el = useTemplateRef<HTMLElement>('el');
  const { items } = makeSortableList(el, {
    id: 'palette',
    items: templates,
    // Dragging out leaves the template in place and inserts a new field; nothing comes back in.
    group: { name: 'form', pull: 'clone', put: false },
    sort: false,
    clone: builder.fromTemplate,
  });
</script>

<template>
  <ul
    ref="el"
    class="fb-palette"
    data-testid="palette"
  >
    <PaletteItem
      v-for="template in items"
      :key="template.id"
      :template="template"
    />
  </ul>
</template>

<style scoped>
  .fb-palette {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
</style>
