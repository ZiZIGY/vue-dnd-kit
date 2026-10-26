<script setup lang="ts">
  import { useClipboard } from '@vueuse/core';
  import type { ExampleFile } from '#examples';

  /**
   * The sources of a live example: its files as tabs, copy and StackBlitz, then the code.
   * `fill` stretches it to its box (the code scrolls) instead of capping it at `maxHeight`.
   */
  const props = withDefaults(
    defineProps<{ files: ExampleFile[]; name: string; title?: string; maxHeight?: string; focus?: string; fill?: boolean }>(),
    { title: undefined, maxHeight: '30rem', focus: undefined },
  );

  const { t } = useI18n();
  // The entry (index.vue) unless another file is the point.
  const active = ref(Math.max(0, props.files.findIndex((item) => item.name === props.focus)));
  const file = computed(() => props.files[active.value]);
  const { copy, copied } = useClipboard({ copiedDuring: 1600 });

  // The file shown first may sit past the edge of the tab bar: scroll it into view.
  const tablist = useTemplateRef<HTMLElement>('tablist');
  onMounted(() => {
    const tab = tablist.value?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (tablist.value && tab) tablist.value.scrollLeft = tab.offsetLeft + (tab.offsetWidth - tablist.value.clientWidth) / 2;
  });

  const ICONS: Record<string, string> = {
    vue: 'i-vscode-icons-file-type-vue',
    ts: 'i-vscode-icons-file-type-typescript-official',
    css: 'i-vscode-icons-file-type-css',
    json: 'i-vscode-icons-file-type-json',
  };
  const iconOf = (item: ExampleFile) => ICONS[item.lang] ?? 'i-vscode-icons-default-file';

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
      <div
        ref="tablist"
        role="tablist"
        :aria-label="t('example.code')"
        class="relative flex min-w-0 overflow-x-auto [scrollbar-width:none]"
      >
        <button
          v-for="(item, index) in files"
          :key="item.name"
          role="tab"
          type="button"
          :aria-selected="index === active"
          class="relative flex h-11 shrink-0 cursor-pointer items-center gap-2 border-e border-default px-4 font-mono text-[12px] transition-colors"
          :class="index === active ? 'bg-default text-highlighted' : 'text-dimmed hover:text-highlighted'"
          @click="active = index"
        >
          <UIcon
            :name="iconOf(item)"
            class="size-4 shrink-0"
            :class="index === active ? '' : 'opacity-60 grayscale'"
          />
          {{ item.name }}
          <span
            v-if="index === active"
            aria-hidden="true"
            class="absolute inset-x-0 top-0 h-0.5 bg-(--ui-primary)"
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
