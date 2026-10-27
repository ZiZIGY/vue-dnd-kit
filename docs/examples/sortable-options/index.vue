<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import Segmented from './Segmented.vue';
import Tiles from './Tiles.vue';

const strategy = ref<'vertical' | 'horizontal' | 'grid'>('grid');
const placeholder = ref<'item' | 'indicator'>('item');
const behavior = ref<'sort' | 'swap'>('sort');
</script>

<template>
  <DnDProvider>
    <div class="demo">
      <div class="switches">
        <Segmented v-model="strategy" name="strategy" :options="['vertical', 'horizontal', 'grid']" />
        <Segmented v-model="placeholder" name="placeholder" :options="['item', 'indicator']" />
        <Segmented v-model="behavior" name="behavior" :options="['sort', 'swap']" />
      </div>
      <code class="call">makeSortableList(el, { strategy: '{{ strategy }}', placeholder: '{{ placeholder }}', behavior: '{{ behavior }}' })</code>
      <Tiles :strategy="strategy" :placeholder="placeholder" :behavior="behavior" />
    </div>
  </DnDProvider>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  max-width: 100%;
}

.switches {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

.call {
  max-width: 100%;
  padding: 6px 10px;
  overflow-x: auto;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 6%, transparent);
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  white-space: nowrap;
  color: #42b883;
}
</style>
