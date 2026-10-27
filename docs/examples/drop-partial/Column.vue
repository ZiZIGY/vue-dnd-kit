<script setup lang="ts">
import { ref, toRef, useTemplateRef } from 'vue';
import { makeSortableList, useDnD } from '@vue-dnd-kit/core';
import ChangeRow from './ChangeRow.vue';

interface Change {
  id: string;
  title: string;
  approved: boolean;
}

const props = defineProps<{ column: { id: string; title: string; approvedOnly?: boolean; changes: Change[] } }>();

const notice = ref('');
const { selection } = useDnD();
const list = useTemplateRef<HTMLElement>('list');
const { items, isOver } = makeSortableList(list, {
  id: props.column.id,
  items: toRef(props.column, 'changes'),
  group: 'release',
  // Some keys: those land, the others fly back to where they came from.
  onBeforeDrop: (event) => {
    if (!props.column.approvedOnly || event.sameList) return 'accept';
    const approved = event.items.filter((change) => change.approved).map((change) => change.id);
    // No keys at all: nothing lands, and `onDrop` isn't called.
    if (!approved.length) notice.value = 'Nothing shipped: not approved';
    return approved;
  },
  onDrop: (event) => {
    if (!props.column.approvedOnly || event.sameList) return;
    // The changes sent back stay selected.
    selection.delete(...event.accepted);
    notice.value = event.rejected.length
      ? `${event.accepted.length} shipped, ${event.rejected.length} sent back: not approved`
      : `${event.accepted.length} shipped`;
  },
});
</script>

<template>
  <section class="column" :class="{ over: isOver }">
    <h3>
      {{ column.title }}
      <span v-if="column.approvedOnly" class="rule">approved only</span>
    </h3>
    <ul ref="list" class="changes">
      <ChangeRow v-for="change in items" :key="change.id" :change="change" />
    </ul>
    <p v-if="column.approvedOnly" class="notice" role="status">{{ notice }}</p>
  </section>
</template>

<style scoped>
.column {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, transparent);
  transition: border-color 0.2s;
}

.column.over {
  border-color: color-mix(in srgb, #42b883 60%, transparent);
}

h3 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2px 4px 10px;
  font-size: 13px;
  font-weight: 600;
}

.rule {
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  font-weight: 400;
  opacity: 0.55;
}

.changes {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 190px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.notice {
  min-height: 15px;
  margin: 10px 4px 0;
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  color: #42b883;
}
</style>
