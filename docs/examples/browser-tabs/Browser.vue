<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import Tab from './Tab.vue';

const tabs = ref([
  { id: 1, title: 'Vue.js', hue: 153 },
  { id: 2, title: 'Pull requests', hue: 260 },
  { id: 3, title: 'Inbox (3)', hue: 0 },
  { id: 4, title: 'Weather', hue: 200 },
]);
const activeId = ref(1);
const active = computed(() => tabs.value.find((tab) => tab.id === activeId.value));
const address = computed(() => (active.value ? `${active.value.title.toLowerCase().replace(/\W+/g, '')}.example` : ''));

const strip = useTemplateRef<HTMLElement>('strip');
// One row: `strategy: 'horizontal'`, and the tabs stay on it (`axis: 'x'`). `animate`
// slides the others when a button opens or closes a tab, which no drag did.
const { items } = makeSortableList(strip, { items: tabs, strategy: 'horizontal', axis: 'x', animate: true });

let next = 5;
const open = () => {
  const tab = { id: next++, title: 'New tab', hue: (next * 47) % 360 };
  tabs.value.push(tab);
  activeId.value = tab.id;
};
const close = (id: number) => {
  const index = tabs.value.findIndex((tab) => tab.id === id);
  tabs.value.splice(index, 1);
  if (id === activeId.value) activeId.value = (tabs.value[index] ?? tabs.value[index - 1])?.id ?? 0;
};
</script>

<template>
  <div class="browser">
    <div class="bar">
      <ul ref="strip" class="tabs" role="tablist">
        <Tab
          v-for="tab in items"
          :key="tab.id"
          :tab="tab"
          :active="tab.id === activeId"
          @select="activeId = tab.id"
          @close="close(tab.id)"
        />
      </ul>
      <button type="button" class="new" aria-label="New tab" @click="open">+</button>
    </div>
    <div class="address">{{ address }}</div>
    <div class="page">
      <template v-if="active">
        <strong>{{ active.title }}</strong>
        <span>Tab {{ tabs.indexOf(active) + 1 }} of {{ tabs.length }}</span>
      </template>
      <span v-else>No tabs open</span>
    </div>
  </div>
</template>

<style scoped>
.browser {
  overflow: hidden;
  width: 560px;
  max-width: 100%;
  margin: 0 auto;
  border: 1px solid color-mix(in srgb, currentColor 14%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 2%, Canvas);
}

.bar {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  padding: 8px 8px 0;
  background: color-mix(in srgb, currentColor 7%, Canvas);
}

.tabs {
  display: flex;
  flex: 1;
  gap: 2px;
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.new {
  flex: none;
  width: 28px;
  height: 28px;
  margin-bottom: 3px;
  padding: 0;
  border: 0;
  border-radius: 7px;
  background: none;
  color: inherit;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.new:hover {
  background: color-mix(in srgb, currentColor 12%, transparent);
}

.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 130px;
  font-size: 13px;
}

.address {
  height: 28px;
  margin: 8px 8px 0;
  padding: 0 12px;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 7%, Canvas);
  font: 11px/28px ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.7;
}

.page strong {
  font-size: 22px;
  letter-spacing: -0.02em;
}

.page span {
  opacity: 0.55;
}
</style>
