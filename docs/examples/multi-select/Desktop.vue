<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import {
  makeDroppable,
  makeSelectionArea,
  useDnD,
  useDnDMonitor,
  type Coordinates,
  type SelectionStrategy,
} from '@vue-dnd-kit/core';
import DesktopIcon from './DesktopIcon.vue';

const icons = ref([
  { id: 'docs', name: 'Documents', kind: 'folder', x: 20, y: 16 },
  { id: 'photos', name: 'Photos', kind: 'folder', x: 20, y: 112 },
  { id: 'trip', name: 'trip.jpg', kind: 'jpg', x: 120, y: 30 },
  { id: 'notes', name: 'notes.txt', kind: 'txt', x: 230, y: 70 },
  { id: 'song', name: 'song.mp3', kind: 'mp3', x: 130, y: 140 },
  { id: 'cv', name: 'cv.pdf', kind: 'pdf', x: 330, y: 24 },
]);

const strategy = ref<SelectionStrategy>('toggle');
const withShift = ref(false);

const desktop = useTemplateRef<HTMLElement>('desktop');
// A press on the empty desktop draws a band; the icons it crosses are selected.
const { isSelecting, style } = makeSelectionArea(desktop, {
  strategy,
  modifier: () => (withShift.value ? { keys: ['Shift'], method: 'every' } : undefined),
});

// The desktop takes the drop, and every dragged icon moves by the same offset.
makeDroppable(desktop, { id: 'desktop' });
const { selection, status } = useDnD();
const offset = ref<Coordinates | null>(null);
const SIZE = 76;
const clamp = (value: number, max: number) => Math.min(Math.max(0, Math.round(value)), max - SIZE);

useDnDMonitor({
  // The other selected icons follow the one in hand.
  onDragMove: ({ delta }) => (offset.value = delta),
  onDragCancel: () => (offset.value = null),
  onDragEnd({ active, delta, over }) {
    offset.value = null;
    const area = desktop.value;
    if (over?.id !== 'desktop' || !area) return;
    for (const icon of icons.value) {
      if (!active.ids.includes(icon.id)) continue;
      icon.x = clamp(icon.x + delta.x, area.clientWidth);
      icon.y = clamp(icon.y + delta.y, area.clientHeight);
    }
  },
});
</script>

<template>
  <div class="computer">
    <div class="controls">
      <div class="segmented" role="group" aria-label="strategy">
        <button type="button" :aria-pressed="strategy === 'toggle'" @click="strategy = 'toggle'">'toggle'</button>
        <button type="button" :aria-pressed="strategy === 'select'" @click="strategy = 'select'">'select'</button>
      </div>
      <button type="button" class="toggle" :aria-pressed="withShift" @click="withShift = !withShift">
        Hold Shift to draw
      </button>
    </div>
    <!-- On a narrow screen, the desktop scrolls sideways. -->
    <div class="scroll">
      <!-- The area needs a position: the band is placed inside it. -->
      <div ref="desktop" class="desktop">
        <DesktopIcon v-for="icon in icons" :key="icon.id" :icon="icon" :offset="offset" />
        <div v-if="isSelecting" class="band" :style="style" />
      </div>
    </div>
    <p class="status">{{ status === 'selecting' ? 'Selecting…' : `${selection.ids.size} selected` }}</p>
  </div>
</template>

<style scoped>
.computer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.segmented {
  display: flex;
  padding: 3px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

button {
  padding: 6px 10px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: inherit;
  font: 600 12px/1.2 system-ui, sans-serif;
  cursor: pointer;
}

.segmented button {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-weight: 400;
}

.segmented button[aria-pressed='true'] {
  background: Canvas;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
}

.toggle {
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 15%, transparent);
  opacity: 0.6;
}

.toggle[aria-pressed='true'] {
  background: color-mix(in srgb, #42b883 14%, transparent);
  box-shadow: inset 0 0 0 1px #42b883;
  color: #42b883;
  opacity: 1;
}

button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.scroll {
  overflow-x: auto;
}

.desktop {
  position: relative;
  overflow: hidden;
  min-width: 440px;
  height: 236px;
  border-radius: 14px;
  background:
    radial-gradient(circle at 80% 110%, color-mix(in srgb, #42b883 22%, transparent), transparent 55%),
    radial-gradient(circle at 0% 0%, color-mix(in srgb, #3b82f6 16%, transparent), transparent 50%),
    color-mix(in srgb, currentColor 3%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent);
  user-select: none;
}

.band {
  border: 1px solid #42b883;
  border-radius: 3px;
  background: color-mix(in srgb, #42b883 15%, transparent);
}

.status {
  margin: 0;
  font: 12px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.6;
}
</style>
