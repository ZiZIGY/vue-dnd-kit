<script setup lang="ts">
  import { computed, shallowRef } from 'vue';
  import { useEventListener } from '@vueuse/core';
  import { VApp, VBtn, VMain, VSpacer, VToolbar, VToolbarTitle } from 'vuetify/components';
  import ListDemo from './demos/ListDemo.vue';
  import KanbanDemo from './demos/KanbanDemo.vue';
  import TreeDemo from './demos/TreeDemo.vue';
  import { KIT_DEMOS, readDemoHash } from '../shared/data';
  import { mdiWeatherNight, mdiWeatherSunny } from './icons';

  const demos = { list: ListDemo, kanban: KanbanDemo, tree: TreeDemo };
  const current = shallowRef(readDemoHash());
  useEventListener(window, 'hashchange', () => (current.value = readDemoHash()));
  const demo = computed(() => demos[current.value]);

  // The theme is set on <v-app> only, not globally: the page root keeps the light
  // theme's variables, so whatever is teleported out of <v-app> (the drag overlay) must
  // carry the dark theme itself.
  const dark = shallowRef(false);
</script>

<template>
  <VApp :theme="dark ? 'dark' : 'light'">
    <VToolbar
      density="compact"
      color="surface-variant"
    >
      <VBtn
        href="/"
        variant="text"
        size="small"
        >← playground</VBtn
      >
      <VToolbarTitle class="flex-grow-0 mr-4">Vuetify</VToolbarTitle>
      <VBtn
        v-for="name in KIT_DEMOS"
        :key="name"
        :href="`#${name}`"
        :variant="current === name ? 'flat' : 'text'"
        size="small"
        >{{ name }}</VBtn
      >
      <VSpacer />
      <VBtn
        :prepend-icon="dark ? mdiWeatherSunny : mdiWeatherNight"
        variant="outlined"
        size="small"
        class="mr-2"
        data-testid="theme"
        @click="dark = !dark"
        >{{ dark ? 'Light' : 'Dark' }}</VBtn
      >
    </VToolbar>
    <VMain>
      <div class="pa-4">
        <component
          :is="demo"
          :key="current"
        />
      </div>
    </VMain>
  </VApp>
</template>
