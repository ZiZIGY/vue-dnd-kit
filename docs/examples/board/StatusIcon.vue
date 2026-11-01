<script setup lang="ts">
// A column's status: a ring that fills as work moves right, a check once it is done.
const props = defineProps<{ color: string; progress: number }>();

// The pie is a circle's stroke as wide as its radius twice: dashed to the progress.
const PIE = 2 * Math.PI * 2;
const pie = () => `${props.progress * PIE} ${PIE}`;
</script>

<template>
  <svg class="status" viewBox="0 0 14 14" :style="{ color }" aria-hidden="true">
    <template v-if="progress < 1">
      <circle cx="7" cy="7" r="5.5" class="rim" :class="{ dashed: progress === 0 }" />
      <circle cx="7" cy="7" r="2" class="pie" :stroke-dasharray="pie()" />
    </template>
    <template v-else>
      <circle cx="7" cy="7" r="6.5" class="done" />
      <path d="M4.4 7.2l1.8 1.8 3.4-3.7" class="tick" />
    </template>
  </svg>
</template>

<style scoped>
.status {
  flex: none;
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
}

.rim {
  stroke-width: 1.5;
}

.rim.dashed {
  stroke-dasharray: 2.4 1.9;
}

.pie {
  stroke-width: 4;
  transform: rotate(-90deg);
  transform-origin: center;
}

.done {
  fill: currentColor;
  stroke: none;
}

.tick {
  stroke: #fff;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
