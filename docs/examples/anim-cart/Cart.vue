<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { makeDroppable, type DropAnimation } from '@vue-dnd-kit/core';

type Product = { id: string; emoji: string; price: number };
const bought = ref<Product[]>([]);
const total = computed(() => bought.value.reduce((sum, product) => sum + product.price, 0));

const icon = useTemplateRef<HTMLElement>('icon');
/** Products that have landed in the cart: each one bounces its icon again. */
const landed = ref(0);

/**
 * The cart's own landing, which wins over the item's and the list's: the product stays on
 * its shelf, so its slot there is no place to land. It drops into the icon, shrinking.
 */
const intoCart: DropAnimation = ({ overlay, from, reducedMotion }) => {
  const end = icon.value?.getBoundingClientRect();
  if (!end || reducedMotion) {
    landed.value++;
    return;
  }
  const scale = end.height / from.height;
  const animation = overlay.animate(
    [
      { transform: `translate3d(${from.left}px, ${from.top}px, 0)` },
      {
        // The box scales around its top left corner: centered over the icon at that size.
        transform: `translate3d(${end.left + (end.width - from.width * scale) / 2}px, ${end.top}px, 0) scale(${scale})`,
        opacity: 0,
      },
    ],
    { duration: 450, easing: 'cubic-bezier(.55, 0, .75, .2)', fill: 'forwards' },
  );
  animation.finished.then(() => landed.value++, () => {});
  return animation;
};

const el = useTemplateRef<HTMLElement>('el');
const { isOver } = makeDroppable(el, {
  id: 'cart',
  overDropAnimation: intoCart,
  // A sortable item carries its list's item.
  onDrop: (event) => {
    bought.value.push(event.active.items[0]!.item as Product);
  },
});
</script>

<template>
  <div ref="el" class="cart" :class="{ over: isOver }">
    <!-- A new element for every product in: its bounce plays again. -->
    <span :key="landed" ref="icon" class="icon" :class="{ bounce: landed > 0 }">
      🛒
      <span v-if="bought.length" class="count">{{ bought.length }}</span>
    </span>
    <strong>{{ bought.length ? `$${total}` : 'Drop to buy' }}</strong>
  </div>
</template>

<style scoped>
.cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 110px;
  min-height: 106px;
  border: 1.5px dashed color-mix(in srgb, currentColor 22%, transparent);
  border-radius: 14px;
  font-size: 12px;
  transition:
    border-color 0.2s,
    background-color 0.2s;
}

/* A product is over the cart. */
.cart.over {
  border-color: #42b883;
  background: color-mix(in srgb, #42b883 10%, transparent);
}

.icon {
  position: relative;
  font-size: 30px;
  line-height: 1;
}

.count {
  position: absolute;
  top: -6px;
  right: -10px;
  min-width: 18px;
  padding: 3px 4px;
  box-sizing: border-box;
  border-radius: 99px;
  background: #42b883;
  color: #04130c;
  font: 700 10px/1 ui-monospace, Menlo, Consolas, monospace;
  text-align: center;
}

strong {
  font: 600 12px/1 ui-monospace, Menlo, Consolas, monospace;
}

@media (prefers-reduced-motion: no-preference) {
  .icon.bounce {
    animation: bounce 0.45s cubic-bezier(0.3, 1.6, 0.5, 1);
  }
}

@keyframes bounce {
  40% {
    scale: 1.3;
    rotate: -10deg;
  }
}
</style>
