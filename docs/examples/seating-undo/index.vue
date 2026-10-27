<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Table from './Table.vue';
import { createSeating } from './store';

const seating = createSeating();
const { state, undo } = seating;
</script>

<template>
  <DnDProvider>
    <div class="seating">
      <div class="tables">
        <Table id="a" title="Table A" :seating="seating" />
        <Table id="b" title="Table B" :seating="seating" />
      </div>
      <section class="history">
        <header>
          <h4>History</h4>
          <button type="button" :disabled="!state.history.length" @click="undo">Undo</button>
        </header>
        <ol>
          <li v-for="(entry, index) in state.history" :key="state.history.length - index">{{ entry.label }}</li>
          <li v-if="!state.history.length" class="none">Move a guest</li>
        </ol>
      </section>
    </div>
  </DnDProvider>
</template>

<style scoped>
.seating {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 460px;
  max-width: 100%;
  margin: 0 auto;
}

.tables {
  display: flex;
  gap: 12px;
}

.history {
  padding: 10px 12px;
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 5%, transparent);
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h4 {
  margin: 0;
  font: 600 11px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
}

button {
  padding: 5px 12px;
  border: 0;
  border-radius: 7px;
  background: #42b883;
  color: #fff;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  background: color-mix(in srgb, currentColor 12%, transparent);
  color: inherit;
  opacity: 0.5;
  cursor: default;
}

ol {
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 66px;
  margin: 8px 0 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
  font: 12px/1.4 ui-monospace, Menlo, Consolas, monospace;
}

li:first-child {
  color: #42b883;
}

li.none {
  color: inherit;
  opacity: 0.5;
}
</style>
