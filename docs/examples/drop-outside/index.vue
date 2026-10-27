<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider, type DropOutside } from '@vue-dnd-kit/core';
import Dock from './Dock.vue';

const MODES: DropOutside[] = ['placeholder', 'cancel', 'remove'];
const dropOutside = ref<DropOutside>('remove');
</script>

<template>
  <DnDProvider>
    <div class="demo">
      <fieldset class="modes">
        <legend>dropOutside</legend>
        <label v-for="value in MODES" :key="value" :class="{ on: dropOutside === value }">
          <input v-model="dropOutside" type="radio" :value="value" />
          {{ value }}
        </label>
      </fieldset>
      <code class="call">makeSortableList(dock, { strategy: 'horizontal', dropOutside: '{{ dropOutside }}' })</code>
      <Dock :drop-outside="dropOutside" />
    </div>
  </DnDProvider>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.modes {
  display: inline-flex;
  margin: 0;
  padding: 3px;
  border: 0;
  border-radius: 9px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

legend {
  float: left;
  align-self: center;
  padding: 0 8px 0 6px;
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}

.modes label {
  padding: 5px 10px;
  border-radius: 6px;
  font: 12px/1.2 ui-monospace, Menlo, Consolas, monospace;
  cursor: pointer;
}

.modes label.on {
  background: Canvas;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
  font-weight: 600;
}

.modes label:has(input:focus-visible) {
  outline: 2px solid #42b883;
}

.modes input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.call {
  max-width: 100%;
  padding: 6px 10px;
  overflow-x: auto;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 6%, transparent);
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  white-space: nowrap;
  color: #42b883;
}
</style>
