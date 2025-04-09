<script setup lang="ts">
  import { computed } from 'vue';
  import { useDnDStore } from '../composables/useDnDStore';
  import DefaultOverlay from './DefaultOverlay.vue';

  const { activeContainer } = useDnDStore();

  const overlay = computed(
    () => activeContainer.component.value ?? DefaultOverlay
  );
</script>

<template>
  <component :is="overlay" />
</template>
