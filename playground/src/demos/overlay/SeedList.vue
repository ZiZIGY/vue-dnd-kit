<script setup lang="ts">
  import { toRef, useTemplateRef } from 'vue';
  import { makeSortableList, type SortableListOptions } from '@vue-dnd-kit/core';
  import SeedRow from './SeedRow.vue';
  import type { Seed, SeedBed } from './seeds';

  const props = defineProps<{ bed: SeedBed; options?: Partial<SortableListOptions<Seed>> }>();
  const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), {
    id: props.bed.id,
    items: toRef(props.bed, 'seeds'),
    group: 'garden',
    ...props.options,
  });
</script>

<template>
  <section
    class="seed-list"
    :data-testid="`bed-${bed.id}`"
  >
    <h3>{{ bed.title }}</h3>
    <ul ref="list">
      <SeedRow
        v-for="item in items"
        :key="item.id"
        :seed="item"
      />
    </ul>
  </section>
</template>

<style scoped>
  .seed-list {
    width: 220px;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-height: 120px;
    padding: 8px;
    margin: 0;
    list-style: none;
    background: #f3f4f6;
    border-radius: 10px;
  }
</style>
