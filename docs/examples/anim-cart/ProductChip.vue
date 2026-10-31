<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem } from '@vue-dnd-kit/core';
import { price, type Product } from './products';

// The product's own overlay: a chip with its picture, name and price.
const props = defineProps<{ items: DragItem[] }>();
const product = computed(() => props.items[0]!.data as Product);
</script>

<template>
  <div class="chip-box">
    <span class="chip">
      <span class="thumb" :style="{ '--hue': product.hue }">{{ product.emoji }}</span>
      <span class="name">{{ product.name }}</span>
      <span class="cost">{{ price(product.price) }}</span>
    </span>
  </div>
</template>

<style scoped>
.chip-box {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
}

.chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px 5px 5px;
  border-radius: 99px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 14%, transparent),
    0 14px 28px -12px rgb(0 0 0 / 0.55);
  font-size: 13px;
  white-space: nowrap;
}

.thumb {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: hsl(var(--hue) 80% 65% / 0.28);
  font-size: 16px;
}

.name {
  font-weight: 600;
}

.cost {
  font: 12px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.65;
}
</style>
