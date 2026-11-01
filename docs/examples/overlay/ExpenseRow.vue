<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ id: string; trend: number[] }>();
const name = defineModel<string>('name', { required: true });
const amount = defineModel<number>('amount', { required: true });
const paid = defineModel<boolean>('paid', { required: true });
const emit = defineEmits<{ remove: [] }>();

const el = useTemplateRef<HTMLElement>('el');
// The fields keep their presses: the row is dragged by its grip.
makeSortableItem(el, { id: () => props.id, handle: '.grip' });

// The last six months, drawn once on a canvas: the clone copies its pixels.
const canvas = useTemplateRef<HTMLCanvasElement>('canvas');
onMounted(() => {
  const element = canvas.value!;
  const context = element.getContext('2d')!;
  const { width, height } = element;
  const max = Math.max(...props.trend, 1);
  const points = props.trend.map((value, index) => [
    (index / (props.trend.length - 1)) * (width - 4) + 2,
    height - 3 - (value / max) * (height - 6),
  ]);
  context.lineWidth = 2;
  context.lineJoin = 'round';
  context.strokeStyle = '#42b883';
  context.beginPath();
  points.forEach(([x, y], index) => (index ? context.lineTo(x!, y!) : context.moveTo(x!, y!)));
  context.stroke();
});
</script>

<template>
  <tr ref="el" class="row">
    <td>
      <button type="button" class="grip" aria-label="Move">
        <svg viewBox="0 0 10 16" aria-hidden="true">
          <circle cx="3" cy="3" r="1.4" /><circle cx="7" cy="3" r="1.4" /><circle cx="3" cy="8" r="1.4" />
          <circle cx="7" cy="8" r="1.4" /><circle cx="3" cy="13" r="1.4" /><circle cx="7" cy="13" r="1.4" />
        </svg>
      </button>
    </td>
    <td><input v-model="name" class="name" aria-label="Expense" /></td>
    <td><input v-model.number="amount" class="amount" type="number" min="0" aria-label="Amount" /></td>
    <td class="center"><input v-model="paid" type="checkbox" aria-label="Paid" /></td>
    <td><canvas ref="canvas" width="72" height="22" aria-hidden="true" /></td>
    <td class="center">
      <!-- Stays behind: the clone leaves it out. -->
      <button type="button" class="remove" aria-label="Remove" data-dnd-no-clone @click="emit('remove')">×</button>
    </td>
  </tr>
</template>

<style scoped>
td {
  padding: 4px 6px;
  border-top: 1px solid color-mix(in srgb, currentColor 8%, transparent);
}

.center {
  text-align: center;
}

input {
  box-sizing: border-box;
  width: 100%;
  padding: 5px 7px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: none;
  color: inherit;
  font: inherit;
}

input:hover,
input:focus {
  border-color: color-mix(in srgb, currentColor 18%, transparent);
  outline: none;
}

.amount {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

input[type='checkbox'] {
  width: auto;
  accent-color: #42b883;
}

canvas {
  display: block;
  width: 72px;
  height: 22px;
}

button {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: none;
  color: inherit;
  cursor: pointer;
  opacity: 0.5;
}

button:hover,
button:focus-visible {
  background: color-mix(in srgb, currentColor 8%, transparent);
  opacity: 1;
}

button:focus-visible {
  outline: 2px solid #42b883;
}

.grip {
  cursor: grab;
}

.grip svg {
  width: 10px;
  height: 16px;
  fill: currentColor;
}

.remove {
  font-size: 16px;
}

/* The table paints the rows: the clone, in a table of its own, gets the cells' background. */
[data-dnd-overlay] .row td {
  border-top-color: transparent;
  background: color-mix(in srgb, currentColor 4%, Canvas);
}

/* Lifted while it follows the pointer, flat again as it lands. */
[data-dnd-overlay='dragging'] .row td {
  box-shadow: 0 14px 20px -16px rgb(0 0 0 / 0.7);
}

[data-dnd-overlay] .row td:first-child {
  border-radius: 8px 0 0 8px;
}

[data-dnd-overlay] .row td:last-child {
  border-radius: 0 8px 8px 0;
}

/* The slot the row lands in. */
.row[data-dnd-placeholder] {
  opacity: 1;
}

.row[data-dnd-placeholder] td {
  background: color-mix(in srgb, #42b883 8%, transparent);
}

.row[data-dnd-placeholder] td > * {
  visibility: hidden;
}
</style>
