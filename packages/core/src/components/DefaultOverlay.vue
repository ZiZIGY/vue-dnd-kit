<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { setupOverlay } from '../composables/setupOverlay';

  const containerRef = useTemplateRef('containerRef');

  const { style, draggingElements } = setupOverlay(containerRef);
</script>

<template>
  <div
    ref="containerRef"
    :style="style"
  >
    <template
      v-for="[node, element] in draggingElements"
      :key="element.id"
    >
      <component
        v-if="element.view"
        :is="element.view"
      />
      <component
        v-else
        :is="node.tagName"
        v-html="element.node.innerHTML"
      />
    </template>
  </div>
</template>
