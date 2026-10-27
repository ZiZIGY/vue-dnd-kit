<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{
  tile: { id: number; kind: 'photo'; hue: number } | { id: number; kind: 'note'; text: string };
}>();
const el = useTemplateRef<HTMLElement>('el');
// The type tells the provider's slot what is dragged.
makeSortableItem(el, { item: () => props.tile, type: () => props.tile.kind });
</script>

<template>
  <div
    v-if="tile.kind === 'photo'"
    ref="el"
    class="tile photo"
    :style="{ background: `linear-gradient(160deg, hsl(${tile.hue} 80% 68%), hsl(${tile.hue + 40} 65% 34%))` }"
  >
    <svg viewBox="0 0 120 120" preserveAspectRatio="none" aria-hidden="true">
      <circle cx="86" cy="34" r="10" fill="rgb(255 255 255 / 0.7)" />
      <path d="M0 120V84l30-24 24 18 30-30 36 40v32z" fill="rgb(0 0 0 / 0.2)" />
    </svg>
  </div>
  <div v-else ref="el" class="tile note">
    <span class="pin" />
    {{ tile.text }}
  </div>
</template>

<style scoped>
.tile {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  aspect-ratio: 1;
  border-radius: 10px;
  cursor: grab;
  user-select: none;
}

.tile:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.tile[data-dnd-placeholder] {
  opacity: 0.3;
}

.photo svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.note {
  padding: 22px 12px 12px;
  background: color-mix(in srgb, #f59e0b 16%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, #f59e0b 35%, transparent);
  font-size: 13px;
  line-height: 1.35;
}

.pin {
  position: absolute;
  top: 9px;
  left: 12px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f59e0b;
}
</style>
