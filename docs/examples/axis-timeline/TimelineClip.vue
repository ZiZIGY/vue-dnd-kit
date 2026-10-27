<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{
  clip: { id: string; name: string; start: number; length: number; hue: number };
  locked: boolean;
}>();

const el = useTemplateRef<HTMLElement>('el');
// Read when a drag starts: locked, the clip only slides along its track.
const { isDragging } = makeDraggable(el, {
  id: () => props.clip.id,
  axis: () => (props.locked ? 'x' : undefined),
});
</script>

<template>
  <div
    ref="el"
    class="clip"
    :class="{ dragging: isDragging }"
    :style="{
      '--hue': clip.hue,
      left: `calc(var(--second) * ${clip.start})`,
      width: `calc(var(--second) * ${clip.length})`,
    }"
  >
    <strong>{{ clip.name }}</strong>
    <span>{{ clip.start }}s</span>
  </div>
</template>

<style scoped>
.clip {
  position: absolute;
  top: 4px;
  bottom: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
  padding: 0 8px;
  border-radius: 7px;
  background: hsl(var(--hue) 65% 45%);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.2);
  color: #fff;
  cursor: grab;
  user-select: none;
}

.clip:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* Where the clip was picked up from. */
.clip.dragging {
  opacity: 0.3;
}

[data-dnd-overlay] .clip {
  box-shadow:
    inset 0 0 0 1px rgb(255 255 255 / 0.35),
    0 12px 24px -10px rgb(0 0 0 / 0.6);
}

strong {
  overflow: hidden;
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

span {
  font: 10px/1.3 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.8;
}
</style>
