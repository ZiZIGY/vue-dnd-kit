<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useKeyModifier } from '@vueuse/core';
import { useDnD } from '@vue-dnd-kit/core';
import Day from './Day.vue';
import { DAYS } from './trip';

const days = reactive(structuredClone(DAYS));

// The drag, read anywhere under the provider: what the gestures are doing right now.
const { status, active, selection } = useDnD();
const alt = useKeyModifier('Alt');
const selected = computed(() => selection.ids.size);
const byKeys = computed(() => status.value === 'dragging' && active.value?.sensor === 'keyboard');
</script>

<template>
  <div class="trip">
    <div class="days">
      <Day v-for="day in days" :key="day.id" :day="day" />
    </div>
    <footer class="gestures">
      <span :class="{ on: selected }">
        <kbd>Ctrl/⌘</kbd> + click
        <b>{{ selected ? `${selected} selected` : 'select' }}</b>
        <button v-if="selected" type="button" aria-label="Clear the selection" @click="selection.clear()">×</button>
      </span>
      <span :class="{ on: alt && status === 'dragging' }"><kbd>Alt</kbd> + drag <b>copy</b></span>
      <span :class="{ on: byKeys }"><kbd>Space</kbd> + arrows <b>keyboard</b></span>
    </footer>
  </div>
</template>

<style scoped>
.trip {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 660px;
  margin: 0 auto;
}

/* Three columns; on a phone they keep their width and scroll sideways. */
.days {
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 10px;
  overflow-x: auto;
}

.gestures {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
}

.gestures span {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 6px 5px 8px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 5%, transparent);
  transition:
    background 0.2s,
    color 0.2s;
}

.gestures span.on {
  background: color-mix(in srgb, #42b883 16%, transparent);
  color: #42b883;
}

kbd {
  padding: 2px 5px;
  border: 1px solid color-mix(in srgb, currentColor 25%, transparent);
  border-bottom-width: 2px;
  border-radius: 5px;
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
}

b {
  padding: 2px 6px;
  border-radius: 99px;
  font: 600 11px/1.2 ui-monospace, Menlo, Consolas, monospace;
}

.gestures button {
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: color-mix(in srgb, currentColor 14%, transparent);
  color: inherit;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
}
</style>
