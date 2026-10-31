<script setup lang="ts">
  import { computed, shallowRef } from 'vue';
  import { useDark, useEventListener } from '@vueuse/core';
  import UApp from '@nuxt/ui/components/App.vue';
  import UButton from '@nuxt/ui/components/Button.vue';
  import ListDemo from './demos/ListDemo.vue';
  import KanbanDemo from './demos/KanbanDemo.vue';
  import TreeDemo from './demos/TreeDemo.vue';
  import VirtualDemo from './demos/VirtualDemo.vue';
  import { KIT_DEMOS, readDemoHash } from '../shared/data';

  const demos = { list: ListDemo, kanban: KanbanDemo, tree: TreeDemo, virtual: VirtualDemo };
  const current = shallowRef(readDemoHash());
  useEventListener(window, 'hashchange', () => (current.value = readDemoHash()));
  const demo = computed(() => demos[current.value]);

  // Nuxt UI's color mode: the `dark` class on <html>.
  const isDark = useDark();
  // In the Lab's frame the Lab is around it already: no way back to it from here.
  const framed = window.top !== window;
</script>

<template>
  <UApp>
    <header class="flex flex-wrap items-center gap-2 border-b border-default bg-elevated px-4 py-2">
      <a
        v-if="!framed"
        href="/"
        class="mr-2 text-sm text-muted hover:text-default"
        >← playground</a
      >
      <span class="mr-4 font-semibold text-highlighted">Nuxt UI</span>
      <UButton
        v-for="name in KIT_DEMOS"
        :key="name"
        :href="`#${name}`"
        :label="name"
        :variant="current === name ? 'solid' : 'ghost'"
        color="neutral"
        size="sm"
      />
      <UButton
        class="ml-auto"
        :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
        :label="isDark ? 'Light' : 'Dark'"
        color="neutral"
        variant="outline"
        size="sm"
        data-testid="theme"
        @click="isDark = !isDark"
      />
    </header>
    <main class="p-4">
      <component
        :is="demo"
        :key="current"
      />
    </main>
  </UApp>
</template>
