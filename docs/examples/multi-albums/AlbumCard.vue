<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable, type DropAnimation, type Key } from '@vue-dnd-kit/core';
import AddToAlbum from './AddToAlbum.vue';

const props = defineProps<{
  album: { id: string; name: string; photos: string[] };
  cover?: { emoji: string; hue: number };
}>();
const emit = defineEmits<{ add: [ids: Key[]] }>();

const coverEl = useTemplateRef<HTMLElement>('coverEl');

/** The stack shrinks into the album's cover. */
const intoCover: DropAnimation = ({ overlay, from, reducedMotion }) => {
  const end = coverEl.value?.getBoundingClientRect();
  if (!end || reducedMotion) return overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: 'forwards' });
  // The box scales around its top left corner: it is placed by its center.
  const scale = end.width / from.width;
  const x = end.left + end.width / 2 - (from.width * scale) / 2;
  const y = end.top + end.height / 2 - (from.height * scale) / 2;
  return overlay.animate(
    [
      { transform: `translate3d(${from.left}px, ${from.top}px, 0)`, opacity: 1 },
      { transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`, opacity: 0.6 },
    ],
    { duration: 380, easing: 'cubic-bezier(0.55, 0, 0.25, 1)', fill: 'forwards' },
  );
};

const el = useTemplateRef<HTMLElement>('el');
const { isOver } = makeDroppable(el, {
  id: () => props.album.id,
  data: () => props.album,
  // Over the album, the stack gets what the drop will do under it.
  overlay: AddToAlbum,
  dropAnimation: intoCover,
  onDrop: (event) => emit('add', event.active.ids),
});
</script>

<template>
  <div ref="el" class="album" :class="{ over: isOver }">
    <!-- Keyed by the cover photo: a new cover pops in. -->
    <span ref="coverEl" :key="album.photos[0]" class="cover" :class="{ photo: cover }" :style="cover && { '--hue': cover.hue }">
      {{ cover?.emoji ?? '+' }}
    </span>
    <span class="text">
      <strong>{{ album.name }}</strong>
      <small :key="album.photos.length">{{ album.photos.length }} {{ album.photos.length === 1 ? 'photo' : 'photos' }}</small>
    </span>
  </div>
</template>

<style scoped>
.album {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px;
  border-radius: 10px;
  transition:
    background-color 0.15s,
    box-shadow 0.15s;
}

/* Photos are over it. */
.album.over {
  background: color-mix(in srgb, #42b883 14%, transparent);
  box-shadow: inset 0 0 0 1.5px #42b883;
}

.cover {
  display: grid;
  flex: none;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font-size: 22px;
  animation: pop 0.4s cubic-bezier(0.3, 1.5, 0.5, 1);
}

.cover.photo {
  background: linear-gradient(160deg, hsl(var(--hue) 75% 62% / 0.6), hsl(calc(var(--hue) + 40) 70% 35% / 0.5)), Canvas;
}

.text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

strong {
  overflow: hidden;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

small {
  font-size: 11px;
  opacity: 0.6;
  animation: pop 0.4s cubic-bezier(0.3, 1.5, 0.5, 1);
}

@keyframes pop {
  from {
    scale: 0.6;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cover,
  small {
    animation: none;
  }
}
</style>
