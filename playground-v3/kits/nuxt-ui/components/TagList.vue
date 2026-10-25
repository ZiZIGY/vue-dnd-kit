<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import TagBadge from './TagBadge.vue';
  import { createTags } from '../../shared/data';

  const tags = ref(createTags());
  const list = useTemplateRef<HTMLElement>('list');
  const { items } = makeSortableList(list, {
    id: 'tags',
    items: tags,
    getKey: (tag) => tag,
    strategy: 'horizontal',
  });
</script>

<template>
  <section>
    <h2 class="mb-2 font-semibold text-highlighted">Tags (fragment root: UTooltip)</h2>
    <div
      ref="list"
      class="flex gap-2 rounded-md border border-dashed border-default p-2"
      data-testid="tags"
    >
      <TagBadge
        v-for="tag in items"
        :key="tag"
        :tag="tag"
      />
    </div>
    <pre
      class="mt-2 text-xs text-muted"
      data-testid="tags-state"
      >{{ tags.join(',') }}</pre
    >
  </section>
</template>
