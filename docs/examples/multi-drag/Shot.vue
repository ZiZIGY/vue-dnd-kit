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
    :style="{ background: `linear-gradient(140deg, hsl(${shot.hue} 80% 62%), hsl(${shot.hue + 40} 70% 38%))` }"
    @click="onClick"
  >
    <span v-if="selected" class="check">✓</span>
  </div>
</template>

<style scoped>
.shot {
  position: relative;
  height: 72px;
  border-radius: 10px;
  cursor: grab;
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
  color: #04130c;
  font: 700 12px/1 system-ui, sans-serif;
}
</style>
