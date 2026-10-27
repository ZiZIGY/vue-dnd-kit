<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeDragArea, makeDroppable, snapToGrid, type DnDEvent } from '@vue-dnd-kit/core';
import OptionRow from './OptionRow.vue';
import DeskChip from './DeskChip.vue';

const axis = ref<'undefined' | 'x' | 'y'>('undefined');
const modifiers = ref<'[]' | '[snapToGrid(20)]'>('[snapToGrid(20)]');
const restrictToArea = ref<'false' | 'true'>('true');
const activation = ref<'undefined' | '{ mouse: { delay: 300 } }'>('undefined');
const disabled = ref<'false' | 'true'>('false');

const grid = [snapToGrid(20)];

const area = useTemplateRef<HTMLElement>('area');
// Every option is read when a press or a drag starts: getters keep them live.
const { isDragging } = makeDragArea(area, {
  axis: () => (axis.value === 'undefined' ? undefined : axis.value),
  modifiers: () => (modifiers.value === '[]' ? [] : grid),
  restrictToArea: () => restrictToArea.value === 'true',
  activation: () => (activation.value === 'undefined' ? undefined : { mouse: { delay: 300 } }),
  disabled: () => disabled.value === 'true',
});

const chips = ref([
  { id: 'A', in: 'area', x: 20, y: 20 },
  { id: 'B', in: 'area', x: 100, y: 80 },
  { id: 'C', in: 'page', x: 22, y: 76 },
]);

// The page and the area both take drops: a chip stays where it was let go.
const place = (where: 'page' | 'area') => ({ active, position }: DnDEvent) => {
  const chip = chips.value.find((item) => item.id === active.id);
  if (!chip || !position) return;
  Object.assign(chip, { in: where, x: Math.round(position.x), y: Math.round(position.y) });
};
const page = useTemplateRef<HTMLElement>('page');
makeDroppable(page, { id: 'page', onDrop: place('page') });
makeDroppable(area, { id: 'area', onDrop: place('area') });
</script>

<template>
  <div class="demo">
    <div class="options-panel" role="group" aria-label="makeDragArea options">
      <OptionRow v-model="axis" name="axis" :options="['undefined', 'x', 'y']" />
      <OptionRow v-model="modifiers" name="modifiers" :options="['[]', '[snapToGrid(20)]']" />
      <OptionRow v-model="restrictToArea" name="restrictToArea" :options="['false', 'true']" />
      <OptionRow v-model="activation" name="activation" :options="['undefined', '{ mouse: { delay: 300 } }']" />
      <OptionRow v-model="disabled" name="disabled" :options="['false', 'true']" />
    </div>

    <div ref="page" class="page">
      <span class="tag">page · free</span>
      <DeskChip v-for="chip in chips.filter((item) => item.in === 'page')" :key="chip.id" :chip="chip" />
      <div ref="area" class="area" :class="{ busy: isDragging, off: disabled === 'true' }">
        <span class="tag">makeDragArea · <b>isDragging: {{ isDragging }}</b></span>
        <DeskChip v-for="chip in chips.filter((item) => item.in === 'area')" :key="chip.id" :chip="chip" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.options-panel {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  gap: 8px 12px;
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

.page {
  position: relative;
  box-sizing: border-box;
  width: 480px;
  max-width: 100%;
  height: 196px;
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 2%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent);
}

.area {
  position: absolute;
  top: 14px;
  right: 14px;
  bottom: 14px;
  left: 108px;
  border-radius: 8px;
  /* The 20px grid of `snapToGrid(20)`, from the area's top-left corner. */
  background:
    linear-gradient(to right, color-mix(in srgb, currentColor 8%, transparent) 1px, transparent 1px) 0 0 / 20px 20px,
    linear-gradient(to bottom, color-mix(in srgb, currentColor 8%, transparent) 1px, transparent 1px) 0 0 / 20px 20px,
    color-mix(in srgb, currentColor 4%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, #42b883 45%, transparent);
  transition: box-shadow 0.15s;
}

/* A drag that started here is running: these rules are in force. */
.area.busy {
  box-shadow: inset 0 0 0 2px #42b883;
}

.area.off {
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 20%, transparent);
  opacity: 0.6;
}

.tag {
  position: absolute;
  right: 8px;
  bottom: 7px;
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  white-space: nowrap;
  opacity: 0.75;
  pointer-events: none;
}

.page > .tag {
  top: 14px;
  right: auto;
  bottom: auto;
  left: 14px;
  opacity: 0.5;
}

.tag b {
  font-weight: 400;
  color: #42b883;
}
</style>
