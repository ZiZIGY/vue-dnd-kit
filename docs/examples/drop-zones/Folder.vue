<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue';
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

// A short pulse when a file comes in.
const received = ref(false);
watch(
  () => props.files.length,
  (count, before) => {
    if (count <= before) return;
    received.value = false;
    requestAnimationFrame(() => (received.value = true));
  },
);
</script>

<template>
  <section
    ref="el"
    class="folder"
    :class="{ desktop, accepting: isAccepting, over: isOver && isAccepting, refused, received }"
    @animationend="received = false"
  >
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
    <!-- The files left behind slide into the gap (Vue's TransitionGroup). -->
    <TransitionGroup tag="div" class="files" move-class="moving">
      <FileCard v-for="file in files" :key="file.id" :file="file" />
    </TransitionGroup>
  </section>
</template>

<style scoped>
/*
 * Sized for every file it can hold, so nothing around it moves when files come and go:
 * the desktop two rows, a folder all four in its tray.
 */
.folder {
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
  min-height: 284px;
  padding: 12px;
  border: 1.5px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  transition:
    border-color 0.2s,
    background 0.2s;
}

.folder.desktop {
  min-height: 166px;
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

.folder.refused {
  border-color: #f43f5e;
  background: color-mix(in srgb, #f43f5e 8%, Canvas);
  animation: shake 0.3s;
}

.folder.received {
  animation: pulse 0.45s 0.15s;
}

@keyframes shake {
  25% {
    translate: -4px 0;
  }
  75% {
    translate: 4px 0;
  }
}

@keyframes pulse {
  40% {
    scale: 1.04;
    border-color: #42b883;
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

/* A folder's tray: where its files go. */
.files {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  padding: 5px;
  border: 1.5px dashed color-mix(in srgb, currentColor 14%, transparent);
  border-radius: 10px;
  transition: border-color 0.2s;
}

.accepting .files {
  border-color: color-mix(in srgb, #42b883 60%, transparent);
}

.desktop .files {
  display: grid;
  flex: none;
  grid-template-columns: repeat(auto-fill, 172px);
  gap: 8px 10px;
  padding: 0;
  border: 0;
}

.moving {
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@media (prefers-reduced-motion: reduce) {
  .folder {
    transition: none;
  }

  .folder.refused,
  .folder.received {
    animation: none;
  }

  .moving {
    transition: none;
  }
}
</style>
