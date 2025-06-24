<script setup lang="ts">
  import HTMLBuilderArea from './HTMLBuilderArea.vue';
  import HTMLBuilderComponents from './HTMLBuilderComponents.vue';
  import HTMLBuilderTree from './HTMLBuilderTree.vue';
  import HTMLBuilderConfig from './HTMLBuilderConfig.vue';
  import { ref } from 'vue';
  import type { IHTMLBuilderElement } from './types';

  import { useHTMLBuilderStore } from './utils';

  const components = ref<IHTMLBuilderElement[]>([]);

  defineExpose({
    components,
  });

  const builderStore = useHTMLBuilderStore();
</script>

<template>
  <div class="html-builder">
    <HTMLBuilderTree
      :components="components"
      class="html-builder-tree"
    />
    <HTMLBuilderArea
      :components="components"
      class="html-builder-area"
    />
    <HTMLBuilderComponents class="html-builder-components" />
    <HTMLBuilderConfig
      v-if="builderStore.activeElement.value"
      class="html-builder-config"
    />
  </div>
</template>

<style src="./styles.css"></style>
