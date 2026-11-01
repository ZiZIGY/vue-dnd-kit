<script setup lang="ts">
import { reactive } from 'vue';
import Column from './Column.vue';

const columns = reactive([
  {
    id: 'applied',
    title: 'Applied',
    color: '#a1a1aa',
    cards: [
      { id: 'mira', name: 'Mira Okafor', role: 'Product designer', hue: 280, score: 4 },
      { id: 'tom', name: 'Tom Becker', role: 'Frontend engineer', hue: 200, score: 3 },
      { id: 'yuki', name: 'Yuki Sato', role: 'Data analyst', hue: 20, score: 5 },
    ],
  },
  {
    id: 'interview',
    title: 'Interview',
    color: '#f59e0b',
    cards: [
      { id: 'lena', name: 'Lena Ivanova', role: 'Backend engineer', hue: 150, score: 4 },
      { id: 'raj', name: 'Raj Patel', role: 'Product manager', hue: 330, score: 3 },
    ],
  },
  {
    id: 'offer',
    title: 'Offer',
    color: '#42b883',
    cards: [{ id: 'ana', name: 'Ana Costa', role: 'QA engineer', hue: 100, score: 5 }],
  },
]);
</script>

<template>
  <div class="board">
    <Column v-for="column in columns" :key="column.id" :column="column" />
  </div>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 240px));
  gap: 14px;
  justify-content: center;
}
</style>
