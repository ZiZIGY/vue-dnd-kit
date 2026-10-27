<script setup lang="ts">
import { computed, inject, useTemplateRef } from 'vue';
import FileIcon from './FileIcon.vue';
import { FILES, type FolderEntry } from './files';
import { useFolderDrop } from './useFolderDrop';

/** A folder in the sidebar: opens it on click, takes files and folders on drop. */
const props = defineProps<{ folder: FolderEntry; depth: number }>();
const files = inject(FILES)!;

const el = useTemplateRef<HTMLElement>('el');
const isTarget = useFolderDrop(el, () => props.folder);
const isOpen = computed(() => files.current.value.id === props.folder.id);
</script>

<template>
  <button
    ref="el"
    type="button"
    class="row"
    :class="{ open: isOpen, target: isTarget }"
    :style="{ paddingLeft: `${10 + depth * 14}px` }"
    @click="files.open(folder)"
  >
    <svg v-if="!depth" class="home" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2.5 7.5 8 3l5.5 4.5M4 6.5V13h3v-3.5h2V13h3V6.5" />
    </svg>
    <FileIcon v-else :entry="folder" :open="isTarget" />
    <span class="name">{{ folder.name }}</span>
  </button>
</template>

<style scoped>
.row {
  display: flex;
  flex: none;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 30px;
  padding: 0 10px;
  border: 0;
  border-radius: 7px;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s;
}

.row:hover {
  background: color-mix(in srgb, currentColor 7%, transparent);
}

.row:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.row.open {
  background: color-mix(in srgb, currentColor 10%, transparent);
  font-weight: 600;
}

.row.target {
  background: color-mix(in srgb, #42b883 24%, transparent);
  box-shadow: inset 0 0 0 1.5px #42b883;
}

.row > svg {
  flex: none;
  width: 18px;
  height: 18px;
}

.home {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.75;
}

.name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
