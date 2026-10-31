<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue';
import type { DnDStatus, Over } from '@vue-dnd-kit/core';

// The bin's overlay. It wraps the photo's own overlay (its slot, the clone) and crumples
// it up. When the drop is decided it throws it into the bin: the drop waits for that
// animation, and the bin's `dropAnimation: false` leaves the box where it was let go.
const props = defineProps<{ over: Over | null; status: DnDStatus }>();

const paper = useTemplateRef<HTMLElement>('paper');
/** From where the photo was let go to the bin's mouth, set at the drop. */
const fall = ref<Record<string, string> | null>(null);

watch(
  () => props.status,
  (status) => {
    if (status !== 'dropping' || !props.over || !paper.value) return;
    // While the drop animates, `over` is the bin it was dropped on.
    const bin = props.over.element.querySelector('svg')?.getBoundingClientRect();
    if (!bin) return;
    const from = paper.value.getBoundingClientRect();
    fall.value = {
      '--dx': `${bin.left + bin.width / 2 - (from.left + from.width / 2)}px`,
      '--dy': `${bin.top + bin.height * 0.3 - (from.top + from.height / 2)}px`,
    };
  },
  // Once the removal has rendered: the bin may have moved with the photo gone.
  { flush: 'post' },
);
</script>

<template>
  <div class="crumple">
    <div ref="paper" class="paper" :class="{ falling: fall }" :style="fall ?? undefined">
      <slot />
    </div>
    <span v-if="!fall" class="badge">Delete</span>
  </div>
</template>

<style scoped>
.crumple {
  position: relative;
  width: 100%;
  height: 100%;
}

.paper {
  position: relative;
  width: 100%;
  height: 100%;
  /* A crumpled sheet: jagged edges, turned, smaller, greyer. */
  clip-path: polygon(4% 7%, 26% 0, 50% 6%, 76% 1%, 97% 8%, 100% 30%, 94% 52%, 100% 76%, 93% 100%, 70% 94%, 48% 100%, 24% 95%, 2% 99%, 6% 74%, 0 50%, 5% 27%);
  filter: saturate(0.4) brightness(0.92);
  rotate: -8deg;
  scale: 0.7;
  animation: crush 0.25s ease-out;
}

/* Its folds. */
.paper::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(118deg, transparent 38%, rgb(0 0 0 / 0.28) 40%, transparent 52%),
    linear-gradient(28deg, transparent 52%, rgb(255 255 255 / 0.22) 54%, transparent 66%),
    linear-gradient(200deg, transparent 60%, rgb(0 0 0 / 0.2) 62%, transparent 74%);
  pointer-events: none;
}

.paper.falling {
  animation: fall 0.55s cubic-bezier(0.45, 0, 0.85, 0.5) forwards;
}

.badge {
  position: absolute;
  top: 2px;
  right: 2px;
  padding: 3px 7px;
  border-radius: 99px;
  background: #ef4444;
  color: #fff;
  font: 700 10px/1 system-ui, sans-serif;
  box-shadow: 0 4px 10px -4px rgb(0 0 0 / 0.5);
}

/* From the flat photo: the same sixteen points on its edges. */
@keyframes crush {
  from {
    clip-path: polygon(0 0, 25% 0, 50% 0, 75% 0, 100% 0, 100% 25%, 100% 50%, 100% 75%, 100% 100%, 75% 100%, 50% 100%, 25% 100%, 0 100%, 0 75%, 0 50%, 0 25%);
    filter: none;
    rotate: 0deg;
    scale: 1;
  }
}

/* A little toss up, then down into the bin, spinning and shrinking. */
@keyframes fall {
  25% {
    translate: calc(var(--dx) * 0.2) -16px;
    rotate: -20deg;
    scale: 0.6;
  }

  to {
    translate: var(--dx) var(--dy);
    rotate: -120deg;
    scale: 0.12;
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .paper {
    animation: none;
  }

  .paper.falling {
    animation: none;
    opacity: 0;
  }
}
</style>
