<script setup lang="ts">
  import { Draggable } from '@vue-dnd-kit/components';
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
    <Draggable v-slot="{ handleDragStart }" >
      <button @pointerdown="handleDragStart"> 123123123 </button>
    </Draggable>
  </div>
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
