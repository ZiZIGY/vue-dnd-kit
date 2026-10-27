<script setup lang="ts">
import { computed, ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import Channels from './Channels.vue';

const OPTIONS = {
  threshold: [0.1, 0.2, 0.4],
  maxSpeed: [10, 25, 50],
  acceleration: [4, 10, 25],
} as const;

const on = ref(true);
// The defaults: an edge zone of 20% of the container (24 to 96px), 10px a frame at the
// edge, up to 25px a frame past it.
const options = ref({ threshold: 0.2, maxSpeed: 25, acceleration: 10 });
const autoScroll = computed(() => (on.value ? options.value : false));
const call = computed(() =>
  on.value
    ? `:auto-scroll="{ threshold: ${options.value.threshold}, maxSpeed: ${options.value.maxSpeed}, acceleration: ${options.value.acceleration} }"`
    : ':auto-scroll="false"',
);
</script>

<template>
  <DnDProvider :auto-scroll="autoScroll">
    <div class="demo">
      <div class="switches">
        <label class="switch">
          <input v-model="on" type="checkbox" />
          autoScroll
        </label>
        <fieldset v-for="(values, name) in OPTIONS" :key="name" :disabled="!on">
          <legend>{{ name }}</legend>
          <label v-for="value in values" :key="value" :class="{ on: options[name] === value }">
            <input v-model="options[name]" type="radio" :value="value" />
            {{ value }}
          </label>
        </fieldset>
      </div>
      <code class="call">{{ call }}</code>
      <Channels :threshold="on ? options.threshold : 0" />
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
  gap: 10px 14px;
}

fieldset {
  display: inline-flex;
  margin: 0;
  padding: 3px;
  border: 0;
  border-radius: 9px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

fieldset:disabled {
  opacity: 0.4;
}

legend {
  float: left;
  align-self: center;
  padding: 0 8px 0 6px;
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}

fieldset label {
  padding: 5px 9px;
  border-radius: 6px;
  font: 12px/1.2 ui-monospace, Menlo, Consolas, monospace;
  cursor: pointer;
}

fieldset label.on {
  background: Canvas;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
  font-weight: 600;
}

fieldset label:has(input:focus-visible),
.switch:has(input:focus-visible) {
  outline: 2px solid #42b883;
}

fieldset input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.switch {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 9px;
  background: color-mix(in srgb, currentColor 7%, transparent);
  font: 12px/1.2 ui-monospace, Menlo, Consolas, monospace;
  cursor: pointer;
}

.switch input {
  accent-color: #42b883;
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
