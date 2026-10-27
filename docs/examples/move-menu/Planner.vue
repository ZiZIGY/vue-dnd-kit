<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';
import Column from './Column.vue';

const columns = reactive([
  {
    id: 'this',
    title: 'This week',
    tasks: [
      { id: 'auth', title: 'Passkey sign-in', points: 5 },
      { id: 'search', title: 'Search filters', points: 3 },
      { id: 'icons', title: 'New app icons', points: 2 },
    ],
  },
  {
    id: 'next',
    title: 'Next week',
    tasks: [
      { id: 'export', title: 'Export to PDF', points: 3 },
      { id: 'audit', title: 'Accessibility audit', points: 5 },
    ],
  },
]);
const otherOf = (id: string) => columns.find((column) => column.id !== id)!;

// The keys only drive keyboard drags: show them while one runs.
const { status, active } = useDnD();
const byKeys = computed(() => status.value === 'dragging' && active.value?.sensor === 'keyboard');
</script>

<template>
  <div class="planner">
    <div class="columns">
      <Column v-for="column in columns" :key="column.id" :column="column" :other="otherOf(column.id)" />
    </div>
    <p class="keys" :class="{ on: byKeys }">
      <span><kbd>↑</kbd><kbd>↓</kbd> move</span>
      <span><kbd>←</kbd><kbd>→</kbd> other week</span>
      <span><kbd>Space</kbd> drop</span>
      <span><kbd>Esc</kbd> cancel</span>
    </p>
  </div>
</template>

<style scoped>
.planner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: 100%;
}

.columns {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  width: 100%;
}

.keys {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px 16px;
  margin: 0;
  font-size: 12px;
  opacity: 0.35;
  transition: opacity 0.2s;
}

.keys.on {
  opacity: 1;
}

kbd {
  margin-right: 3px;
  padding: 2px 6px;
  border: 1px solid color-mix(in srgb, currentColor 25%, transparent);
  border-bottom-width: 2px;
  border-radius: 5px;
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
}

.keys.on kbd {
  border-color: #42b883;
  color: #42b883;
}
</style>
