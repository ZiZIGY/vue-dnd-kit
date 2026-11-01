<script setup lang="ts">
import { computed, inject } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';
import Icon from './Icon.vue';
import StatusIcon from './StatusIcon.vue';
import { BOARD, useMove } from './store';

// What to do with the selected cards, without dragging them.
const board = inject(BOARD)!;
const { selection } = useDnD();
const move = useMove();
const ids = computed(() => [...selection.ids]);

const remove = () => {
  board.remove(ids.value);
  selection.clear();
};
</script>

<template>
  <div class="selection" role="toolbar" aria-label="Selected cards">
    <span class="total"><b>{{ ids.length }}</b> selected</span>
    <span class="split" />
    <span class="caption">Move to</span>
    <button
      v-for="column in board.columns.value"
      :key="column.id"
      type="button"
      class="tool"
      :title="board.fits(column, ids) ? column.title : `${column.title} is full`"
      :aria-label="`Move to ${column.title}`"
      :disabled="!board.fits(column, ids)"
      @click="move(ids, column)"
    >
      <StatusIcon :color="column.color" :progress="column.progress" />
    </button>
    <span class="split" />
    <button type="button" class="tool danger" @click="remove"><Icon name="trash" /><span class="word">Delete</span></button>
    <button type="button" class="tool" aria-label="Clear the selection" title="Clear (Esc)" @click="selection.clear()">
      <Icon name="close" />
    </button>
  </div>
</template>

<style scoped>
.selection {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 5px;
  border-radius: 12px;
  background: light-dark(#18181b, #f4f4f5);
  box-shadow: 0 16px 40px -12px rgb(0 0 0 / 0.55);
  color: light-dark(#fafafa, #18181b);
  font-size: 12px;
  white-space: nowrap;
}

.total {
  padding: 0 8px 0 6px;
}

.total b {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  margin-right: 6px;
  padding: 0 5px;
  box-sizing: border-box;
  border-radius: 6px;
  background: #42b883;
  color: #fff;
  font: 700 11px/1 'Geist Mono', ui-monospace, Menlo, Consolas, monospace;
}

.split {
  width: 1px;
  height: 18px;
  margin: 0 4px;
  background: currentColor;
  opacity: 0.18;
}

.caption {
  padding: 0 4px;
  opacity: 0.6;
}

.tool {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  min-width: 30px;
  justify-content: center;
  padding: 0 8px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: inherit;
  font: 600 12px/1 system-ui, sans-serif;
  cursor: pointer;
}

.tool:hover:not(:disabled) {
  background: color-mix(in srgb, currentColor 12%, transparent);
}

.tool:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.tool:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.danger {
  color: light-dark(#fb7185, #e11d48);
}

@media (max-width: 480px) {
  .caption,
  .word {
    display: none;
  }
}
</style>
