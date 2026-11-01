<script setup lang="ts">
import { computed, inject, nextTick, useTemplateRef } from 'vue';
import { makeSortableItem, makeSortableList, useDnD } from '@vue-dnd-kit/core';
import Card from './Card.vue';
import CardOverlay from './CardOverlay.vue';
import Composer from './Composer.vue';
import StatusIcon from './StatusIcon.vue';
import { BOARD, type Column } from './store';

const props = defineProps<{ column: Column }>();
const board = inject(BOARD)!;
const { active } = useDnD();

const el = useTemplateRef<HTMLElement>('el');
const grip = useTemplateRef<HTMLElement>('grip');
const list = useTemplateRef<HTMLElement>('list');

// The column is an item of the board's list, dragged by its header...
makeSortableItem(el, { item: () => props.column, handle: grip, type: 'column' });

// ...and holds a list of cards, in one group with the other columns.
const { items, isOver, isAccepting } = makeSortableList(list, {
  id: props.column.id,
  // A getter: the list shows the cards the filters let through, and never writes them.
  // `onDrop` hands each drop to the board, which keeps the hidden cards in their places.
  items: () => props.column.cards.filter(board.matches),
  // `put` sees every card of a multi-drag at once: all of them fit under the limit, or none.
  group: { name: 'cards', put: ({ keys }) => board.fits(props.column, keys) },
  overlay: CardOverlay,
  // Cards that come and go without a drag (filters, Add card, Undo) slide and fade too.
  animate: true,
  // Cards coming into Done wait for an answer: 'accept', 'reject', or 'continue' to keep dragging.
  onBeforeDrop: (event) => (props.column.confirm && !event.sameList ? board.ask(event.items) : 'accept'),
  onDrop: (event) => {
    event.preventDefault();
    board.apply(event);
  },
});

const refusing = computed(() => isOver.value && !isAccepting.value);
const full = computed(() => !!props.column.limit && props.column.cards.length >= props.column.limit);
/** Cards a drag over the column would bring in: the WIP meter lights them up. */
const incoming = computed(() => {
  if (!isOver.value || !isAccepting.value) return 0;
  return active.value?.ids.filter((id) => board.find(id)?.column.id !== props.column.id).length ?? 0;
});

// A card just added shows at the end of the list.
const reveal = async () => {
  await nextTick();
  list.value?.scrollTo({ top: list.value.scrollHeight, behavior: 'smooth' });
};
</script>

<template>
  <section ref="el" class="column" :class="{ over: isOver && isAccepting, refusing }">
    <header ref="grip" class="head" :aria-label="`${column.title}: ${column.cards.length} cards`">
      <StatusIcon :color="column.color" :progress="column.progress" />
      <h3>{{ column.title }}</h3>
      <span class="count" :class="{ full }">
        {{ column.cards.length }}<span v-if="column.limit" class="max">/{{ column.limit }}</span>
      </span>
    </header>
    <!-- The work-in-progress meter: one notch per card the column may hold. -->
    <div v-if="column.limit" class="meter" :title="`At most ${column.limit} cards`" aria-hidden="true">
      <i
        v-for="notch in column.limit"
        :key="notch"
        :class="{ on: notch <= column.cards.length, incoming: notch > column.cards.length && notch <= column.cards.length + incoming }"
      />
    </div>

    <div class="body">
      <!-- Fills the column: the space below the last card takes drops too, and scrolls. -->
      <ul ref="list" class="cards">
        <Card v-for="card in items" :key="card.id" :card="card" :done="!!column.confirm" />
      </ul>
      <p v-if="!items.length" class="empty">
        <template v-if="column.cards.length">No matching cards</template>
        <template v-else>No cards yet<small>Drop one here</small></template>
      </p>
    </div>

    <Composer :column="column" :full="full" @added="reveal" />
  </section>
</template>

<style scoped>
.column {
  --base: light-dark(#f1f1f3, #141417);
  --slot: currentColor;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-radius: 14px;
  /* Its own background: the copy that follows the pointer isn't see-through. */
  background: var(--base);
  box-shadow: inset 0 0 0 1px light-dark(rgb(15 15 20 / 0.05), rgb(255 255 255 / 0.05));
  transition:
    background-color 0.2s,
    box-shadow 0.2s;
}

/* A card drag over a column that takes it: green, and its slot with it. */
.column.over {
  --slot: #42b883;
  background: color-mix(in srgb, #42b883 7%, var(--base));
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #42b883 55%, transparent);
}

/* Over a column at its limit: red, and the cards stay where they were. */
.column.refusing {
  background: color-mix(in srgb, #f43f5e 7%, var(--base));
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #f43f5e 55%, transparent);
}

/* The slot the dragged column will land in. */
.column[data-dnd-placeholder] {
  opacity: 1;
  background: none;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 18%, transparent);
}

.column[data-dnd-placeholder] > * {
  visibility: hidden;
}

/* A column in hand. */
[data-dnd-overlay] .column {
  box-shadow:
    inset 0 0 0 1px light-dark(rgb(15 15 20 / 0.08), rgb(255 255 255 / 0.08)),
    0 30px 60px -24px rgb(0 0 0 / 0.55);
  transition: rotate 0.2s;
}

.head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 6px 0;
  padding: 8px 8px 6px;
  border-radius: 9px;
  cursor: grab;
}

.head:hover {
  background: color-mix(in srgb, currentColor 5%, transparent);
}

.head:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

h3 {
  margin: 0;
  overflow: hidden;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.count {
  margin-left: auto;
  font: 500 12px/1 'Geist Mono', ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}

.max {
  opacity: 0.6;
}

.count.full {
  color: light-dark(#be123c, #fb7185);
  opacity: 1;
}

.meter {
  display: flex;
  gap: 3px;
  margin: 2px 14px 4px;
}

.meter i {
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background: color-mix(in srgb, currentColor 12%, transparent);
  transition: background-color 0.2s;
}

.meter i.on {
  background: color-mix(in srgb, currentColor 45%, transparent);
}

.meter i.incoming {
  background: #42b883;
}

.refusing .meter i {
  background: #f43f5e;
}

.body {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 0;
}

/* Tall enough for a card or two, so an empty column still takes a drop. */
.cards {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-height: 120px;
  margin: 0;
  padding: 6px 10px 10px;
  overflow-y: auto;
  list-style: none;
  overscroll-behavior: contain;
  scrollbar-width: thin;
}

.empty {
  position: absolute;
  inset: 6px 10px auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  margin: 0;
  padding: 22px 12px;
  border: 1.5px dashed color-mix(in srgb, currentColor 14%, transparent);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  opacity: 0.6;
  pointer-events: none;
}

.empty small {
  font-size: 11px;
  font-weight: 400;
  opacity: 0.7;
}

@media (prefers-reduced-motion: no-preference) {
  [data-dnd-overlay='dragging'] .column {
    rotate: 1.5deg;
  }

  /* The column tilts as it is picked up, not only back as it lands. */
  @starting-style {
    [data-dnd-overlay='dragging'] .column {
      rotate: 0deg;
    }
  }

  /* Refusing: the count shakes its head. */
  .refusing .count {
    animation: shake 0.3s;
  }
}

@keyframes shake {
  25% {
    translate: -3px 0;
  }

  75% {
    translate: 3px 0;
  }
}
</style>
