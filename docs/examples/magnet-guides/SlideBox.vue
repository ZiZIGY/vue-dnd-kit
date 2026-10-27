<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable, type Modifier } from '@vue-dnd-kit/core';

const props = defineProps<{
  box: { id: string; kind: string; x: number; y: number; width: number; height: number };
  modifiers: Modifier[];
}>();
const el = useTemplateRef<HTMLElement>('el');
const { isDragging } = makeDraggable(el, { id: () => props.box.id, modifiers: () => props.modifiers });
</script>

<template>
  <div
    ref="el"
    class="box"
    :class="[box.kind, { dragging: isDragging }]"
    :style="{ left: `${box.x}px`, top: `${box.y}px`, width: `${box.width}px`, height: `${box.height}px` }"
  >
    <template v-if="box.kind === 'title'">Quarterly review</template>
    <template v-else-if="box.kind === 'text'">Revenue grew 18%, led by the new plans.</template>
    <template v-else-if="box.kind === 'button'">Read more</template>
  </div>
</template>

<style scoped>
.box {
  position: absolute;
  box-sizing: border-box;
  border-radius: 6px;
  background: Canvas;
  cursor: grab;
  user-select: none;
}

.box:hover {
  box-shadow: 0 0 0 1px color-mix(in srgb, #3b82f6 60%, transparent);
}

.box:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.box.dragging {
  opacity: 0.25;
}

[data-dnd-overlay] .box {
  box-shadow: 0 0 0 1.5px #3b82f6;
}

.title {
  display: flex;
  align-items: center;
  padding: 0 4px;
  font-size: 22px;
  font-weight: 700;
}

.text {
  padding: 4px;
  font-size: 13px;
  line-height: 1.4;
  opacity: 0.75;
}

.image {
  background: linear-gradient(150deg, #93c5fd, #6366f1 60%, #312e81);
}

.button {
  display: grid;
  place-items: center;
  border-radius: 99px;
  background: #42b883;
  color: #04130c;
  font-size: 12px;
  font-weight: 600;
}
</style>
