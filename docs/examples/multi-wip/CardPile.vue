<script setup lang="ts">
import { computed } from 'vue';
import { DragPreview, type DnDStatus, type DragItem, type Over } from '@vue-dnd-kit/core';

// The cards' own overlay: the grabbed card on a pile of the others, with how many there
// are. Over a column that refuses them (full) it turns red and shakes.
const props = defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean; status: DnDStatus }>();
const refused = computed(() => props.status === 'dragging' && !!props.over && !props.accepted);
</script>

<template>
  <div class="pile" :class="{ refused }">
    <span v-if="items.length > 2" class="layer deep" />
    <span v-if="items.length > 1" class="layer" />
    <!-- The library's clone of the grabbed card, at the size of the box. -->
    <DragPreview :id="items[0]!.id" class="top" :style="{ width: '100%', height: '100%' }" />
    <span v-if="items.length > 1" class="count">{{ items.length }}</span>
    <span v-if="refused" class="full">No room: WIP limit</span>
  </div>
</template>

<style scoped>
.pile {
  position: relative;
  width: 100%;
  height: 100%;
}

.layer {
  position: absolute;
  inset: 0;
  border-radius: 9px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 14%, transparent);
  translate: 5px 5px;
}

.layer.deep {
  translate: 10px 10px;
}

.top {
  position: relative;
  border-radius: 9px;
  box-shadow: 0 16px 30px -14px rgb(0 0 0 / 0.65);
  transition: box-shadow 0.15s;
}

.count {
  position: absolute;
  top: -9px;
  right: -9px;
  min-width: 22px;
  padding: 4px 6px;
  box-sizing: border-box;
  border-radius: 99px;
  background: #42b883;
  color: #04130c;
  font: 700 12px/14px system-ui, sans-serif;
  text-align: center;
}

.refused {
  animation: shake 0.3s;
}

.refused .top {
  box-shadow:
    0 0 0 2px #ef4444,
    0 16px 30px -14px rgb(0 0 0 / 0.65);
}

.refused .count {
  background: #ef4444;
  color: #fff;
}

.full {
  position: absolute;
  top: calc(100% + 16px);
  left: 0;
  padding: 5px 9px;
  border-radius: 7px;
  background: #ef4444;
  color: #fff;
  font: 600 12px/1 system-ui, sans-serif;
  white-space: nowrap;
}

@keyframes shake {
  25% {
    translate: -4px 0;
  }

  75% {
    translate: 4px 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .refused {
    animation: none;
  }
}
</style>
