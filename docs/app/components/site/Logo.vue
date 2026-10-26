<script setup lang="ts">
  /** A square lifted out of its slot: the mark of Vue DnD Kit. */
  withDefaults(defineProps<{ wordmark?: boolean }>(), { wordmark: true });
</script>

<template>
  <span class="inline-flex items-center gap-2 text-highlighted">
    <svg
      aria-hidden="true"
      class="size-6 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect
        x="1.5"
        y="1.5"
        width="13"
        height="13"
        rx="1.5"
        stroke="currentColor"
        stroke-opacity="0.45"
        stroke-width="1.5"
        stroke-dasharray="2.5 2.5"
      />
      <rect
        x="8.5"
        y="8.5"
        width="14"
        height="14"
        rx="2"
        fill="#42b883"
      />
    </svg>
    <span
      v-if="wordmark"
      class="text-[17px] font-bold tracking-[-0.04em] whitespace-nowrap"
      >DnD Kit</span
    >
  </span>
</template>
