<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ shot: { id: string; hue: number } }>();
const el = useTemplateRef<HTMLElement>('el');
// `selected` is bound to the provider's selection: drag a selected shot and the others come along.
const { selected } = makeSortableItem(el, { item: () => props.shot });

const onClick = (event: MouseEvent) => {
  if (event.ctrlKey || event.metaKey) selected.value = !selected.value;
};
</script>

<template>
  <div
    ref="el"
    class="shot"
    :class="{ selected }"
    :style="{ background: `linear-gradient(160deg, hsl(${shot.hue} 85% 70%), hsl(${shot.hue + 40} 70% 36%))` }"
    @click="onClick"
  >
    <!-- A little landscape: a sun over two hills. -->
    <svg viewBox="0 0 120 90" preserveAspectRatio="none" aria-hidden="true">
      <circle cx="88" cy="26" r="9" fill="rgb(255 255 255 / 0.7)" />
      <path d="M0 90V62l26-20 22 16 28-26 44 34v24z" fill="rgb(0 0 0 / 0.18)" />
      <path d="M0 90V74l34-18 30 14 22-8 34 16v12z" fill="rgb(0 0 0 / 0.22)" />
    </svg>
    <span v-if="selected" class="check">
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 8.5 2.5 2.5L12 5.5" /></svg>
    </span>
  </div>
</template>

<style scoped>
.shot {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  border-radius: 10px;
  cursor: grab;
}

.shot > svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.shot.selected {
  outline: 3px solid #42b883;
  outline-offset: 2px;
}

.check {
  position: absolute;
  top: 6px;
  right: 6px;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #42b883;
}

.check svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: #04130c;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
