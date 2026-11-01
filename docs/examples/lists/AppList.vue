<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import AppTile from './AppTile.vue';
import AppOverlay from './AppOverlay.vue';

type App = { id: string; name: string };
const apps = defineModel<App[]>({ required: true });
const props = defineProps<{ dock?: boolean; limit?: number }>();

// The grid and the dock: one group, so apps move between them. `strategy` says how each
// flows, in two dimensions or in a row. `overlay`: the icon alone follows the pointer.
const el = useTemplateRef<HTMLElement>('el');
const { items, isOver, isAccepting } = makeSortableList(el, {
  items: apps,
  // A full list takes no more apps; its own still sort.
  group: { name: 'home', put: ({ from, to }) => from === to || !props.limit || apps.value.length < props.limit },
  strategy: props.dock ? 'horizontal' : 'grid',
  overlay: AppOverlay,
});
</script>

<template>
  <div ref="el" :class="[dock ? 'dock' : 'grid', { full: isOver && !isAccepting }]">
    <AppTile v-for="app in items" :key="app.id" :app="app" :in-dock="dock" />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, 64px);
  gap: 20px 14px;
}

/* Room for four icons, whatever it holds. */
.dock {
  display: flex;
  gap: 14px;
  box-sizing: border-box;
  min-width: 298px;
  min-height: 88px;
  padding: 12px;
  border-radius: 22px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  transition: box-shadow 0.15s;
}

.dock.full {
  box-shadow: inset 0 0 0 1.5px #e5484d;
}
</style>
