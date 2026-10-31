<script setup lang="ts">
  import { computed, shallowRef, type Component } from 'vue';
  import { useEventListener } from '@vueuse/core';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import { DEMOS } from './catalog';

  // The demo page: `/demo/#<id>` renders one demo of the catalog, on its own (e2e) or in
  // the Lab's frame. Every demo is loaded with the page: `goto` finds it rendered.
  const components = import.meta.glob<Component>('./demos/**/*.vue', { eager: true, import: 'default' });
  const demos = new Map(DEMOS.flatMap((demo) => (demo.file ? [[demo.id, components[`./demos/${demo.file}`]!]] : [])));

  const readHash = () => {
    const id = location.hash.slice(1);
    return demos.has(id) ? id : 'sortable';
  };

  const current = shallowRef(readHash());
  useEventListener(window, 'hashchange', () => (current.value = readHash()));
  const demo = computed(() => demos.get(current.value));
</script>

<template>
  <main>
    <!-- Example apps bring their own DnDProvider. -->
    <DnDProvider>
      <component
        :is="demo"
        :key="current"
      />
    </DnDProvider>
  </main>
</template>
