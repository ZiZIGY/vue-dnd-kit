<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue';
import { makeDroppable, useDnD, type DnDEvent } from '@vue-dnd-kit/core';
import Crumple from './Crumple.vue';

const emit = defineEmits<{ drop: [event: DnDEvent] }>();

/** A photo was dropped in and is falling: the lid stays open until the drop is over. */
const swallowing = ref(false);
/** Times the lid has shut on a photo: each one replays the wobble. */
const shut = ref(0);

const el = useTemplateRef<HTMLElement>('el');
const { isOver } = makeDroppable(el, {
  id: 'trash',
  // Over the bin, the photo is crumpled up; dropped, it falls in (see Crumple.vue).
  overlay: Crumple,
  // The box stays where it was let go: its content does the landing.
  dropAnimation: false,
  onDrop: (event) => {
    swallowing.value = true;
    emit('drop', event);
  },
});

const { status } = useDnD();
watch(status, (now) => {
  if (now !== 'idle' || !swallowing.value) return;
  swallowing.value = false;
  shut.value++;
});
</script>

<template>
  <div ref="el" class="trash" :class="{ over: isOver, open: isOver || swallowing }">
    <svg :key="shut" class="bin" :class="{ shut }" viewBox="0 0 64 72" aria-hidden="true">
      <g class="lid">
        <path d="M24 11V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v4" />
        <rect x="6" y="11" width="52" height="6" rx="3" />
      </g>
      <path class="can" d="M11 23h42l-4 43a4 4 0 0 1-4 4H19a4 4 0 0 1-4-4z" />
      <path d="M25 33v27M32 33v27M39 33v27" />
    </svg>
    <span class="caption">{{ isOver ? 'Release to delete' : 'Trash' }}</span>
  </div>
</template>

<style scoped>
.trash {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 160px;
  border: 1.5px dashed color-mix(in srgb, currentColor 20%, transparent);
  border-radius: 14px;
  font-size: 12px;
  transition:
    border-color 0.2s,
    background-color 0.2s,
    color 0.2s;
}

/* A photo is over the bin. */
.trash.over {
  border-color: #ef4444;
  background: color-mix(in srgb, #ef4444 8%, transparent);
  color: #ef4444;
}

.bin {
  width: 52px;
  overflow: visible;
  fill: none;
  stroke: currentColor;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.lid {
  /* Hinged at its left end. */
  transform-box: view-box;
  transform-origin: 6px 17px;
  transition: rotate 0.2s cubic-bezier(0.3, 1.5, 0.5, 1);
}

.open .lid {
  rotate: -32deg;
}

/* The lid claps shut on the photo, and the bin rocks. */
.bin.shut {
  animation: rock 0.45s ease-out;
}

.bin.shut .lid {
  animation: clap 0.3s cubic-bezier(0.5, 0, 0.5, 1.6);
}

.caption {
  font-weight: 600;
}

@keyframes clap {
  from {
    rotate: -32deg;
  }
}

@keyframes rock {
  30% {
    rotate: -6deg;
  }

  60% {
    rotate: 4deg;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bin.shut,
  .bin.shut .lid {
    animation: none;
  }
}
</style>
