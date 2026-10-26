<script setup lang="ts">
  import { useClipboard } from '@vueuse/core';
  import type { ExampleFile } from '#examples';

  /** The sources of a live example: the code on top, the files as tabs below, copy and StackBlitz. */
  const props = withDefaults(
    defineProps<{ files: ExampleFile[]; name: string; title?: string; maxHeight?: string; focus?: string }>(),
    { title: undefined, maxHeight: '30rem', focus: undefined },
  );

  const { t } = useI18n();
  // The entry (index.vue) unless another file is the point.
  const active = ref(Math.max(0, props.files.findIndex((item) => item.name === props.focus)));
  const file = computed(() => props.files[active.value]);
  const { copy, copied } = useClipboard({ copiedDuring: 1600 });

  const openStackBlitz = async () => {
    const { openStackBlitz: open } = await import('~/utils/stackblitz');
    await open(props.name, props.title ?? props.name, props.files);
  };
</script>

<template>
  <div class="bg-(--code-bg)">
    <div
      v-if="file"
      role="tabpanel"
      tabindex="0"
      class="overflow-auto px-5 py-4 font-mono text-[13px]/6 focus-visible:outline-2 focus-visible:outline-(--ui-primary) [&_pre]:bg-transparent! [&_pre]:outline-none"
      :style="{ maxHeight }"
      v-html="file.html"
    />
    <div class="flex items-stretch border-t border-default">
      <div
        role="tablist"
        :aria-label="t('example.code')"
        class="flex min-w-0 overflow-x-auto"
      >
        <button
          v-for="(item, index) in files"
          :key="item.name"
          role="tab"
          type="button"
          :aria-selected="index === active"
          class="relative shrink-0 cursor-pointer px-4 py-3 font-mono text-[12px] transition-colors"
          :class="index === active ? 'text-highlighted' : 'text-dimmed hover:text-highlighted'"
          @click="active = index"
        >
          {{ item.name }}
          <span
            v-if="index === active"
            aria-hidden="true"
            class="absolute inset-x-3 bottom-0 h-0.5 bg-(--ui-primary)"
          />
        </button>
      </div>
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
  </div>
</template>
