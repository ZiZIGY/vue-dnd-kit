<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeDroppable, useDnDMonitor, type DnDEvent } from '@vue-dnd-kit/core';
import Crumple from './Crumple.vue';

const emit = defineEmits<{ drop: [event: DnDEvent] }>();

/** Photos dropped in and still falling: the lid stays open until they are in. */
const falling = ref(0);
/** Times the lid has shut on a photo: each one replays the wobble. */
const shut = ref(0);

const el = useTemplateRef<HTMLElement>('el');
const bin = useTemplateRef<SVGElement>('bin');
const { isOver } = makeDroppable(el, {
  id: 'trash',
  // What the overlay reads as `over.data`: the bin, to aim the photo at its mouth.
  data: () => ({ bin: bin.value }),
  // Over the bin, the photo is crumpled up; dropped, it falls in (see Crumple.vue).
  overOverlay: Crumple,
  // The box stays where it was let go: its content does the landing.
  overDropAnimation: false,
  onDrop: (event) => {
    falling.value++;
    emit('drop', event);
  },
});

// A drop's landing is over: the photo is in. The next drag may run meanwhile.
useDnDMonitor({
  onDragSettle: (event) => {
    if (!('dropped' in event) || event.over?.id !== 'trash' || !falling.value) return;
    falling.value--;
    shut.value++;
  },
});
</script>

<template>
  <div ref="el" class="trash" :class="{ over: isOver, open: isOver || falling > 0 }">
    <svg ref="bin" class="bin" viewBox="0 0 64 72" aria-hidden="true">
      <!-- A new element for every photo in: the lid claps and the bin rocks again. -->
      <g :key="shut" :class="{ shut: shut > 0 }">
        <g class="lid">
          <path d="M24 11V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v4" />
          <rect x="6" y="11" width="52" height="6" rx="3" />
        </g>
        <path d="M11 23h42l-4 43a4 4 0 0 1-4 4H19a4 4 0 0 1-4-4z" />
        <path d="M25 33v27M32 33v27M39 33v27" />
      </g>
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

/* Turned in the drawing's own units: the bin rocks on its base, the lid on its left end. */
.bin g {
  transform-box: view-box;
  transform-origin: 32px 70px;
}

.bin .lid {
  transform-origin: 6px 17px;
  transition: rotate 0.2s cubic-bezier(0.3, 1.5, 0.5, 1);
}

.open .lid {
  rotate: -32deg;
}

.caption {
  font-weight: 600;
}

@media (prefers-reduced-motion: no-preference) {
  /* The lid claps shut on the photo, and the bin rocks. */
  .shut {
    animation: rock 0.45s ease-out;
  }

  .shut .lid {
    animation: clap 0.3s cubic-bezier(0.5, 0, 0.5, 1.6);
  }
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
</style>
