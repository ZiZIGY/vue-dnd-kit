<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { makeDroppable, type DropAnimation, type Rect } from '@vue-dnd-kit/core';
import CartThumb from './CartThumb.vue';
import { price, type Product } from './products';

const props = defineProps<{ lines: Array<{ product: Product; quantity: number }> }>();
const emit = defineEmits<{ add: [product: Product]; clear: [] }>();

const count = computed(() => props.lines.reduce((sum, line) => sum + line.quantity, 0));
const total = computed(() => props.lines.reduce((sum, line) => sum + line.quantity * line.product.price, 0));

// The cart bounces when a thumbnail lands in it.
const landed = ref(0);
const icon = useTemplateRef<HTMLElement>('icon');

/**
 * Keyframes for the box `from` its rect up over both and down to `to`, on a curve,
 * shrinking. The box scales around its top left corner: each one is placed by its center.
 */
const arc = (from: Rect, to: DOMRect, steps = 12): Keyframe[] => {
  const a = { x: from.left + from.width / 2, y: from.top + from.height / 2 };
  const b = { x: to.left + to.width / 2, y: to.top + to.height / 2 };
  const top = { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - 70 };
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const x = (1 - t) ** 2 * a.x + 2 * (1 - t) * t * top.x + t ** 2 * b.x;
    const y = (1 - t) ** 2 * a.y + 2 * (1 - t) * t * top.y + t ** 2 * b.y;
    const scale = 1 - 0.75 * t;
    return {
      transform: `translate3d(${x - (from.width * scale) / 2}px, ${y - (from.height * scale) / 2}px, 0) scale(${scale})`,
      opacity: t < 0.9 ? 1 : 0,
    };
  });
};

/** The thumbnail is tossed into the cart's icon, and the cart bounces when it lands. */
const intoCart: DropAnimation = ({ overlay, from, reducedMotion }) => {
  const end = icon.value?.getBoundingClientRect();
  if (!end || reducedMotion) {
    landed.value++;
    return overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: 'forwards' });
  }
  const animation = overlay.animate(arc(from, end), { duration: 520, easing: 'cubic-bezier(0.3, 0, 0.7, 1)', fill: 'forwards' });
  animation.finished.then(() => landed.value++, () => {});
  return animation;
};

const el = useTemplateRef<HTMLElement>('el');
const { isOver } = makeDroppable(el, {
  id: 'cart',
  // Over the cart, the chip turns into the thumbnail that drops in.
  overlay: CartThumb,
  dropAnimation: intoCart,
  onDrop: (event) => emit('add', event.active.data as Product),
});
</script>

<template>
  <aside ref="el" class="cart" :class="{ over: isOver }">
    <header>
      <span :key="landed" ref="icon" class="cart-icon" :class="{ bounce: landed }">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
        <span v-if="count" class="badge">{{ count }}</span>
      </span>
      Cart
      <button v-if="lines.length" type="button" class="clear" @click="emit('clear')">Clear</button>
    </header>

    <ul v-if="lines.length" class="lines">
      <li v-for="line in lines" :key="line.product.id">
        <span class="emoji">{{ line.product.emoji }}</span>
        <span class="name">{{ line.product.name }}</span>
        <span v-if="line.quantity > 1" class="quantity">×{{ line.quantity }}</span>
        <span class="cost">{{ price(line.quantity * line.product.price) }}</span>
      </li>
    </ul>
    <p v-else class="empty">Drag products here</p>

    <footer v-if="lines.length">
      Total <strong>{{ price(total) }}</strong>
    </footer>
  </aside>
</template>

<style scoped>
.cart {
  display: flex;
  flex-direction: column;
  min-height: 240px;
  padding: 12px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  font-size: 13px;
  transition:
    border-color 0.2s,
    background-color 0.2s;
}

/* A product is over the cart. */
.cart.over {
  border-color: #42b883;
  background: color-mix(in srgb, #42b883 8%, Canvas);
}

header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-weight: 600;
}

.cart-icon {
  position: relative;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 8%, transparent);
}

.cart-icon.bounce {
  animation: bounce 0.45s cubic-bezier(0.3, 1.6, 0.5, 1);
}

.cart-icon svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 17px;
  padding: 3px 4px;
  box-sizing: border-box;
  border-radius: 99px;
  background: #42b883;
  color: #04130c;
  font: 700 10px/1 ui-monospace, Menlo, Consolas, monospace;
  text-align: center;
}

.clear {
  margin-left: auto;
  padding: 3px 8px;
  border: 0;
  border-radius: 6px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  color: inherit;
  font: inherit;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
}

.lines {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.lines li {
  display: flex;
  align-items: center;
  gap: 7px;
  animation: arrive 0.3s 0.4s ease-out backwards;
}

.emoji {
  font-size: 16px;
}

.name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.quantity {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.6;
}

.cost {
  margin-left: auto;
  font: 12px/1 ui-monospace, Menlo, Consolas, monospace;
}

.empty {
  display: grid;
  flex: 1;
  place-items: center;
  margin: 0;
  border: 1.5px dashed color-mix(in srgb, currentColor 18%, transparent);
  border-radius: 10px;
  opacity: 0.6;
}

footer {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid color-mix(in srgb, currentColor 10%, transparent);
}

footer strong {
  font: 700 13px/1 ui-monospace, Menlo, Consolas, monospace;
}

@keyframes bounce {
  40% {
    scale: 1.25;
    rotate: -8deg;
  }
}

/* A new line slides in as the thumbnail lands. */
@keyframes arrive {
  from {
    opacity: 0;
    translate: 0 -6px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cart-icon.bounce,
  .lines li {
    animation: none;
  }
}
</style>
