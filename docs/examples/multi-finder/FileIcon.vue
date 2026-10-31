<script setup lang="ts">
// A 40×48 document with a colored label for its kind.
defineProps<{ kind: 'pdf' | 'png' | 'txt' | 'zip' | 'fig' | 'mp4' }>();
const COLORS = { pdf: '#ef4444', png: '#a855f7', txt: '#64748b', zip: '#f59e0b', fig: '#ec4899', mp4: '#3b82f6' };
</script>

<template>
  <svg class="file-icon" viewBox="0 0 40 48" aria-hidden="true">
    <path class="sheet" d="M6 2h20l10 10v32a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
    <path class="fold" d="M26 2v8a2 2 0 0 0 2 2h8" />
    <rect x="1" y="27" width="28" height="12" rx="3" :fill="COLORS[kind]" />
    <text x="15" y="36.2" text-anchor="middle">{{ kind.toUpperCase() }}</text>
  </svg>
</template>

<style scoped>
.file-icon {
  width: 40px;
  height: 48px;
  overflow: visible;
}

.sheet {
  fill: Canvas;
  stroke: color-mix(in srgb, currentColor 30%, transparent);
  stroke-width: 1.5;
}

.fold {
  fill: none;
  stroke: color-mix(in srgb, currentColor 30%, transparent);
  stroke-width: 1.5;
}

text {
  fill: #fff;
  font: 700 7.5px/1 system-ui, sans-serif;
}
</style>
