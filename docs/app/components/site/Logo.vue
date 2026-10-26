<script setup lang="ts">
  /** Two squares, one dragged off the other's grid line: the mark of Vue DnD Kit. */
  withDefaults(defineProps<{ wordmark?: boolean }>(), { wordmark: true });
</script>

<template>
  <span class="inline-flex items-center gap-2.5 text-highlighted">
    <svg
      aria-hidden="true"
      class="size-5 shrink-0"
      viewBox="0 0 20 20"
      fill="none"
    >
      <rect
        x="0.5"
        y="0.5"
        width="13"
        height="13"
        stroke="currentColor"
        stroke-dasharray="2 2"
      />
      <rect
        x="7"
        y="7"
        width="13"
        height="13"
        fill="currentColor"
      />
    </svg>
    <span
      v-if="wordmark"
      class="font-mono text-[13px] font-medium uppercase tracking-[0.2em] whitespace-nowrap"
      >DnD Kit</span
    >
  </span>
</template>
