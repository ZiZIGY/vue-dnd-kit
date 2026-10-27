<script setup lang="ts">
  /** Vue's inner chevron lifted out of its place: the mark of Vue DnD Kit. */
  withDefaults(defineProps<{ wordmark?: boolean }>(), { wordmark: true });
  const src = `${useRuntimeConfig().app.baseURL}logo.png`;
</script>

<template>
  <span class="inline-flex items-center gap-2 text-highlighted">
    <!-- The white chevron needs an edge on a light page; on a dark one it has its own. -->
    <img
      :src="src"
      alt=""
      width="28"
      height="28"
      class="size-7 shrink-0 object-contain drop-shadow-[0_1px_1.5px_rgb(0_0_0/0.35)] dark:drop-shadow-none"
    />
    <span
      v-if="wordmark"
      class="text-[17px] font-bold tracking-[-0.04em] whitespace-nowrap"
      ><span class="font-semibold text-muted">vue-</span>dnd-kit</span
    >
  </span>
</template>
