<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, Over } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; over: Over | null }>();

// One summary for any number of mails: the count, the first subject, where they go.
const first = computed(() => props.items[0]?.item as { subject: string });
const count = computed(() => props.items.length);
const action = computed(() => {
  const noun = count.value === 1 ? 'conversation' : 'conversations';
  if (props.over?.id === 'Archive') return `Archive ${count.value} ${noun}`;
  if (props.over?.id === 'Trash') return `Delete ${count.value} ${noun}`;
  return `Move ${count.value} ${noun}`;
});
</script>

<template>
  <!-- The box keeps the row's size; the summary hangs off its middle, by the pointer. -->
  <div class="box">
    <div class="summary" :class="{ stack: count > 1, danger: over?.id === 'Trash' }">
      <span class="count">{{ count }}</span>
      <span class="text">
        <strong>{{ action }}</strong>
        <small>{{ first.subject }}{{ count > 1 ? ` and ${count - 1} more` : '' }}</small>
      </span>
    </div>
  </div>
</template>

<style scoped>
.box {
  position: relative;
  width: 100%;
  height: 100%;
}

.summary {
  --tone: #42b883;
  position: absolute;
  top: calc(50% + 10px);
  left: calc(50% + 10px);
  display: flex;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  width: 230px;
  padding: 8px 12px;
  border-radius: 10px;
  background: Canvas;
  box-shadow:
    0 0 0 1.5px var(--tone),
    0 16px 30px -12px rgb(0 0 0 / 0.55);
  font-size: 13px;
}

.summary.danger {
  --tone: #ef4444;
}

/* Two more sheets behind it when there are several. */
.summary.stack::before,
.summary.stack::after {
  content: '';
  position: absolute;
  z-index: -1;
  inset: 0;
  border-radius: inherit;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 18%, transparent);
}

.summary.stack::before {
  translate: 5px 5px;
}

.summary.stack::after {
  z-index: -2;
  translate: 10px 10px;
}

.count {
  display: grid;
  flex: none;
  place-items: center;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  box-sizing: border-box;
  border-radius: 99px;
  background: var(--tone);
  color: #04130c;
  font: 700 12px/1 system-ui, sans-serif;
}

.danger .count {
  color: #fff;
}

.text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

strong {
  font-weight: 600;
}

small {
  overflow: hidden;
  font-size: 11px;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.6;
}
</style>
