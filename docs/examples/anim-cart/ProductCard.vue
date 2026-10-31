<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable, snapCenterToCursor } from '@vue-dnd-kit/core';
import ProductChip from './ProductChip.vue';
import { price, type Product } from './products';

const props = defineProps<{ product: Product }>();
const el = useTemplateRef<HTMLElement>('el');
const { isDragging } = makeDraggable(el, {
  id: () => props.product.id,
  data: () => props.product,
  // A small chip under the cursor rather than the whole card.
  overlay: ProductChip,
  modifiers: [snapCenterToCursor],
});
</script>

<template>
  <article ref="el" class="product" :class="{ away: isDragging }">
    <span class="thumb" :style="{ '--hue': product.hue }">{{ product.emoji }}</span>
    <strong class="name">{{ product.name }}</strong>
    <span class="cost">{{ price(product.price) }}</span>
  </article>
</template>

<style scoped>
.product {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 8px 10px;
  border-radius: 12px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 10%, transparent),
    0 2px 6px -3px rgb(0 0 0 / 0.3);
  cursor: grab;
  user-select: none;
  transition:
    opacity 0.2s,
    scale 0.2s;
}

.product:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.product.away {
  opacity: 0.45;
  scale: 0.97;
}

.thumb {
  display: grid;
  place-items: center;
  aspect-ratio: 4 / 3;
  margin-bottom: 4px;
  border-radius: 8px;
  background: linear-gradient(145deg, hsl(var(--hue) 80% 65% / 0.28), hsl(var(--hue) 70% 50% / 0.1));
  font-size: 30px;
}

.name {
  font-size: 13px;
  font-weight: 600;
}

.cost {
  font: 12px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.65;
}
</style>
