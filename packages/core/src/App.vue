<script setup lang="ts">
  import { ref } from 'vue';

  import Draggable from './components/Draggable.vue';
  import DnDProvider from './components/DnDProvider.vue';

  const test = ref([1, 2, 3, 4, 5, 6, 7]);

  const shuffle = () => {
    for (let i = test.value.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [test.value[i], test.value[j]] = [test.value[j], test.value[i]];
    }
    return test.value;
  };
</script>

<template>
  <DnDProvider>
    <Draggable
      v-for="(value, index) in test"
      :key="value"
      :index
    >
      {{ value }}
      <button @click="test.splice(index, 1)"></button>
    </Draggable>

    <button @click="shuffle">shuffle</button>
  </DnDProvider>
</template>
