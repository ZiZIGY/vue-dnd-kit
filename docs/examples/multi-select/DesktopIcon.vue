<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable, useDnD } from '@vue-dnd-kit/core';
import Formation from './Formation.vue';
import { SIZE, type Icon } from './icons';

const props = defineProps<{ icon: Icon }>();

const el = useTemplateRef<HTMLElement>('el');
// The icon's data is where it lies: the overlay lays the dragged icons out by it.
const { isDragging, selected } = makeDraggable(el, {
  id: () => props.icon.id,
  data: () => props.icon,
  overlay: Formation,
});
const { selection } = useDnD();

const onClick = (event: MouseEvent) => {
  if (event.ctrlKey || event.metaKey) selected.value = !selected.value;
  else selection.set([props.icon.id]);
};

const COLORS: Record<string, string> = { jpg: '#42b883', txt: '#94a3b8', mp3: '#ec4899', pdf: '#ef4444' };
</script>

<template>
  <div
    ref="el"
    class="icon"
    :class="{ selected, dragging: isDragging }"
    :style="{ left: `${icon.x}px`, top: `${icon.y}px`, width: `${SIZE}px`, height: `${SIZE}px` }"
    @click="onClick"
  >
    <svg v-if="icon.kind === 'folder'" viewBox="0 0 40 32" aria-hidden="true">
      <path d="M2 6a3 3 0 0 1 3-3h9l4 4h17a3 3 0 0 1 3 3v17a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" fill="#3b82f6" />
      <path d="M2 11h36v16a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" fill="#60a5fa" />
    </svg>
    <span v-else class="file" :style="{ '--kind': COLORS[icon.kind] }">{{ icon.kind }}</span>
    <span class="name">{{ icon.name }}</span>
  </div>
</template>

<style scoped>
.icon {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  box-sizing: border-box;
  padding: 6px 4px;
  border-radius: 10px;
  cursor: grab;
}

.icon:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 1px;
}

.icon.selected {
  background: color-mix(in srgb, #42b883 18%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, #42b883 60%, transparent);
}

/* Dragged, and landing: their copies are in the overlay, the icons wait where they were. */
.icon.dragging {
  opacity: 0.35;
}

/* The copies in the overlay sit on no desktop: they get a background of their own. */
[data-dnd-overlay] .icon {
  opacity: 1;
  background: color-mix(in srgb, #42b883 18%, Canvas);
  box-shadow: 0 14px 26px -12px rgb(0 0 0 / 0.6);
}

svg {
  width: 40px;
  height: 32px;
}

.file {
  display: grid;
  place-items: end center;
  box-sizing: border-box;
  width: 28px;
  height: 34px;
  padding-bottom: 4px;
  border-radius: 3px 10px 3px 3px;
  background: #f1f5f9;
  box-shadow: inset 0 -12px 0 var(--kind);
  color: #fff;
  font: 700 7px/1 ui-monospace, Menlo, Consolas, monospace;
  text-transform: uppercase;
}

.name {
  max-width: 100%;
  overflow: hidden;
  font-size: 11px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
