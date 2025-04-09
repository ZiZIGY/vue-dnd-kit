<script setup lang="ts">
  import Draggable from './components/Draggable.vue';

  import { useDnDStore } from '@vue-dnd-kit/core';

  const store = useDnDStore();
</script>

<template>
  <div>
    <a
      href="https://vite.dev"
      target="_blank"
    >
      <img
        src="/vite.svg"
        class="logo"
        alt="Vite logo"
      />
    </a>
    <a
      href="https://vuejs.org/"
      target="_blank"
    >
      <img
        src="./assets/vue.svg"
        class="logo vue"
        alt="Vue logo"
      />
    </a>
  </div>
  <Draggable :groups="['item']" />
  <Draggable
    v-for="i in 1_000"
    :key="i"
    :groups="['sex']"
  />
</template>

<style scoped>
  pre {
    position: fixed;
    top: 0;
    left: 0;
    height: 100svh;
    overflow: scroll;
    width: 300px;
    text-align: left;
  }
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
  }
</style>
