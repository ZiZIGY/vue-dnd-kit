<script setup lang="ts">
  import { useClipboard } from '@vueuse/core';

  /** A command in a mono box with a copy button: install commands, `npx skills add …`. */
  const props = defineProps<{ command: string; label?: string }>();
  const { t } = useI18n();
  const { copy, copied } = useClipboard({ copiedDuring: 1600 });
</script>

<template>
  <div class="inline-flex h-12 max-w-full items-center gap-3 ps-4 pe-1.5 font-mono text-[13px] text-highlighted ring-1 ring-inset ring-accented">
    <span class="truncate">{{ command }}</span>
    <UButton
      color="neutral"
      variant="ghost"
      size="sm"
      square
      :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
      :aria-label="copied ? t('copy.copied') : (props.label ?? t('copy.command'))"
      class="ms-auto shrink-0"
      @click="copy(command)"
    />
  </div>
</template>
