<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import MediaTile from './MediaTile.vue';
import StripOverlay from './StripOverlay.vue';

type Media = { id: string; kind: 'photo' | 'video'; hue: number };
const props = defineProps<{ id: string; title: string; columns: number; photosOnly?: boolean }>();
const media = defineModel<Media[]>({ required: true });

const list = useTemplateRef<HTMLElement>('list');
const { items, isOver } = makeSortableList(list, {
  id: props.id,
  items: media,
  strategy: 'grid',
  // Every drag that starts here shows this component in the overlay box.
  overlay: StripOverlay,
  group: { name: 'media', put: ({ types }) => !props.photosOnly || types.every((type) => type === 'photo') },
  // Hold Alt while moving to the other list: a copy (`mode: 'copy'`).
  clone: (item) => ({ ...item, id: `${item.id}-${Math.random().toString(36).slice(2, 6)}` }),
});
</script>

<template>
  <section class="shelf" :class="{ over: isOver }">
    <h3>{{ title }}</h3>
    <ul ref="list" :style="{ gridTemplateColumns: `repeat(${columns}, 56px)` }">
      <MediaTile v-for="item in items" :key="item.id" :item="item" />
    </ul>
  </section>
</template>

<style scoped>
.shelf {
  padding: 10px;
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 4%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 10%, transparent);
  transition: box-shadow 0.15s;
}

.shelf.over {
  box-shadow: inset 0 0 0 1.5px #42b883;
}

h3 {
  margin: 0 2px 8px;
  font-size: 12px;
  font-weight: 600;
}

ul {
  display: grid;
  gap: 8px;
  min-height: 56px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
