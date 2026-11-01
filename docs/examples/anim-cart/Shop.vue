<script setup lang="ts">
import { ref, useTemplateRef, watchEffect } from 'vue';
import { makeSortableList, useDnD } from '@vue-dnd-kit/core';
import Product from './Product.vue';
import Cart from './Cart.vue';

const products = ref([
  { id: 'mug', name: 'Mug', emoji: '☕', price: 24 },
  { id: 'vase', name: 'Glass vase', emoji: '🏺', price: 46, fragile: true },
  { id: 'lamp', name: 'Lamp', emoji: '💡', price: 58 },
  { id: 'cactus', name: 'Cactus', emoji: '🌵', price: 19 },
]);

const shelf = useTemplateRef<HTMLElement>('shelf');
const { items } = makeSortableList(shelf, {
  items: products,
  strategy: 'horizontal',
  // The list's landing, for its items without one of their own: with a bounce.
  dropAnimation: { duration: 450, easing: 'cubic-bezier(.34, 1.56, .64, 1)' },
});

// Whose `dropAnimation` the drag will land with: the first one set, in this order. Kept
// after the drop, while it lands.
const { active, over } = useDnD();
const by = ref<'cart' | 'item' | 'list'>();
watchEffect(() => {
  if (!active.value) return;
  by.value = over.value?.id === 'cart' ? 'cart' : active.value.id === 'vase' ? 'item' : 'list';
});

const LEVELS = [
  { id: 'cart', who: 'the target', how: 'the cart: into its icon' },
  { id: 'item', who: 'the item', how: 'the vase: slowly' },
  { id: 'list', who: 'its list', how: 'the shelf: with a bounce' },
] as const;
</script>

<template>
  <div class="shop">
    <div class="aisle">
      <ul ref="shelf" class="shelf">
        <Product v-for="product in items" :key="product.id" :product="product" />
      </ul>
      <Cart />
    </div>
    <ol class="levels" aria-label="Whose dropAnimation lands the drag">
      <li v-for="level in LEVELS" :key="level.id" :class="{ chosen: by === level.id }">
        <strong>{{ level.who }}</strong>
        <span>{{ level.how }}</span>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.shop {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.aisle {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 14px;
}

.shelf {
  display: flex;
  gap: 8px;
  margin: 0;
  padding: 10px;
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 5%, transparent);
  list-style: none;
}

.levels {
  display: grid;
  gap: 4px;
  width: min(100%, 340px);
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: level;
}

.levels li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
  opacity: 0.55;
  counter-increment: level;
  transition:
    background-color 0.2s,
    opacity 0.2s;
}

.levels li::before {
  content: counter(level);
  font: 600 11px/1 ui-monospace, Menlo, Consolas, monospace;
}

.levels strong {
  min-width: 68px;
  font-weight: 600;
}

/* The one the drag lands with. */
.levels li.chosen {
  background: color-mix(in srgb, #42b883 14%, transparent);
  color: #42b883;
  opacity: 1;
}
</style>
