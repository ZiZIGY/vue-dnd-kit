<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeDroppable, useDnD, type Key } from '@vue-dnd-kit/core';
import FileCard from './FileCard.vue';
import type { DeskFile } from './types';

const props = defineProps<{ id: string; name: string; accept: string; files: DeskFile[]; desktop?: boolean }>();
const emit = defineEmits<{ drop: [id: Key, place: string] }>();

const el = useTemplateRef<HTMLElement>('el');
// `isAccepting`: something is being dragged and this folder takes it.
const { isOver, isAccepting } = makeDroppable(el, {
  id: props.id,
  accept: props.accept,
  onDrop: (event) => emit('drop', event.active.id, props.id),
});

// Over it, but not its kind of file.
const { status } = useDnD();
const refused = computed(() => isOver.value && !isAccepting.value && status.value === 'dragging');
</script>

<template>
  <section ref="el" class="folder" :class="{ desktop, accepting: isAccepting, over: isOver && isAccepting, refused }">
    <header>
      <svg v-if="id === 'trash'" class="icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13" />
        <path v-if="files.length" d="M10 11v5M14 11v5" />
      </svg>
      <svg v-else-if="!desktop" class="icon" viewBox="0 0 24 24" aria-hidden="true">
        <path v-if="isOver && isAccepting" d="M3 19V6a1.5 1.5 0 0 1 1.5-1.5h4l2 2h7A1.5 1.5 0 0 1 19 8v2M3 19l3-8h16l-3 8z" />
        <path v-else d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2h9A1.5 1.5 0 0 1 21 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" />
      </svg>
      <span class="name">{{ name }}</span>
      <span class="count">{{ files.length }}</span>
    </header>
    <div class="files">
      <FileCard v-for="file in files" :key="file.id" :file="file" :compact="!desktop" />
    </div>
  </section>
</template>

<style scoped>
.folder {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border: 1.5px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  transition:
    border-color 0.2s,
    background 0.2s,
    scale 0.2s;
}

.folder.desktop {
  min-height: 260px;
  border-style: dashed;
}

/* A drag is on and this folder takes it. */
.folder.accepting {
  border-color: color-mix(in srgb, #42b883 55%, transparent);
  border-style: dashed;
}

.folder.over {
  border-style: solid;
  border-color: #42b883;
  background: color-mix(in srgb, #42b883 12%, Canvas);
}

.folder.over:not(.desktop) {
  scale: 1.03;
}

.folder.refused {
  border-color: #f43f5e;
  background: color-mix(in srgb, #f43f5e 8%, Canvas);
  animation: shake 0.3s;
}

@keyframes shake {
  25% {
    translate: -4px 0;
  }
  75% {
    translate: 4px 0;
  }
}

header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
}

.icon {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.accepting .icon {
  stroke: #42b883;
}

.refused .icon {
  stroke: #f43f5e;
}

.count {
  margin-left: auto;
  padding: 3px 7px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
}

.files {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.desktop .files {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
  gap: 10px;
}

@media (prefers-reduced-motion: reduce) {
  .folder {
    transition: none;
  }

  .folder.refused {
    animation: none;
  }
}
</style>
