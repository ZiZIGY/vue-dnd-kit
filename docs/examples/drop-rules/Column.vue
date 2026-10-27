<script setup lang="ts">
import { ref, toRef, useTemplateRef } from 'vue';
import { makeSortableList, type SortableGroupOptions } from '@vue-dnd-kit/core';
import Card from './Card.vue';

interface Pull {
  id: string;
  title: string;
  approved: boolean;
}

const props = defineProps<{
  column: { id: string; title: string; rule?: 'put' | 'onBeforeDrop'; pulls: Pull[] };
}>();

const approved = (pulls: Pull[]) => pulls.every((pull) => pull.approved);

// The same rule, two ways.
// `group.put`: asked while dragging. A refused drag never enters the list.
const group: SortableGroupOptions =
  props.column.rule === 'put'
    ? { name: 'merge', put: ({ items }) => approved(items as Pull[]) }
    : { name: 'merge' };

const notice = ref('');
const list = useTemplateRef<HTMLElement>('list');
const { items, isOver, isAccepting } = makeSortableList(list, {
  id: props.column.id,
  items: toRef(props.column, 'pulls'),
  group,
  // `onBeforeDrop`: asked on release. The drag enters the list, then flies back.
  onBeforeDrop: (event) => {
    if (props.column.rule !== 'onBeforeDrop' || approved(event.items)) return 'accept';
    notice.value = `${event.items[0]!.title}: sent back`;
    return 'reject';
  },
});
</script>

<template>
  <section class="column" :class="{ over: isOver && isAccepting, refuses: isOver && !isAccepting }">
    <h3>{{ column.title }}</h3>
    <code v-if="column.rule" class="rule">{{ column.rule === 'put' ? 'group.put' : 'onBeforeDrop' }}</code>
    <ul ref="list" class="pulls">
      <Card v-for="pull in items" :key="pull.id" :pull="pull" />
    </ul>
    <p v-if="column.rule === 'onBeforeDrop'" class="notice" role="status">{{ notice }}</p>
    <p v-else-if="column.rule === 'put'" class="notice refused">{{ isOver && !isAccepting ? 'Not approved: refused' : '' }}</p>
  </section>
</template>

<style scoped>
.column {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 10px;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, transparent);
  transition:
    border-color 0.2s,
    background 0.2s;
}

.column.over {
  border-color: color-mix(in srgb, #42b883 60%, transparent);
}

.column.refuses {
  border-color: color-mix(in srgb, #e5484d 70%, transparent);
  background: color-mix(in srgb, #e5484d 6%, transparent);
}

h3 {
  margin: 2px 4px 4px;
  font-size: 13px;
  font-weight: 600;
}

.rule {
  align-self: flex-start;
  margin: 0 4px 10px;
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  color: #42b883;
}

.pulls {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 170px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.notice {
  min-height: 15px;
  margin: 8px 4px 0;
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.7;
}

.notice.refused {
  color: #e5484d;
  opacity: 1;
}
</style>
