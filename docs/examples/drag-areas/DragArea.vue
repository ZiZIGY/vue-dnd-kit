<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDragArea, makeDroppable, snapToGrid, type Coordinates, type Key } from '@vue-dnd-kit/core';
import Sticker from './Sticker.vue';

type StickerData = { id: string; text: string; color: string; x: number; y: number };
const props = defineProps<{ id: string; title: string; rules: string; strict?: boolean; stickers: StickerData[] }>();
const emit = defineEmits<{ place: [area: string, id: Key, at: Coordinates] }>();

const area = useTemplateRef<HTMLElement>('area');
// Rules for the drags that start in here, wherever they go. The strict area snaps its
// stickers to a grid and keeps them inside; the other one lets them go anywhere.
const { isDragging } = makeDragArea(area, {
  modifiers: () => (props.strict ? [snapToGrid(24)] : []),
  restrictToArea: () => props.strict,
});

// Both areas take drops: a sticker lands where it was let go.
const { isOver } = makeDroppable(area, {
  id: props.id,
  onDrop: ({ active, position }) => position && emit('place', props.id, active.id, position),
});
</script>

<template>
  <section class="panel">
    <h3>
      {{ title }}
      <code>{{ rules }}</code>
    </h3>
    <div ref="area" class="area" :class="{ strict, busy: isDragging, over: isOver }">
      <Sticker v-for="sticker in stickers" :key="sticker.id" :sticker="sticker" />
    </div>
  </section>
</template>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

h3 {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin: 0 2px;
  font-size: 13px;
  font-weight: 600;
}

code {
  font: 10px/1.2 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.6;
}

.area {
  position: relative;
  height: 216px;
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 14%, transparent);
  transition: box-shadow 0.2s;
}

.area.strict {
  background-image:
    linear-gradient(to right, color-mix(in srgb, currentColor 8%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, currentColor 8%, transparent) 1px, transparent 1px);
  background-size: 24px 24px;
}

/* A drag that started here is running: these are the rules in force. */
.area.busy {
  box-shadow: inset 0 0 0 1.5px #42b883;
}

.area.over:not(.busy) {
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 35%, transparent);
}
</style>
