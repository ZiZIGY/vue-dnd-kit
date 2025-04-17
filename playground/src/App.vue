<script setup>
  import { computed } from 'vue';
  import { Draggable } from '@vue-dnd-kit/components';
  import Drag from './components/Drag.vue';

  import router from './router';

  import { useDnDStore } from '@vue-dnd-kit/core';

  const routes = computed(() => router.options.routes);

  const store = useDnDStore();
</script>

<template>
  <pre>{{ store.hovered }}</pre>
  <div class="playground">
    <header>
      <h1>Vue DnD Kit Playground</h1>
      <nav>
        <ul class="nav-links">
          <li
            v-for="route in routes"
            :key="route.path"
          >
            <router-link :to="route.path">{{ route.name }}</router-link>
          </li>
        </ul>
      </nav>
    </header>

    <main>
      <router-view />
    </main>

    <footer>
      <p>Vue DnD Kit - Библиотека для перетаскивания элементов</p>
    </footer>
  </div>
</template>

<style>
  pre {
    text-align: left;
    position: fixed;
    width: 300px;
    height: 100svh;
    overflow: auto;
    top: 0;
    left: 0;
    z-index: 1000;
    background-color: #fff;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  body {
    margin: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
      sans-serif;
    background-color: #f8fafc;
    color: #334155;
  }

  .playground {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 16px;
  }

  header {
    padding: 24px 0;
    border-bottom: 1px solid #e2e8f0;
  }

  h1 {
    margin: 0 0 16px 0;
    font-size: 28px;
    color: #0f172a;
  }

  .nav-links {
    display: flex;
    gap: 8px;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .nav-links a {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 4px;
    text-decoration: none;
    font-size: 16px;
    color: #64748b;
    transition: all 0.2s;
  }

  .nav-links a:hover {
    background-color: #f1f5f9;
    color: #334155;
  }

  .nav-links a.router-link-active {
    background-color: #e0f2fe;
    color: #0284c7;
    font-weight: 500;
  }

  main {
    flex: 1;
    padding: 24px 0;
  }

  footer {
    padding: 16px 0;
    border-top: 1px solid #e2e8f0;
    text-align: center;
    font-size: 14px;
    color: #64748b;
  }

  /* Сбрасываем стили из исходного файла */
  pre {
    max-width: none;
  }
</style>
