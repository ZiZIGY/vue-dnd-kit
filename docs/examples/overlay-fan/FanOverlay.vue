<script setup lang="ts">
import { computed } from 'vue';
import { DragPreview, type DragItem } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[] }>();

// The grabbed book in front, up to three more fanned out behind it, left and right.
const fan = computed(() =>
  props.items.slice(0, 4).map((entry, index) => ({
    entry,
    angle: index === 0 ? 0 : (index % 2 ? -1 : 1) * Math.ceil(index / 2) * 10,
    depth: index,
  })),
);
</script>

<template>
  <div class="fan">
    <!-- The wrapper turns with `transform`: on drop each clone lands on its own slot, turning straight. -->
    <div
      v-for="{ entry, angle, depth } in fan"
      :key="entry.id"
      class="card"
      :style="{ transform: `rotate(${angle}deg)`, zIndex: 4 - depth }"
    >
      <!-- The library's clone of this book, at the size of the box. -->
      <DragPreview :id="entry.id" class="face" :style="{ width: '100%', height: '100%' }">
        <!-- Shown for a book without a clone. -->
        <div class="blank" />
      </DragPreview>
    </div>
    <span v-if="items.length > 1" class="count">{{ items.length }}</span>
  </div>
</template>

<style scoped>
.fan {
  position: relative;
  width: 100%;
  height: 100%;
}

.card {
  position: absolute;
  inset: 0;
  transform-origin: 50% 130%;
}

.face {
  border-radius: 4px 8px 8px 4px;
  box-shadow: 0 16px 28px -14px rgb(0 0 0 / 0.7);
}

.blank {
  width: 100%;
  height: 100%;
  border-radius: 4px 8px 8px 4px;
  background: color-mix(in srgb, currentColor 30%, Canvas);
}

.count {
  position: absolute;
  z-index: 5;
  top: -10px;
  right: -10px;
  min-width: 22px;
  padding: 4px 6px;
  box-sizing: border-box;
  border-radius: 99px;
  background: #42b883;
  color: #04130c;
  font: 700 12px/14px system-ui, sans-serif;
  text-align: center;
}
</style>
