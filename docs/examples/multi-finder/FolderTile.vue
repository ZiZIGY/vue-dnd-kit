<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue';
import { makeDroppable, useDnD, type Key } from '@vue-dnd-kit/core';

const props = defineProps<{ folder: { id: string; name: string; files: unknown[] } }>();
const emit = defineEmits<{ open: []; move: [ids: Key[]] }>();

/** Files were dropped in and are flying: the folder stays open until they are inside. */
const swallowing = ref(false);
/** Times it took files: each one replays the gulp. */
const gulps = ref(0);

const el = useTemplateRef<HTMLElement>('el');
const { isOver } = makeDroppable(el, {
  id: () => props.folder.id,
  accept: 'file',
  // The box stays where it was let go: the files fly in on their own (FilePile).
  dropAnimation: false,
  onDrop: (event) => {
    swallowing.value = true;
    emit('move', event.active.ids);
  },
});

const { status } = useDnD();
watch(status, (now) => {
  if (now !== 'idle' || !swallowing.value) return;
  swallowing.value = false;
  gulps.value++;
});
</script>

<template>
  <!-- A button: the selection area leaves its presses alone, so a click opens it. -->
  <li ref="el" class="folder" :class="{ open: isOver || swallowing, over: isOver }">
    <button type="button" class="open-button" :aria-label="`Open ${folder.name}`" @click="emit('open')" />
    <svg :key="gulps" class="icon" :class="{ gulp: gulps }" viewBox="0 0 52 42" aria-hidden="true">
      <path class="back" d="M2 6a3 3 0 0 1 3-3h13l4 4h25a3 3 0 0 1 3 3v27a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" />
      <path class="paper" d="M7 11h38v20H7z" />
      <path class="front" d="M2 15a3 3 0 0 1 3-3h42a3 3 0 0 1 3 3v22a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" />
    </svg>
    <span class="name">{{ folder.name }}</span>
    <span v-if="folder.files.length" :key="folder.files.length" class="count">{{ folder.files.length }}</span>
  </li>
</template>

<style scoped>
.folder {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 4px 8px;
  border-radius: 8px;
  user-select: none;
  transition: background-color 0.15s;
}

.folder:hover {
  background: color-mix(in srgb, currentColor 6%, transparent);
}

/* Files are over it. */
.folder.over {
  background: color-mix(in srgb, #42b883 16%, transparent);
}

/* Covers the tile: the whole folder is the button. */
.open-button {
  position: absolute;
  inset: 0;
  z-index: 1;
  padding: 0;
  border: 0;
  border-radius: inherit;
  background: none;
  cursor: pointer;
}

.open-button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.icon {
  width: 52px;
  height: 42px;
  overflow: visible;
}

.back {
  fill: #3b82f6;
}

.paper {
  fill: #fff;
  opacity: 0;
  transition: opacity 0.15s;
}

.front {
  fill: #60a5fa;
  transform-box: fill-box;
  transform-origin: 50% 100%;
  transition: transform 0.2s cubic-bezier(0.3, 1.4, 0.5, 1);
}

/* Open: the front flap tips forward and a sheet shows inside. */
.open .front {
  transform: perspective(60px) rotateX(-28deg);
}

.open .paper {
  opacity: 0.9;
}

/* It took the files: a gulp. */
.icon.gulp {
  animation: gulp 0.4s cubic-bezier(0.3, 1.6, 0.5, 1);
}

.name {
  font-size: 11.5px;
}

.count {
  position: absolute;
  top: 6px;
  right: calc(50% - 34px);
  min-width: 18px;
  padding: 2px 5px;
  box-sizing: border-box;
  border-radius: 99px;
  background: #42b883;
  color: #04130c;
  font: 700 10px/14px system-ui, sans-serif;
  text-align: center;
  animation: gulp 0.4s cubic-bezier(0.3, 1.6, 0.5, 1);
}

@keyframes gulp {
  40% {
    scale: 1.15;
  }
}

@media (prefers-reduced-motion: reduce) {
  .front {
    transition: none;
  }

  .icon.gulp,
  .count {
    animation: none;
  }
}
</style>
