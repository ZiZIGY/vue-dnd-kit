<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeDroppable, makeSelectionArea, useDnD } from '@vue-dnd-kit/core';
import DesktopIcon from './DesktopIcon.vue';
import { SIZE, type Icon } from './icons';

const icons = ref<Icon[]>([
  { id: 'docs', name: 'Documents', kind: 'folder', x: 20, y: 16 },
  { id: 'photos', name: 'Photos', kind: 'folder', x: 20, y: 112 },
  { id: 'trip', name: 'trip.jpg', kind: 'jpg', x: 120, y: 30 },
  { id: 'notes', name: 'notes.txt', kind: 'txt', x: 230, y: 70 },
  { id: 'song', name: 'song.mp3', kind: 'mp3', x: 130, y: 140 },
  { id: 'cv', name: 'cv.pdf', kind: 'pdf', x: 330, y: 24 },
]);

const desktop = useTemplateRef<HTMLElement>('desktop');
// A press on the empty desktop draws a band; the icons it crosses are selected.
const { isSelecting, style } = makeSelectionArea(desktop);

const clamp = (value: number, max: number) => Math.min(Math.max(0, Math.round(value)), max - SIZE);

makeDroppable(desktop, {
  id: 'desktop',
  // `position` is where the grabbed icon was let go, on the desktop: it goes there, and
  // the others keep their places around it. All of them stay on the desktop.
  onDrop: ({ active, position }) => {
    const area = desktop.value;
    const grabbed = icons.value.find((icon) => icon.id === active.id);
    if (!area || !grabbed || !position) return;
    const shift = { x: position.x - grabbed.x, y: position.y - grabbed.y };
    for (const icon of icons.value) {
      if (!active.ids.includes(icon.id)) continue;
      icon.x = clamp(icon.x + shift.x, area.clientWidth);
      icon.y = clamp(icon.y + shift.y, area.clientHeight);
    }
  },
});

const { selection, status } = useDnD();
</script>

<template>
  <div class="computer">
    <!-- On a narrow screen, the desktop scrolls sideways. -->
    <div class="scroll">
      <!-- The area needs a position: the band is placed inside it. -->
      <div ref="desktop" class="desktop">
        <DesktopIcon v-for="icon in icons" :key="icon.id" :icon="icon" />
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
