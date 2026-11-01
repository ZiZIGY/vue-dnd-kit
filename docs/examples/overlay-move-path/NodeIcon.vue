<script setup lang="ts">
/** A 16×16 icon: a section (a stack of pages) or a page. */
defineProps<{ section?: boolean }>();
</script>

<template>
  <svg class="icon" :class="{ section }" viewBox="0 0 16 16" aria-hidden="true">
    <template v-if="section">
      <rect x="2" y="3.5" width="12" height="3" rx="1" />
      <rect x="2" y="9.5" width="12" height="3" rx="1" />
    </template>
    <path v-else d="M4 1.5h5.5L12.5 4.5v10h-8.5zM9.5 1.5v3h3" />
  </svg>
</template>

<style scoped>
.icon {
  flex: none;
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.3;
  stroke-linejoin: round;
  opacity: 0.6;
}

.icon.section {
  fill: color-mix(in srgb, #42b883 30%, transparent);
  stroke: #42b883;
  opacity: 1;
}
</style>
