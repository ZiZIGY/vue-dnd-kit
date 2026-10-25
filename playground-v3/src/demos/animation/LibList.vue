<script setup lang="ts">
  import { computed, ref, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import LibCard from './LibCard.vue';

  const props = defineProps<{ lib: string }>();

  const card = (n: number) => ({ id: `${props.lib}-${n}`, n, hue: (n * 47) % 360 });
  let next = 6;
  const cards = ref([1, 2, 3, 4, 5].map(card));
  // `animate` comes from the provider: both libraries' lists share the same options here.
  const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), { id: props.lib, items: cards });

  // Changes no drag makes.
  const add = () => cards.value.splice(1, 0, card(next++));
  const remove = () => cards.value.splice(1, 1);
  const reverse = () => (cards.value = [...cards.value].reverse());
  const shuffle = () => (cards.value = [...cards.value].sort(() => Math.random() - 0.5));

  const order = computed(() => cards.value.map(({ n }) => n).join(','));
</script>

<template>
  <div class="toolbar">
    <button
      :data-testid="`${lib}-add`"
      @click="add"
    >
      Add
    </button>
    <button
      :data-testid="`${lib}-remove`"
      @click="remove"
    >
      Remove
    </button>
    <button
      :data-testid="`${lib}-reverse`"
      @click="reverse"
    >
      Reverse
    </button>
    <button @click="shuffle">Shuffle</button>
  </div>
  <ul
    ref="list"
    class="list"
    :data-testid="`${lib}-list`"
  >
    <LibCard
      v-for="item in items"
      :key="item.id"
      :card="item"
    />
  </ul>
  <pre
    class="order"
    :data-testid="`${lib}-order`"
    >{{ order }}</pre
  >
</template>

<style scoped>
  .toolbar {
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
  }

  .list {
    width: 240px;
  }
</style>
