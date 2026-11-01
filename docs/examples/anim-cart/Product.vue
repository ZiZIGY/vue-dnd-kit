<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ product: { id: string; name: string; emoji: string; price: number; fragile?: boolean } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, {
  item: () => props.product,
  // An item's own landing wins over its list's: the vase lands slowly.
  dropAnimation: props.product.fragile ? { duration: 1100, easing: 'ease-in-out' } : undefined,
});
</script>

<template>
  <li ref="el" class="product">
    <span class="picture">{{ product.emoji }}</span>
    <strong>{{ product.name }}</strong>
    <span class="price">${{ product.price }}</span>
  </li>
</template>

<style scoped>
.product {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  width: 76px;
  padding: 8px 6px;
  box-sizing: border-box;
  border-radius: 12px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent);
  cursor: grab;
  user-select: none;
}

.product:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

[data-dnd-overlay] .product {
  box-shadow:
    0 0 0 1.5px #42b883,
    0 16px 28px -12px rgb(0 0 0 / 0.55);
}

/* The slot on the shelf: where the product lands, unless the cart takes it. */
.product[data-dnd-placeholder] {
  opacity: 1;
  background: none;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 22%, transparent);
}

.product[data-dnd-placeholder] > * {
  visibility: hidden;
}

.picture {
  font-size: 28px;
  line-height: 1.2;
}

strong {
  font-size: 12px;
  font-weight: 600;
}

.price {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.6;
}
</style>
