<script setup lang="ts">
  /** The lost page, drawn as a sheet of paper: its address, lines of text, a picture, a stamp. `lit`: over a place that takes it. */
  defineProps<{ path: string; lit?: boolean }>();
  const { t } = useI18n();
</script>

<template>
  <div class="relative size-full">
    <div
      class="sheet flex size-full flex-col bg-default p-5 ring-1 ring-inset transition-colors duration-200"
      :class="lit ? 'ring-(--ui-primary)' : 'ring-(--ui-border-accented)'"
    >
      <span class="label text-[10px] text-dimmed">404</span>
      <p class="mt-3 font-mono text-[13px] leading-snug font-medium break-all text-highlighted">{{ path }}</p>
      <span class="mt-5 flex flex-col gap-2">
        <span class="h-1.5 w-full bg-(--ui-bg-accented)" />
        <span class="h-1.5 w-5/6 bg-(--ui-bg-accented)" />
        <span class="h-1.5 w-2/3 bg-(--ui-bg-accented)" />
      </span>
      <span class="hatch-paper mt-5 h-16 shrink-0 text-(--ui-border-accented) ring-1 ring-(--ui-border) ring-inset" />
      <span class="mt-5 flex flex-col gap-2">
        <span class="h-1.5 w-4/5 bg-(--ui-bg-accented)" />
        <span class="h-1.5 w-1/2 bg-(--ui-bg-accented)" />
      </span>
    </div>
    <!-- The corner folded over. -->
    <span
      aria-hidden="true"
      class="fold absolute top-0 right-0 size-7 bg-(--ui-bg-accented)"
    />
    <span class="label absolute right-4 bottom-8 max-w-[85%] -rotate-12 border-2 border-rose-500 px-2 py-1 text-center text-[10px] leading-tight text-rose-500 opacity-90 dark:border-rose-400 dark:text-rose-400">
      {{ t('notFound.title') }}
    </span>
  </div>
</template>

<style scoped>
  .sheet {
    clip-path: polygon(0 0, calc(100% - 1.75rem) 0, 100% 1.75rem, 100% 100%, 0 100%);
  }

  .fold {
    clip-path: polygon(0 0, 100% 100%, 0 100%);
  }
</style>
