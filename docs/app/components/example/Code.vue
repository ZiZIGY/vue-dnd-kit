<script setup lang="ts">
  import { useClipboard } from '@vueuse/core';
  import type { ExampleFile } from '#examples';

  /**
   * The sources of a live example: its files as tabs (drag them into another order), copy
   * and StackBlitz, then the code. `fill` stretches it to its box (the code scrolls)
   * instead of capping it at `maxHeight`.
   */
  const props = withDefaults(
    defineProps<{ files: ExampleFile[]; name: string; title?: string; maxHeight?: string; focus?: string; fill?: boolean }>(),
    { title: undefined, maxHeight: '30rem', focus: undefined },
  );

  const { t } = useI18n();
  const tabs = ref([...props.files]);
  // The entry (index.vue) unless another file is the point.
  const active = ref(props.files.find((item) => item.name === props.focus)?.name ?? props.files[0]?.name ?? '');
  const file = computed(() => props.files.find((item) => item.name === active.value));
  const { copy, copied } = useClipboard({ copiedDuring: 1600 });

  const openStackBlitz = async () => {
    const { openStackBlitz: open } = await import('~/utils/stackblitz');
    await open(props.name, props.title ?? props.name, props.files);
  };
</script>

<template>
  <div
    class="flex flex-col bg-(--code-bg)"
    :class="fill ? 'h-full' : ''"
  >
    <div class="flex shrink-0 items-stretch border-b border-default">
      <ExampleTabs
        v-model:files="tabs"
        v-model:active="active"
      />
      <div class="ms-auto flex shrink-0 items-center gap-0.5 border-s border-default px-1.5">
        <UTooltip :text="copied ? t('example.copied') : t('example.copy')">
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            square
            :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
            :aria-label="t('example.copy')"
            @click="file && copy(file.code)"
          />
        </UTooltip>
        <UTooltip :text="t('example.stackblitz')">
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            square
            icon="i-simple-icons-stackblitz"
            :aria-label="t('example.stackblitz')"
            @click="openStackBlitz"
          />
        </UTooltip>
      </div>
    </div>
    <div
      v-if="file"
      role="tabpanel"
      tabindex="0"
      class="overflow-auto px-5 py-4 font-mono text-[13px]/6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ui-primary) [&_pre]:bg-transparent! [&_pre]:outline-none"
      :class="fill ? 'min-h-0 flex-1' : ''"
      :style="fill ? undefined : { maxHeight }"
      v-html="file.html"
    />
  </div>
</template>
