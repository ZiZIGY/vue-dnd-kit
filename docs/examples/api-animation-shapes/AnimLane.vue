<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import LaneRow from './LaneRow.vue';

const rows = defineModel<{ id: string; hue: number }[]>({ required: true });
defineProps<{ label: string }>();

const list = useTemplateRef<HTMLElement>('list');
// No options of its own: the list takes `animation` and `animate` from its provider.
const { items } = makeSortableList(list, { items: rows });
</script>

<template>
  <section class="lane">
    <code>{{ label }}</code>
    <ul ref="list">
      <LaneRow v-for="row in items" :key="row.id" :row="row" />
    </ul>
  </section>
</template>

<style scoped>
.lane {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 4%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 10%, transparent);
}

code {
  overflow: hidden;
  font: 600 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #42b883;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
