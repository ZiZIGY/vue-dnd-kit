<script setup lang="ts">
import { computed, inject, nextTick, useTemplateRef, watch } from 'vue';
import { makeSortableList, useDnD, useDnDMonitor } from '@vue-dnd-kit/core';
import CardPanel from './CardPanel.vue';
import Column from './Column.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import Filters from './Filters.vue';
import Notice from './Notice.vue';
import SelectionBar from './SelectionBar.vue';
import Trash from './Trash.vue';
import { BOARD } from './store';

const board = inject(BOARD)!;
const { selection, status } = useDnD();

const lanes = useTemplateRef<HTMLElement>('lanes');
// The columns are a sortable list too, side by side: drag a column by its header. A ref,
// unlike the cards: the library writes the new order of the columns itself.
const { items } = makeSortableList(lanes, {
  id: 'columns',
  items: board.columns,
  strategy: 'horizontal',
  axis: 'x',
});

// Cards just dropped into Done play their check once they have landed.
useDnDMonitor({
  onDragSettle: (event) => {
    const target = event.over ? board.column(event.over.id) : undefined;
    if ('dropped' in event && target?.confirm && event.source?.list !== target.id) board.complete(event.accepted);
  },
});

// The filters hide cards: the selection keeps only the cards still shown.
watch([board.query, board.people], () => {
  selection.set([...selection.ids].filter((id) => board.cards.value.some((card) => card.id === id && board.matches(card))));
});

// Closed, the panel gives the focus back to its card.
const close = async () => {
  const id = board.opened.value;
  board.opened.value = null;
  await nextTick();
  lanes.value?.querySelector<HTMLElement>(`[data-card="${id}"]`)?.focus();
};

// Escape closes the panel, then clears the selection. A drag takes its Escape first (it
// cancels the drag), and a key the demo uses doesn't also leave the expanded frame.
const onEscape = (event: KeyboardEvent) => {
  if (event.defaultPrevented || status.value !== 'idle') return;
  if (board.opened.value) void close();
  else if (selection.ids.size) selection.clear();
  else return;
  event.preventDefault();
};

const done = computed(() => board.columns.value.find((column) => column.confirm)?.cards.length ?? 0);
const total = computed(() => board.cards.value.length);
</script>

<template>
  <div class="board" @keydown.esc="onEscape">
    <header class="toolbar">
      <div class="sprint">
        <span class="logo" aria-hidden="true"><i /><i /><i /></span>
        <div class="names">
          <strong>Sprint 24</strong>
          <span class="progress">
            <span class="meter"><span class="meter-fill" :style="{ width: `${(done / Math.max(total, 1)) * 100}%` }" /></span>
            {{ done }} of {{ total }} done
          </span>
        </div>
      </div>
      <Filters />
      <Trash />
    </header>

    <div ref="lanes" class="lanes">
      <Column v-for="column in items" :key="column.id" :column="column" />
    </div>

    <Transition name="panel">
      <CardPanel v-if="board.openedCard.value" :key="board.openedCard.value.id" @close="close" />
    </Transition>

    <div class="dock">
      <Notice />
      <Transition name="rise">
        <SelectionBar v-if="selection.ids.size" />
      </Transition>
    </div>

    <ConfirmDialog v-if="board.question.value" :cards="board.question.value.cards" @answer="board.answer" />
  </div>
</template>

<style scoped>
/*
 * A window of its own: as tall as the frame on the page, and filling the screen when the
 * frame is expanded (its box is then a flex column, which `flex: 1` fills).
 */
.board {
  --surface: light-dark(#fbfbfc, #0e0e10);
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  max-width: 1800px;
  height: 30rem;
  min-height: 0;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 16px;
  background: var(--surface);
  box-shadow:
    0 0 0 1px light-dark(rgb(15 15 20 / 0.08), rgb(255 255 255 / 0.07)),
    0 40px 80px -40px rgb(0 0 0 / 0.45);
  font-size: 13px;
  text-align: left;
  /* Its parts lay out by the board's width, not the screen's. */
  container: board / inline-size;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 16px;
  padding: 12px 14px;
  border-bottom: 1px solid light-dark(rgb(15 15 20 / 0.07), rgb(255 255 255 / 0.06));
}

.sprint {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* A narrow board: the sprint and the trash share the first row, the filters get the next. */
@container board (max-width: 600px) {
  .sprint {
    flex: 1;
  }
}

/* Three columns of a board, in Vue's colors. */
.logo {
  display: flex;
  gap: 2px;
  align-items: flex-start;
  width: 30px;
  height: 30px;
  padding: 7px;
  box-sizing: border-box;
  border-radius: 9px;
  background: linear-gradient(135deg, #42b883, #35495e);
}

.logo i {
  flex: 1;
  height: 100%;
  border-radius: 2px;
  background: rgb(255 255 255 / 0.9);
}

.logo i:nth-child(2) {
  height: 65%;
}

.logo i:nth-child(3) {
  height: 40%;
}

.names {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.names strong {
  font-size: 14px;
  font-weight: 650;
  letter-spacing: -0.01em;
}

.progress {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  opacity: 0.6;
  white-space: nowrap;
}

.meter {
  width: 56px;
  height: 4px;
  overflow: hidden;
  border-radius: 2px;
  background: color-mix(in srgb, currentColor 15%, transparent);
}

.meter-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #42b883;
  transition: width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/*
 * The columns side by side, as wide as there is room for, 236px at least: on a narrow
 * screen the board scrolls sideways, as boards do. Each column is as tall as the board, and
 * its cards scroll inside it.
 */
.lanes {
  display: grid;
  flex: 1;
  grid-auto-columns: minmax(236px, 1fr);
  grid-auto-flow: column;
  grid-template-rows: minmax(0, 1fr);
  gap: 12px;
  min-height: 0;
  padding: 14px;
  overflow-x: auto;
}

/* The selection bar and the notices, floating over the bottom of the board. */
.dock {
  position: absolute;
  right: 12px;
  bottom: 14px;
  left: 12px;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}

.dock > * {
  pointer-events: auto;
}

.panel-enter-active,
.panel-leave-active {
  transition:
    opacity 0.2s,
    translate 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  translate: 24px 0;
}

.rise-enter-active,
.rise-leave-active {
  transition:
    opacity 0.2s,
    translate 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.rise-enter-from,
.rise-leave-to {
  opacity: 0;
  translate: 0 10px;
}

@media (prefers-reduced-motion: reduce) {
  .panel-enter-from,
  .panel-leave-to,
  .rise-enter-from,
  .rise-leave-to {
    translate: none;
  }
}
</style>
