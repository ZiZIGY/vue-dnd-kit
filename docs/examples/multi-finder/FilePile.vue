<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue';
import { DragPreview, type DnDStatus, type DragItem, type Over } from '@vue-dnd-kit/core';

// The files' overlay: the grabbed file on top of up to three others, and how many there
// are. Dropped into a folder, they fly into it one after another; the drop waits for
// the last one (the folder's `dropAnimation: false` leaves the box where it was let go).
const props = defineProps<{ items: DragItem[]; over: Over | null; status: DnDStatus }>();

const pile = computed(() => props.items.slice(0, 4).map((entry, index) => ({ entry, x: index * 5, y: index * 4 })));
// Over a folder that takes them, the files go see-through: the folder opens under them.
const into = computed(() => !!props.over?.accepted);

const root = useTemplateRef<HTMLElement>('root');
/** Each card's way into the folder, set at the drop. */
const flights = ref<Array<Record<string, string>> | null>(null);

watch(
  () => props.status,
  (status) => {
    if (status !== 'dropping' || !props.over || !root.value) return;
    // While the drop lands, `over` is the folder it was dropped on.
    const icon = props.over.element.querySelector('svg')?.getBoundingClientRect();
    const cards = root.value.querySelectorAll<HTMLElement>('.card');
    if (!icon) return;
    flights.value = [...cards].map((card, index) => {
      const from = card.getBoundingClientRect();
      // Where it ends: its place in the pile, moved by the way to the folder's middle.
      const { x, y } = pile.value[index]!;
      return {
        '--to-x': `${x + icon.left + icon.width / 2 - (from.left + from.width / 2)}px`,
        '--to-y': `${y + icon.top + icon.height * 0.55 - (from.top + from.height / 2)}px`,
        '--delay': `${index * 70}ms`,
      };
    });
  },
  // Once the move has rendered: the folder may have moved with the files gone.
  { flush: 'post' },
);
</script>

<template>
  <div ref="root" class="pile" :class="{ into }">
    <div
      v-for="({ entry, x, y }, index) in pile"
      :key="entry.id"
      class="card"
      :class="{ flying: flights }"
      :style="[{ zIndex: 4 - index, translate: `${x}px ${y}px`, rotate: `${index ? (index % 2 ? -4 : 4) : 0}deg` }, flights?.[index]]"
    >
      <!-- The library's clone of the file, at the size of the box. -->
      <DragPreview :id="entry.id" :style="{ width: '100%', height: '100%' }" />
    </div>
    <span v-if="items.length > 1 && !flights" class="count">{{ items.length }}</span>
  </div>
</template>

<style scoped>
.pile {
  position: relative;
  width: 100%;
  height: 100%;
  transition: opacity 0.15s;
}

.pile.into {
  opacity: 0.6;
}

.card {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 4%, Canvas);
  box-shadow: 0 12px 24px -12px rgb(0 0 0 / 0.6);
}

.card.flying {
  animation: fly 0.42s cubic-bezier(0.5, 0, 0.75, 0) var(--delay) forwards;
}

.count {
  position: absolute;
  z-index: 5;
  top: -8px;
  right: -8px;
  min-width: 22px;
  padding: 4px 6px;
  box-sizing: border-box;
  border-radius: 99px;
  background: #ef4444;
  color: #fff;
  font: 700 12px/14px system-ui, sans-serif;
  text-align: center;
}

@keyframes fly {
  to {
    translate: var(--to-x) var(--to-y);
    rotate: 0deg;
    scale: 0.15;
    opacity: 0.3;
  }
}

@media (prefers-reduced-motion: reduce) {
  .card.flying {
    animation: none;
    opacity: 0;
  }
}
</style>
