<script setup lang="ts">
  import { computed } from 'vue';
  import { useDnDProvider } from '../provider/context';
  import DefaultOverlay from './DefaultOverlay.vue';

  const provider = useDnDProvider();

  const overlay = computed(() => provider.overlay.component ?? DefaultOverlay);
</script>

<template>
  <Transition
    v-if="provider.overlay.options && provider.isDragging.value"
    v-bind="provider.overlay.options"
    appear
  >
    <component :is="overlay" />
  </Transition>

  <component
    v-else-if="provider.isDragging.value"
    :is="overlay"
  />
</template>
