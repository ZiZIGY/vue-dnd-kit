<script setup lang="ts">
import { ref } from 'vue';
import ProductCard from './ProductCard.vue';
import Cart from './Cart.vue';
import { PRODUCTS, type Product } from './products';

const cart = ref<Array<{ product: Product; quantity: number }>>([]);

const add = (product: Product) => {
  const line = cart.value.find((line) => line.product.id === product.id);
  if (line) line.quantity++;
  else cart.value.push({ product, quantity: 1 });
};
</script>

<template>
  <div class="shop">
    <section class="catalog">
      <ProductCard v-for="product in PRODUCTS" :key="product.id" :product="product" />
    </section>
    <Cart :lines="cart" @add="add" @clear="cart = []" />
  </div>
</template>

<style scoped>
.shop {
  display: grid;
  grid-template-columns: 1fr 210px;
  gap: 14px;
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
}

.catalog {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

@media (max-width: 560px) {
  .shop {
    grid-template-columns: 1fr;
  }

  .catalog {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
