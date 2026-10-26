<script setup lang="ts">
import { computed } from 'vue';

/** A 16×16 icon for a file (by its extension) or a folder (open or closed). */
const props = defineProps<{ name: string; folder?: boolean; open?: boolean }>();
const extension = computed(() => props.name.split('.').pop());
</script>

<template>
  <svg class="icon" viewBox="0 0 16 16" aria-hidden="true">
    <template v-if="folder && open">
      <path fill="#c9973a" d="M1.5 4A1.5 1.5 0 0 1 3 2.5h3.3l1.5 1.5H13A1.5 1.5 0 0 1 14.5 5.5V7H4.4a1.5 1.5 0 0 0-1.4 1L1.5 12.5z" />
      <path fill="#f0c15a" d="M3.6 7.9A1.5 1.5 0 0 1 5 7h9.4a.8.8 0 0 1 .75 1.06l-1.6 4.45a1.5 1.5 0 0 1-1.4 1H2.1a.6.6 0 0 1-.56-.81z" />
    </template>
    <path
      v-else-if="folder"
      fill="#e2ad48"
      d="M1.5 4A1.5 1.5 0 0 1 3 2.5h3.3l1.5 1.5H13A1.5 1.5 0 0 1 14.5 5.5V12A1.5 1.5 0 0 1 13 13.5H3A1.5 1.5 0 0 1 1.5 12z"
    />
    <template v-else-if="extension === 'vue'">
      <path fill="#42b883" d="M1 2.5h3.2L8 9l3.8-6.5H15L8 14.5z" />
      <path fill="#35495e" d="M4.2 2.5h2.3L8 5.1l1.5-2.6h2.3L8 9z" />
    </template>
    <template v-else-if="extension === 'ts'">
      <rect x="1.5" y="1.5" width="13" height="13" rx="2" fill="#3178c6" />
      <text x="8.6" y="11.6" fill="#fff" font-size="6.5" font-weight="700" text-anchor="middle">TS</text>
    </template>
    <text v-else-if="extension === 'json'" x="8" y="12" fill="#e8b931" font-size="10" font-weight="700" text-anchor="middle">{}</text>
    <template v-else-if="extension === 'md'">
      <rect x="1" y="3.5" width="14" height="9" rx="1.5" fill="none" stroke="#519aba" stroke-width="1.2" />
      <path fill="none" stroke="#519aba" stroke-width="1.2" d="M3.5 10.5v-4l1.75 2 1.75-2v4M11 6.5v4m-1.5-1.5 1.5 1.5 1.5-1.5" />
    </template>
    <template v-else-if="extension === 'svg'">
      <path fill="none" stroke="#f59e0b" stroke-width="1.3" d="M8 1.8 14 5.3v5.4L8 14.2 2 10.7V5.3z" />
      <circle cx="8" cy="8" r="2" fill="#f59e0b" />
    </template>
    <path v-else fill="none" stroke="currentColor" stroke-opacity="0.6" d="M4 1.5h5l3.5 3.5v9.5h-8.5zM9 1.5V5h3.5" />
  </svg>
</template>

<style scoped>
.icon {
  flex: none;
  width: 16px;
  height: 16px;
  font-family: system-ui, sans-serif;
}
</style>
