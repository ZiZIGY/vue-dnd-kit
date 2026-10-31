<script setup lang="ts">
  import { ref, watchEffect } from 'vue';
  import UApp from '@nuxt/ui/components/App.vue';
  import LabDevtools from './LabDevtools.vue';
  import LabHeader from './LabHeader.vue';
  import LabPanel from './LabPanel.vue';
  import LabSearch from './LabSearch.vue';
  import LabSidebar from './LabSidebar.vue';
  import LabStage from './LabStage.vue';
  import { demo, devtoolsOpen, panelOpen } from './state';

  const searching = ref(false);
  const resizing = ref(false);

  watchEffect(() => (document.title = `${demo.value.title} · vue-dnd-kit playground`));
</script>

<template>
  <UApp>
    <div class="flex h-dvh flex-col bg-default text-default">
      <LabHeader @search="searching = true" />
      <div class="grid min-h-0 flex-1 grid-cols-[15rem_minmax(0,1fr)_auto] max-md:grid-cols-[minmax(0,1fr)_auto]">
        <LabSidebar class="max-md:hidden" />
        <main class="flex min-h-0 flex-col">
          <LabStage :resizing="resizing" />
          <LabDevtools
            v-if="devtoolsOpen"
            v-model:resizing="resizing"
          />
        </main>
        <LabPanel
          v-if="panelOpen"
          class="max-lg:hidden"
        />
      </div>
    </div>
    <LabSearch v-model:open="searching" />
  </UApp>
</template>
