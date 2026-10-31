<script setup lang="ts">
import { computed, h, toRef, useTemplateRef, type FunctionalComponent } from 'vue';
import { makeSortableList, type Key, type OverlayProps } from '@vue-dnd-kit/core';
import TaskCard from './TaskCard.vue';
import CardPile from './CardPile.vue';
import FitBadge from './FitBadge.vue';

const props = defineProps<{
  column: { id: string; name: string; limit?: number; cards: Array<{ id: string; title: string; tag: 'bug' | 'feature' | 'chore' }> };
}>();
const emit = defineEmits<{ notice: [text: string] }>();

/** Room left for these cards: those already in the column don't count twice. */
const room = (keys: Key[]) => props.column.limit! - props.column.cards.filter((card) => !keys.includes(card.id)).length;
const full = computed(() => !!props.column.limit && props.column.cards.length >= props.column.limit);

// Over a column with a limit, the pile gets a badge: does it fit? A function is a
// functional component: it hands FitBadge what only the column knows.
const fit: FunctionalComponent<OverlayProps> = (overlay, { slots }) =>
  h(
    FitBadge,
    {
      count: overlay.items.length,
      room: room(overlay.items.map((item) => item.id)),
      limit: props.column.limit!,
      status: overlay.status,
    },
    slots,
  );

const list = useTemplateRef<HTMLElement>('list');
const { items, isOver } = makeSortableList(list, {
  id: props.column.id,
  items: toRef(props.column, 'cards'),
  group: {
    name: 'board',
    // A full column takes nothing: over it the pile turns red (CardPile).
    put: ({ keys, from, to }) => !props.column.limit || from === to || room(keys) > 0,
  },
  // The other picked cards fly into the overlay: a pile.
  multiple: 'stack',
  overlay: CardPile,
  overOverlay: props.column.limit ? fit : undefined,
  // Room for some of them: the column takes as many as fit, the others fly back.
  onBeforeDrop: (event) => {
    const { limit } = props.column;
    if (!limit || event.sameList) return true;
    const free = room(event.keys);
    if (free >= event.keys.length) return true;
    emit('notice', `${props.column.name} took ${free} of ${event.keys.length}: WIP limit ${limit}`);
    return event.keys.slice(0, free);
  },
});
</script>

<template>
  <section class="column" :class="{ over: isOver, full }">
    <h3>
      {{ column.name }}
      <span class="count">{{ column.cards.length }}<template v-if="column.limit"> / {{ column.limit }}</template></span>
    </h3>
    <ul ref="list" class="cards">
      <TaskCard v-for="card in items" :key="card.id" :card="card" />
    </ul>
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
  transition:
    border-color 0.2s,
    background-color 0.2s;
}

.column.over {
  border-color: color-mix(in srgb, #42b883 60%, transparent);
  background: color-mix(in srgb, #42b883 6%, transparent);
}

h3 {
  display: flex;
  align-items: center;
  margin: 2px 4px 10px;
  font-size: 13px;
  font-weight: 600;
}

.count {
  margin-left: auto;
  padding: 3px 7px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
}

/* At its limit: the count says so. */
.full .count {
  background: color-mix(in srgb, #f59e0b 22%, transparent);
  color: #f59e0b;
}

.cards {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-height: 150px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
