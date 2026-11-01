<script setup lang="ts">
import { computed } from 'vue';
import type { Active } from '@vue-dnd-kit/core';
import { KINDS } from './design';
import type { ToolData } from './useLayerDrop';

// A tool from the toolbar in hand: the outline of the layer it adds, at its size on the
// canvas, centred on the pointer (the overlay box is the button, held by its centre).
const props = defineProps<{ active: Active }>();

const ghost = computed(() => {
  const { tool, zoom } = props.active.data as ToolData;
  const { width, height } = KINDS[tool];
  return { tool, style: { width: `${width * zoom}px`, height: `${height * zoom}px`, fontSize: `${16 * zoom}px` } };
});
</script>

<template>
  <div class="hold">
    <div class="ghost" :class="`of-${ghost.tool}`" :style="ghost.style">
      <template v-if="ghost.tool === 'text'">Type something</template>
    </div>
  </div>
</template>

<style scoped>
.hold {
  position: relative;
  width: 100%;
  height: 100%;
}

.ghost {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  outline: 1px solid #0d99ff;
  background: rgb(217 217 217 / 0.75);
  color: #1e1e1e;
  white-space: nowrap;
  transform: translate(-50%, -50%);
  animation: appear 0.16s ease-out;
}

.of-ellipse {
  border-radius: 50%;
}

.of-frame {
  background: rgb(255 255 255 / 0.85);
}

.of-image {
  border-radius: 6px;
  background: rgb(165 180 252 / 0.8);
}

.of-text {
  background: none;
}

@keyframes appear {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.85);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ghost {
    animation: none;
  }
}
</style>
