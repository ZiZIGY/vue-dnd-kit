<script setup lang="ts">
  import { useClipboard } from '@vueuse/core';

  /** A terminal-like line that copies its text: install commands, `npx skills add …`. */
  const props = defineProps<{ command: string; label?: string }>();
  const { t } = useI18n();
  const { copy, copied } = useClipboard({ copiedDuring: 1600 });
</script>

<template>
  <button
    type="button"
    :aria-label="copied ? t('copy.copied') : (props.label ?? t('copy.command'))"
    class="group inline-flex h-12 max-w-full cursor-pointer items-center gap-3 px-4 font-mono text-sm text-muted ring-1 ring-inset ring-default transition-colors duration-200 hover:bg-muted hover:text-highlighted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    @click="copy(command)"
  >
    <span
      aria-hidden="true"
      class="shrink-0 whitespace-nowrap text-dimmed"
      >■ ~</span
    >
    <span class="truncate">{{ command }}</span>
    <span class="relative size-4 shrink-0">
      <UIcon
        name="i-lucide-copy"
        class="absolute inset-0 size-4 transition-opacity duration-200"
        :class="copied ? 'opacity-0' : 'opacity-100'"
      />
      <UIcon
        name="i-lucide-check"
        class="absolute inset-0 size-4 text-highlighted transition-opacity duration-200"
        :class="copied ? 'opacity-100' : 'opacity-0'"
      />
    </span>
  </button>
</template>
