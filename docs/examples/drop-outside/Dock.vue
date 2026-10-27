<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList, type DropOutside } from '@vue-dnd-kit/core';
import DockIcon from './DockIcon.vue';

const props = defineProps<{ dropOutside: DropOutside }>();

const APPS = [
  { id: 'mail', name: 'Mail', hue: 210 },
  { id: 'calendar', name: 'Calendar', hue: 350 },
  { id: 'notes', name: 'Notes', hue: 45 },
  { id: 'photos', name: 'Photos', hue: 280 },
  { id: 'weather', name: 'Weather', hue: 190 },
  { id: 'terminal', name: 'Terminal', hue: 220 },
];
const apps = ref([...APPS]);
const notice = ref('Drag an app off the dock and let go');

const dock = useTemplateRef<HTMLElement>('dock');
const { items } = makeSortableList(dock, {
  items: apps,
  strategy: 'horizontal',
  // What a drop outside every target does. Read at the drop.
  dropOutside: () => props.dropOutside,
  // Called on the list the items leave, with `to.index` -1, when they are removed.
  onDrop: (event) => {
    if (event.to.index === -1) notice.value = `Removed ${event.items.map((app) => app.name).join(', ')}`;
  },
});

const reset = () => {
  apps.value = [...APPS];
  notice.value = 'Dock reset';
};
</script>

<template>
  <div class="area">
    <ul ref="dock" class="dock">
      <DockIcon v-for="app in items" :key="app.id" :app="app" />
    </ul>
    <p class="notice" role="status">
      {{ notice }}
      <button v-if="apps.length < APPS.length" type="button" @click="reset">Reset</button>
    </p>
  </div>
</template>

<style scoped>
.area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding-top: 40px;
}

.dock {
  display: flex;
  gap: 6px;
  min-width: 80px;
  min-height: 58px;
  margin: 0;
  padding: 8px;
  border: 1px solid color-mix(in srgb, currentColor 14%, transparent);
  border-radius: 20px;
  background: color-mix(in srgb, currentColor 6%, Canvas);
  box-shadow: 0 12px 32px -12px rgb(0 0 0 / 0.5);
  list-style: none;
}

.notice {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 26px;
  margin: 0;
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.7;
}

button {
  padding: 4px 9px;
  border: 0;
  border-radius: 7px;
  background: color-mix(in srgb, currentColor 10%, transparent);
  color: inherit;
  font: inherit;
  cursor: pointer;
}

button:focus-visible {
  outline: 2px solid #42b883;
}
</style>
