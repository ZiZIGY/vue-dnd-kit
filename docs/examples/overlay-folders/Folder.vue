<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable, type DropAnimation, type Key } from '@vue-dnd-kit/core';
import FolderIcon from './FolderIcon.vue';
import MovePill from './MovePill.vue';

const props = defineProps<{
  folder: { id: string; name: string; icon: 'inbox' | 'archive' | 'later' | 'receipts' };
  count: number;
  open: boolean;
}>();
const emit = defineEmits<{ move: [ids: Key[]]; show: [] }>();

/** The pill is sucked into the folder's icon: `over` is the folder it was dropped on. */
const intoFolder: DropAnimation = ({ overlay, from, over, reducedMotion }) => {
  const icon = over?.element.querySelector('svg')?.getBoundingClientRect();
  if (!icon || reducedMotion) return overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: 'forwards' });
  // The box scales around its top left corner: place it by its center instead.
  const at = (x: number, y: number, scale: number) =>
    `translate3d(${x - (from.width * scale) / 2}px, ${y - (from.height * scale) / 2}px, 0) scale(${scale})`;
  const start = { x: from.left + from.width / 2, y: from.top + from.height / 2 };
  const end = { x: icon.left + icon.width / 2, y: icon.top + icon.height / 2 };
  return overlay.animate(
    [
      { transform: at(start.x, start.y, 1), opacity: 1 },
      // A little lift first, then down into the folder.
      { transform: at(start.x + (end.x - start.x) * 0.15, start.y - 10, 0.9), opacity: 1, offset: 0.25 },
      { transform: at(end.x, end.y, 0.12), opacity: 0.4 },
    ],
    { duration: 420, easing: 'cubic-bezier(0.45, 0, 0.2, 1)', fill: 'forwards' },
  );
};

const el = useTemplateRef<HTMLElement>('el');
const { isOver } = makeDroppable(el, {
  id: () => props.folder.id,
  data: () => props.folder,
  // The folder that is open takes nothing: the messages are already in it.
  disabled: () => props.open,
  overlay: MovePill,
  dropAnimation: intoFolder,
  onDrop: (event) => emit('move', event.active.ids),
});
</script>

<template>
  <li ref="el">
    <button
      type="button"
      class="folder"
      :class="{ open, over: isOver }"
      :aria-current="open ? 'page' : undefined"
      @click="emit('show')"
    >
      <FolderIcon :icon="folder.icon" />
      {{ folder.name }}
      <!-- Keyed by the count: a new number pops in. -->
      <span v-if="count" :key="count" class="count">{{ count }}</span>
    </button>
  </li>
</template>

<style scoped>
.folder {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 7px 10px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: inherit;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  transition:
    background-color 0.15s,
    box-shadow 0.15s;
}

.folder:hover {
  background: color-mix(in srgb, currentColor 5%, transparent);
}

.folder.open {
  background: color-mix(in srgb, currentColor 8%, transparent);
  font-weight: 600;
}

/* A drag of messages is over it. */
.folder.over {
  background: color-mix(in srgb, #42b883 16%, transparent);
  box-shadow: inset 0 0 0 1.5px #42b883;
}

.count {
  margin-left: auto;
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.6;
  animation: pop 0.35s cubic-bezier(0.2, 0.8, 0.2, 1.6);
}

@keyframes pop {
  from {
    scale: 1.8;
    color: #42b883;
    opacity: 1;
  }
}
</style>
