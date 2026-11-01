<script setup lang="ts">
import { PRIORITIES, type Priority } from './store';

// Bars that fill with the priority; urgent is a square of its own.
defineProps<{ level: Priority }>();
</script>

<template>
  <svg class="priority" viewBox="0 0 14 14" role="img" :aria-label="PRIORITIES[level]">
    <title>{{ PRIORITIES[level] }}</title>
    <template v-if="level === 4">
      <rect x="1" y="1" width="12" height="12" rx="3" class="urgent" />
      <path d="M7 4v3.6M7 9.8v.2" class="mark" />
    </template>
    <template v-else-if="level === 0">
      <path d="M2 7h1.6M6.2 7h1.6M10.4 7H12" class="none" />
    </template>
    <template v-else>
      <rect v-for="bar in 3" :key="bar" :x="bar * 4 - 2.5" :y="12 - bar * 3" width="2.6" :height="bar * 3" rx="0.8" :class="{ off: bar > level }" />
    </template>
  </svg>
</template>

<style scoped>
.priority {
  flex: none;
  width: 14px;
  height: 14px;
  fill: currentColor;
}

.off {
  opacity: 0.25;
}

.none {
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  opacity: 0.5;
}

.urgent {
  fill: #f76808;
}

.mark {
  stroke: #fff;
  stroke-width: 1.7;
  stroke-linecap: round;
}
</style>
