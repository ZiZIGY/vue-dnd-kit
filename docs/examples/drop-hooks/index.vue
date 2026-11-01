<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import Monitor from './Monitor.vue';
import Notes from './Notes.vue';
import { ANSWERS, type Answer } from './types';

const monitorAnswer = ref<Answer>('accept');
const targetAnswer = ref<Answer>('accept');

// Every hook of the last drop, in the order they ran.
const steps = ref<{ who: string; what: string }[]>([]);
const trace = (who: string, what: string) => steps.value.push({ who, what });
</script>

<template>
  <DnDProvider
    @drag-start="steps = []"
    @drag-end="trace('provider', '@drag-end')"
    @drag-cancel="trace('provider', '@drag-cancel')"
    @drag-settle="trace('provider', '@drag-settle: landed')"
  >
    <div class="demo">
      <div class="switches">
        <fieldset>
          <legend>monitor answers</legend>
          <label v-for="value in ANSWERS" :key="value" :class="{ on: monitorAnswer === value }">
            <input v-model="monitorAnswer" type="radio" :value="value" />
            {{ value }}
          </label>
        </fieldset>
        <fieldset>
          <legend>target answers</legend>
          <label v-for="value in ANSWERS" :key="value" :class="{ on: targetAnswer === value }">
            <input v-model="targetAnswer" type="radio" :value="value" />
            {{ value }}
          </label>
        </fieldset>
      </div>
      <div class="layout">
        <Notes :answer="targetAnswer" :trace="trace" />
        <ol class="steps" aria-label="Hooks of the last drop">
          <li v-for="(step, index) in steps" :key="index">
            <span class="who">{{ step.who }}</span>{{ step.what }}
          </li>
          <li v-if="!steps.length" class="empty">Move a note, or drop one in the trash</li>
        </ol>
      </div>
      <Monitor :answer="monitorAnswer" :trace="trace" />
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
  padding: 5px 10px;
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

.layout {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 16px;
}

.steps {
  box-sizing: border-box;
  min-width: 220px;
  min-height: 150px;
  margin: 0;
  padding: 10px 14px 10px 32px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 5%, transparent);
  font: 11px/1.8 ui-monospace, Menlo, Consolas, monospace;
  white-space: nowrap;
  list-style: decimal;
}

.steps li::marker {
  color: color-mix(in srgb, currentColor 45%, transparent);
}

.who {
  display: inline-block;
  min-width: 60px;
  color: #42b883;
}

.steps li.empty {
  margin-left: -18px;
  list-style: none;
  opacity: 0.45;
}
</style>
