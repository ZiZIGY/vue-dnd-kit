<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable, type DropAnimation, type Key } from '@vue-dnd-kit/core';
import AddToPlaylist from './AddToPlaylist.vue';

const props = defineProps<{ playlist: { id: string; name: string; hue: number; tracks: string[] } }>();
const emit = defineEmits<{ add: [ids: Key[]] }>();
const el = useTemplateRef<HTMLElement>('el');

/** The chip turns into the playlist's row: it takes its place and size, and fades into it. */
const intoRow: DropAnimation = ({ overlay, from, reducedMotion }) => {
  const to = el.value?.getBoundingClientRect();
  if (!to || reducedMotion) return overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: 'forwards' });
  const place = (rect: { left: number; top: number; width: number; height: number }, opacity: number) => ({
    transform: `translate3d(${rect.left}px, ${rect.top}px, 0)`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    opacity,
  });
  return overlay.animate([place(from, 1), place(to, 0)], { duration: 320, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' });
};

const { isOver } = makeDroppable(el, {
  id: () => props.playlist.id,
  data: () => props.playlist,
  // Over a playlist, the dragged rows become one chip that says what the drop does.
  overlay: AddToPlaylist,
  dropAnimation: intoRow,
  onDrop: (event) => emit('add', event.active.ids),
});
</script>

<template>
  <!-- Keyed by its size: a playlist that grew flashes. -->
  <div ref="el" :key="playlist.tracks.length" class="playlist" :class="{ over: isOver }">
    <span class="cover" :style="{ '--hue': playlist.hue }" aria-hidden="true">♫</span>
    <span class="text">
      <strong>{{ playlist.name }}</strong>
      <small>{{ playlist.tracks.length === 1 ? '1 song' : `${playlist.tracks.length} songs` }}</small>
    </span>
  </div>
</template>

<style scoped>
.playlist {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px;
  border-radius: 8px;
  animation: grew 0.6s ease-out;
  transition:
    background-color 0.15s,
    box-shadow 0.15s;
}

/* Songs are over it. */
.playlist.over {
  background: color-mix(in srgb, #42b883 16%, transparent);
  box-shadow: inset 0 0 0 1.5px #42b883;
}

.cover {
  display: grid;
  flex: none;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 5px;
  background: linear-gradient(135deg, hsl(var(--hue) 70% 55%), hsl(calc(var(--hue) + 60) 65% 30%));
  color: #fff;
  font-size: 16px;
}

.text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

strong {
  font-weight: 600;
}

small {
  font-size: 11px;
  opacity: 0.6;
}

@keyframes grew {
  from {
    background: color-mix(in srgb, #42b883 35%, transparent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .playlist {
    animation: none;
  }
}
</style>
