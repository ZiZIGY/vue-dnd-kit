<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import SelectionZone from './SelectionZone.vue';

interface Item {
  id: number;
  label: string;
}

const LABELS = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];

const toggleItems = ref<Item[]>(
  LABELS.map((label, i) => ({ id: i + 1, label }))
);
const selectItems = ref<Item[]>(
  LABELS.map((label, i) => ({ id: i + 10, label }))
);
</script>

<template>
  <DnDProvider>
    <div class="hint">
      Hold <kbd>Ctrl</kbd> and drag to rubber-band select. Compare how each
      strategy handles the selection as you move the box.
    </div>

    <div class="grid">
      <SelectionZone v-model="toggleItems" strategy="toggle" label="Toggle" />
      <SelectionZone v-model="selectItems" strategy="select" label="Select" />
    </div>

    <div class="legend">
      <div class="legend-row">
        <span class="dot dot--toggle" />
        <span
          ><strong>toggle</strong> — XOR with initial selection. Drag back over
          an item to deselect it.</span
        >
      </div>
      <div class="legend-row">
        <span class="dot dot--select" />
        <span
          ><strong>select</strong> — only what's currently inside the box.
          Moving away deselects immediately.</span
        >
      </div>
    </div>
  </DnDProvider>
</template>

<style scoped>
.hint {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 560px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.legend {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.legend-row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.dot {
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 4px;
}

.dot--toggle {
  background: var(--vp-c-brand-1);
}
.dot--select {
  background: #f59e0b;
}

kbd {
  display: inline-block;
  padding: 0.1rem 0.35rem;
  font-size: 0.78rem;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  font-family: var(--vp-font-family-mono);
}
</style>
