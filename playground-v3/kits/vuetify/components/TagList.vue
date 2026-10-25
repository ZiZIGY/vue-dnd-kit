<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import { VSheet } from 'vuetify/components';
  import TagChip from './TagChip.vue';
  import { createTags } from '../../shared/data';

  const tags = ref(createTags());
  const list = useTemplateRef('list');
  const { items } = makeSortableList(list, {
    id: 'tags',
    items: tags,
    getKey: (tag) => tag,
    strategy: 'horizontal',
  });
</script>

<template>
  <section>
    <h2 class="text-subtitle-1 font-weight-bold mb-2">Tags (fragment root: v-tooltip)</h2>
    <VSheet
      ref="list"
      class="d-flex ga-2 pa-2"
      border
      rounded
      data-testid="tags"
    >
      <TagChip
        v-for="tag in items"
        :key="tag"
        :tag="tag"
      />
    </VSheet>
    <pre
      class="text-caption mt-2"
      data-testid="tags-state"
      >{{ tags.join(',') }}</pre
    >
  </section>
</template>
