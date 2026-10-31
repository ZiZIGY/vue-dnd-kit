<script setup lang="ts">
  import { computed, shallowRef } from 'vue';
  import { useEventListener } from '@vueuse/core';
  import { useDisplay } from 'vuetify';
  import { VApp, VBtn, VMain, VSpacer, VToolbar, VToolbarTitle } from 'vuetify/components';
  import ListDemo from './demos/ListDemo.vue';
  import KanbanDemo from './demos/KanbanDemo.vue';
  import TreeDemo from './demos/TreeDemo.vue';
  import VirtualDemo from './demos/VirtualDemo.vue';
  import { KIT_DEMOS, readDemoHash } from '../shared/data';
  import { mdiWeatherNight, mdiWeatherSunny } from './icons';

  const demos = { list: ListDemo, kanban: KanbanDemo, tree: TreeDemo, virtual: VirtualDemo };
  const current = shallowRef(readDemoHash());
  useEventListener(window, 'hashchange', () => (current.value = readDemoHash()));
  const demo = computed(() => demos[current.value]);

  // The theme is set on <v-app> only, not globally: the page root keeps the light
  // theme's variables, so whatever is teleported out of <v-app> (the drag overlay) must
  // carry the dark theme itself.
  const dark = shallowRef(false);
  // On a phone the one-line toolbar would clip its last buttons: no title, an icon-only toggle.
  const { xs } = useDisplay();
  // In the Lab's frame the Lab is around it already: no way back to it from here.
  const framed = window.top !== window;
</script>

<template>
  <VApp :theme="dark ? 'dark' : 'light'">
    <VToolbar
      density="compact"
      color="surface-variant"
    >
      <VBtn
        v-if="!framed"
        href="/"
        variant="text"
        size="small"
        >← playground</VBtn
      >
      <!-- `flex-0-0`: the title's own `flex: 1 1` (zero basis) would collapse it to no width. -->
      <VToolbarTitle
        v-if="!xs"
        class="flex-0-0 mr-4"
        >Vuetify</VToolbarTitle
      >
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
        v-if="xs"
        :icon="dark ? mdiWeatherSunny : mdiWeatherNight"
        :aria-label="dark ? 'Light' : 'Dark'"
        variant="text"
        size="small"
        data-testid="theme"
        @click="dark = !dark"
      />
      <VBtn
        v-else
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
