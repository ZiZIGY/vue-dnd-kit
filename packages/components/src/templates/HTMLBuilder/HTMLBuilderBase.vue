<script setup lang="ts">
  import HTMLBuilderArea from './HTMLBuilderArea.vue';
  import HTMLBuilderComponents from './HTMLBuilderComponents.vue';
  import HTMLBuilderTree from './HTMLBuilderTree.vue';
  import HTMLBuilderConfig from './HTMLBuilderConfig.vue';
  import { ref } from 'vue';
  import type { IHTMLBuilderElement } from './types';

  import './styles.css';

  const components = ref<IHTMLBuilderElement[]>([]);

  defineExpose({
    components,
  });
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
    <HTMLBuilderConfig class="html-builder-config" />
  </div>
</template>
