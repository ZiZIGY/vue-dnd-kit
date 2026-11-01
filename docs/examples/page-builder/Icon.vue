<script setup lang="ts">
import { ICONS, type IconName } from './icons';

defineProps<{ name: IconName }>();
</script>

<template>
  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
    <path v-for="(path, index) in ICONS[name]" :key="index" :d="path" />
  </svg>
</template>

<style scoped>
/* As big as the text around it, in its color. */
.icon {
  flex: none;
  width: 1em;
  height: 1em;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
