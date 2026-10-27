<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from 'vue';
import { useVirtualList } from '@vueuse/core';
import { makeSortableList } from '@vue-dnd-kit/core';
import Row from './Row.vue';
import { makeTasks } from './rows';

const ROW = 44;
// A big array in a shallowRef: the library never walks into your data.
const tasks = shallowRef(makeTasks(10_000));

// The outer element is the sortable list: `containerProps` owns the scroller's ref.
const listRef = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(listRef, { items: tasks });

// Fed with the draft `items`, so the rows move while you drag. A number keeps VueUse's
// math O(1): the row's real height.
const { list, containerProps, wrapperProps } = useVirtualList(items, { itemHeight: ROW, overscan: 8 });
const mounted = computed(() => list.value.length);
</script>

<template>
  <div class="panel">
    <header>
      <strong>Backlog</strong>
      <span class="meta">{{ tasks.length.toLocaleString('en') }} rows · {{ mounted }} in the DOM</span>
    </header>
    <div ref="list">
      <div v-bind="containerProps" class="scroller">
        <div v-bind="wrapperProps">
          <!-- Keyed by id, not by index as in VueUse's docs. -->
          <Row v-for="{ data } in list" :key="data.id" :task="data" :height="ROW" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel {
  width: min(420px, 100%);
  overflow: hidden;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 14px;
  background: Canvas;
}

header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 14px;
  border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  font-size: 14px;
}

.meta {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}

.scroller {
  height: 308px;
}
</style>
