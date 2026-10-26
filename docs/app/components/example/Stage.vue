<script setup lang="ts">
  import { useEventListener } from '@vueuse/core';
  import type { Component } from 'vue';

  /**
   * Where a live demo plays: a bar on top (LIVE, a hint, the pointer's coordinates, reset),
   * then dotted paper with the demo in the middle, framed by viewfinder corners.
   */
  defineProps<{ demo: Component | null; minHeight?: string; hint?: string }>();
  const { t } = useI18n();
  const runs = ref(0);

  // The pointer over the paper, in px from its top-left corner. Read on the window: a drag
  // captures the pointer, and the overlay it moves sits outside the paper.
  const paper = useTemplateRef<HTMLElement>('paper');
  const pointer = ref<{ x: number; y: number } | null>(null);
  useEventListener(
    'pointermove',
    (event: PointerEvent) => {
      const rect = paper.value?.getBoundingClientRect();
      if (!rect) return;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      pointer.value = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height ? { x: Math.round(x), y: Math.round(y) } : null;
    },
    { passive: true },
  );
  const coordinate = (value: number | undefined) => (value === undefined ? '----' : String(Math.max(0, value)).padStart(4, '0'));
  useDemoWords(paper);

  const CORNERS = [
    'top-3 left-3 border-t border-s',
    'top-3 right-3 border-t border-e',
    'bottom-3 left-3 border-b border-s',
    'bottom-3 right-3 border-b border-e',
  ];
</script>

<template>
  <div
    class="stage flex flex-col"
    :style="{ minHeight: minHeight ?? '20rem' }"
  >
    <div class="flex h-11 shrink-0 items-center gap-4 border-b border-default ps-4 pe-1.5">
      <span class="label inline-flex items-center gap-2 text-[10px] text-(--ui-primary)">
        <span class="size-1.5 animate-blink bg-(--ui-primary)" />
        Live
      </span>
      <span
        v-if="hint"
        class="label hidden truncate text-[10px] text-dimmed sm:block"
        >{{ hint }}</span
      >
      <span
        aria-hidden="true"
        class="ms-auto hidden font-mono text-[10px] tracking-[0.08em] text-dimmed tabular-nums md:block"
      >
        X {{ coordinate(pointer?.x) }} <span class="text-(--ui-text-dimmed)/50">·</span> Y {{ coordinate(pointer?.y) }}
      </span>
      <UTooltip :text="t('example.reset')">
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          square
          icon="i-lucide-rotate-ccw"
          :aria-label="t('example.reset')"
          class="max-md:ms-auto"
          @click="runs++"
        />
      </UTooltip>
    </div>

    <div
      ref="paper"
      class="relative flex flex-1 items-center justify-center px-5 py-14 sm:px-12"
    >
      <div
        aria-hidden="true"
        class="dot-paper fade-radial pointer-events-none absolute inset-0 opacity-70"
      />
      <span
        v-for="corner in CORNERS"
        :key="corner"
        aria-hidden="true"
        class="pointer-events-none absolute size-3 border-(--ui-text-dimmed)"
        :class="corner"
      />
      <div class="relative w-full">
        <ClientOnly>
          <component
            :is="demo"
            v-if="demo"
            :key="runs"
          />
          <template #fallback>
            <p class="label text-center text-[10px] text-dimmed">{{ t('example.loading') }}</p>
          </template>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
