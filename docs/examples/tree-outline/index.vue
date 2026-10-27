<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider, type TreeNesting } from '@vue-dnd-kit/core';
import Outline from './Outline.vue';

const nesting = ref<TreeNesting>('both');
const indentation = ref(24);
</script>

<template>
  <DnDProvider>
    <div class="demo">
      <div class="switches">
        <fieldset>
          <legend>nesting</legend>
          <label v-for="value in ['both', 'offset', 'hover'] as const" :key="value" :class="{ on: nesting === value }">
            <input v-model="nesting" type="radio" :value="value" />
            {{ value }}
          </label>
        </fieldset>
        <fieldset>
          <legend>indentation</legend>
          <label v-for="value in [16, 24, 40]" :key="value" :class="{ on: indentation === value }">
            <input v-model="indentation" type="radio" :value="value" />
            {{ value }}
          </label>
        </fieldset>
      </div>
      <code class="call">makeSortableTree(el, { nesting: '{{ nesting }}', indentation: {{ indentation }}, maxDepth: 2 })</code>
      <Outline :nesting="nesting" :indentation="indentation" />
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

.switches {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 16px;
}

fieldset {
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

label {
  padding: 5px 9px;
  border-radius: 6px;
  font: 12px/1.2 ui-monospace, Menlo, Consolas, monospace;
  cursor: pointer;
}

label.on {
  background: Canvas;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
  font-weight: 600;
}

label:has(input:focus-visible) {
  outline: 2px solid #42b883;
}

input {
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
