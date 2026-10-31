<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem } from '@vue-dnd-kit/core';
import { price, type Product } from './products';

// The cart's overlay: over the cart the chip turns into what lands in it, a thumbnail
// with the price it adds. It replaces the chip (its slot, left out).
const props = defineProps<{ items: DragItem[] }>();
const product = computed(() => props.items[0]!.data as Product);
</script>

<template>
  <div class="thumb-box">
    <span class="thumb" :style="{ '--hue': product.hue }">
      {{ product.emoji }}
      <span class="plus" aria-hidden="true">+</span>
    </span>
    <span class="adds">{{ price(product.price) }}</span>
  </div>
</template>

<style scoped>
.thumb-box {
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 6px;
  width: 100%;
  height: 100%;
}

.thumb {
  position: relative;
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: Canvas;
  background-image: linear-gradient(hsl(var(--hue) 80% 65% / 0.3), hsl(var(--hue) 80% 65% / 0.3));
  box-shadow:
    0 0 0 2px #42b883,
    0 14px 28px -10px rgb(0 0 0 / 0.6);
  font-size: 26px;
}

.plus {
  position: absolute;
  top: -4px;
  right: -4px;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #42b883;
  color: #04130c;
  font: 700 15px/1 system-ui, sans-serif;
}

.adds {
  padding: 3px 8px;
  border-radius: 99px;
  background: #42b883;
  color: #04130c;
  font: 700 11px/1 ui-monospace, Menlo, Consolas, monospace;
}
</style>
