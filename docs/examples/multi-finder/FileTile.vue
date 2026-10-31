<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';
import FileIcon from './FileIcon.vue';
import FilePile from './FilePile.vue';

const props = defineProps<{ file: { id: string; name: string; kind: 'pdf' | 'png' | 'txt' | 'zip' | 'fig' | 'mp4' } }>();
const emit = defineEmits<{ pick: [event: MouseEvent] }>();
const el = useTemplateRef<HTMLElement>('el');
// `type`: folders and Home take files, the band selects them.
const { isDragging, selected } = makeDraggable(el, {
  id: () => props.file.id,
  data: () => props.file,
  type: 'file',
  overlay: FilePile,
});
</script>

<template>
  <li ref="el" class="tile" :class="{ selected, away: isDragging }" @click="emit('pick', $event)">
    <FileIcon :kind="file.kind" />
    <span class="name">{{ file.name }}</span>
  </li>
</template>

<style scoped>
.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 4px 8px;
  border-radius: 8px;
  cursor: default;
  user-select: none;
}

.tile:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.selected {
  background: color-mix(in srgb, #42b883 16%, transparent);
}

.selected .name {
  border-radius: 4px;
  background: #42b883;
  color: #04130c;
}

/* Dragged: the files stay, dimmed, until the drop moves them. */
.away {
  opacity: 0.4;
}

.name {
  max-width: 100%;
  overflow: hidden;
  padding: 1px 5px;
  font-size: 11.5px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
