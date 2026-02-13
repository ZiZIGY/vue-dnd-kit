<script setup lang="ts">
  import { computed } from 'vue';

  const counter = defineModel<number>('counter', {
    default: 0,
  });

  const name = defineModel<string>('name', {
    default: '',
    set: (value: string) => {
      console.log('set', value);
      return value;
    },
    validator: (value: string) => {
      return value.length > 0;
    },
  });

  const data = computed(() => {
    return {
      counter: counter.value,
      name: name.value,
    };
  });

  defineExpose({
    data,
  });
</script>

<template>
  <div>
    <button @click="counter++">Increment</button>
    <button @click="counter--">Decrement</button>
    <button @click="counter = 0">Reset</button>

    <input
      type="text"
      v-model="name"
    />

    <pre>{{ name }} {{ counter }}</pre>
  </div>
</template>
