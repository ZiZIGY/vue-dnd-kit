<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import IssueRow from './IssueRow.vue';

const issues = ref([
  { id: 'VDK-41', title: 'Touch drags start too early on iPad', status: 'In progress' as const, who: 'MC', priority: 1 as const },
  { id: 'VDK-38', title: 'Keyboard drop between lists', status: 'Todo' as const, who: 'LP', priority: 2 as const },
  { id: 'VDK-36', title: 'Virtual list keeps the dragged row', status: 'Todo' as const, who: 'NK', priority: 2 as const },
  { id: 'VDK-33', title: 'Docs: styling recipes', status: 'Done' as const, who: 'SR', priority: 3 as const },
  { id: 'VDK-29', title: 'Overlay fits the target slot', status: 'Done' as const, who: 'MC', priority: 3 as const },
]);

const body = useTemplateRef<HTMLElement>('body');
// Indicator mode: the rows stay put while you drag, and `indicator` says where the drop
// goes. The rows draw the line themselves.
const { items, indicator } = makeSortableList(body, { items: issues, placeholder: 'indicator' });
</script>

<template>
  <div class="issues" role="table">
    <div class="head" role="row">
      <span />
      <span>Key</span>
      <span>Title</span>
      <span>Status</span>
      <span />
    </div>
    <div ref="body" role="rowgroup">
      <IssueRow v-for="issue in items" :key="issue.id" :issue="issue" />
    </div>
    <code class="readout">
      indicator: {{ indicator ? `{ index: ${indicator.index}, key: '${indicator.key}', side: '${indicator.side}' }` : 'null' }}
    </code>
  </div>
</template>

<style scoped>
.issues {
  overflow: hidden;
  width: 560px;
  max-width: 100%;
  margin: 0 auto;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 2%, Canvas);
}

.head {
  display: grid;
  grid-template-columns: 18px 58px minmax(0, 1fr) 84px 24px;
  gap: 10px;
  padding: 10px 12px;
  font: 600 10px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.5;
}

.readout {
  display: block;
  padding: 10px 12px;
  border-top: 1px solid color-mix(in srgb, currentColor 9%, transparent);
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  color: #42b883;
  white-space: nowrap;
  overflow-x: auto;
}
</style>
