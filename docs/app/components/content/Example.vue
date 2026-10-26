<script setup lang="ts">
  import { useClipboard } from '@vueuse/core';
  import { examples, type ExampleFile } from '#examples';

  /**
   * A live example (`examples/<name>/`): the demo running, and below it the very files
   * that run it, highlighted, to copy or to open in StackBlitz.
   */
  const props = withDefaults(defineProps<{ name: string; height?: string; title?: string }>(), {
    height: 'auto',
    title: undefined,
  });

  const { t } = useI18n();
  const entry = examples[props.name];
  if (!entry && import.meta.dev) console.warn(`[docs] No example named "${props.name}" in examples/.`);

  const Demo = entry ? defineAsyncComponent(entry.component) : null;
  const { data: files } = await useAsyncData(`example-${props.name}`, () => entry?.files() ?? Promise.resolve([]));

  const active = ref(0);
  const file = computed<ExampleFile | undefined>(() => files.value?.[active.value]);
  const runs = ref(0);

  const { copy, copied } = useClipboard({ copiedDuring: 1600 });

  const openStackBlitz = async () => {
    if (!files.value) return;
    const { openStackBlitz: open } = await import('~/utils/stackblitz');
    await open(props.name, props.title ?? props.name, files.value);
  };
</script>

<template>
  <!-- A border, not an inset ring: the bars' backgrounds would paint over a ring. -->
  <div class="not-prose relative my-8 border border-default">
    <!-- Preview -->
    <div class="flex items-center justify-between gap-4 bg-default px-4 py-2 divider-dashed-b">
      <span class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-dimmed">
        <span
          aria-hidden="true"
          class="size-1.5 animate-blink bg-primary"
        />
        {{ t('example.preview') }}
      </span>
      <div class="flex items-center gap-1">
        <UTooltip :text="t('example.reset')">
          <UButton
            color="neutral"
            variant="ghost"
            size="xs"
            square
            icon="i-lucide-rotate-ccw"
            :aria-label="t('example.reset')"
            @click="runs++"
          />
        </UTooltip>
        <UTooltip :text="t('example.stackblitz')">
          <UButton
            color="neutral"
            variant="ghost"
            size="xs"
            square
            icon="i-simple-icons-stackblitz"
            :aria-label="t('example.stackblitz')"
            @click="openStackBlitz"
          />
        </UTooltip>
      </div>
    </div>
    <div
      class="relative flex items-center justify-center overflow-hidden bg-default px-6 py-10 lg:px-10"
      :style="{ minHeight: height }"
    >
      <DecorPattern
        variant="dots"
        fade="radial"
        class="opacity-60"
      />
      <div class="relative w-full">
        <ClientOnly>
          <component
            :is="Demo"
            v-if="Demo"
            :key="runs"
          />
          <template #fallback>
            <p class="text-center font-mono text-xs uppercase tracking-[0.18em] text-dimmed">{{ t('example.loading') }}</p>
          </template>
        </ClientOnly>
      </div>
    </div>

    <!-- Code -->
    <div
      v-if="files?.length"
      class="border-t border-default bg-muted"
    >
      <div class="flex items-stretch justify-between divider-dashed-b">
        <div
          role="tablist"
          :aria-label="t('example.code')"
          class="flex overflow-x-auto"
        >
          <button
            v-for="(item, index) in files"
            :key="item.name"
            role="tab"
            type="button"
            :aria-selected="index === active"
            class="relative shrink-0 cursor-pointer px-4 py-2.5 font-mono text-[11px] tracking-[0.06em] transition-colors"
            :class="index === active ? 'text-highlighted' : 'text-muted hover:text-highlighted'"
            @click="active = index"
          >
            {{ item.name }}
            <span
              v-if="index === active"
              aria-hidden="true"
              class="absolute inset-x-0 bottom-0 z-10 h-px bg-primary"
            />
          </button>
        </div>
        <UButton
          color="neutral"
          variant="ghost"
          size="xs"
          class="m-1 shrink-0 font-mono text-[11px]"
          :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
          :label="copied ? t('example.copied') : t('example.copy')"
          @click="file && copy(file.code)"
        />
      </div>
      <div
        v-if="file"
        role="tabpanel"
        class="max-h-[32rem] overflow-auto px-5 py-4 font-mono text-[13px]/6 [&_pre]:bg-transparent! [&_pre]:outline-none"
        tabindex="0"
        v-html="file.html"
      />
    </div>
  </div>
</template>
