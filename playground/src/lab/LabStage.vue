<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue';
  import UButton from '@nuxt/ui/components/Button.vue';
  import UTooltip from '@nuxt/ui/components/Tooltip.vue';
  import { SECTIONS, frameUrl } from '../catalog';
  // The key the devtools tab reads on the page around it (`window.top`) to know which page to watch.
  import { PAGE_KEY } from '../../../packages/devtools/src/protocol';
  import { demo, devtoolsOpen, panelOpen, view, type View } from './state';

  defineProps<{ resizing?: boolean }>();

  const VIEWS: Array<{ value: View; label: string; icon: string }> = [
    { value: 'desktop', label: 'Desktop', icon: 'i-lucide-monitor' },
    { value: 'tablet', label: 'Tablet (820px)', icon: 'i-lucide-tablet' },
    { value: 'phone', label: 'Phone (390px)', icon: 'i-lucide-smartphone' },
  ];

  const section = computed(() => SECTIONS.find((entry) => entry.id === demo.value.section)?.title);
  const url = computed(() => frameUrl(demo.value));

  // The first address is the frame's `src`; the next ones replace it in place: a demo of the
  // same page only changes its hash (no reload), and the Lab's history keeps one entry per demo.
  const frame = useTemplateRef<HTMLIFrameElement>('frame');
  const initial = url.value;
  watch(url, (next) => frame.value?.contentWindow?.location.replace(next));
  const reload = () => frame.value?.contentWindow?.location.reload();

  // The devtools tab in the dock watches the page `window.top[PAGE_KEY]` names: the frame's,
  // whichever page it shows now. This page reports to the tab too, under its own id.
  onMounted(() =>
    Object.defineProperty(window, PAGE_KEY, {
      configurable: true,
      get: () => (frame.value?.contentWindow as unknown as Record<string, unknown> | null)?.[PAGE_KEY],
    }),
  );
  onBeforeUnmount(() => delete (window as unknown as Record<string, unknown>)[PAGE_KEY]);
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="flex h-11 shrink-0 items-center gap-3 border-b border-default bg-default ps-4 pe-1.5">
      <span class="label inline-flex items-center gap-2 text-[10px] text-(--ui-primary)">
        <span class="size-1.5 animate-blink bg-(--ui-primary)" />
        Live
      </span>
      <h1 class="truncate text-sm font-semibold text-highlighted">{{ demo.title }}</h1>
      <span class="label hidden truncate text-[10px] text-dimmed lg:inline">{{ section }}</span>

      <div
        class="ms-auto flex items-center rounded-(--ui-radius) bg-elevated/60 p-0.5 ring-1 ring-default ring-inset"
        role="group"
        aria-label="Width"
      >
        <UTooltip
          v-for="option in VIEWS"
          :key="option.value"
          :text="option.label"
        >
          <UButton
            :icon="option.icon"
            size="sm"
            square
            color="neutral"
            :variant="view === option.value ? 'solid' : 'ghost'"
            :aria-label="option.label"
            :aria-pressed="view === option.value"
            @click="view = option.value"
          />
        </UTooltip>
      </div>

      <div class="flex items-center">
        <UTooltip text="Reload the demo">
          <UButton
            icon="i-lucide-rotate-ccw"
            color="neutral"
            variant="ghost"
            square
            aria-label="Reload the demo"
            @click="reload"
          />
        </UTooltip>
        <UTooltip text="Open on its own">
          <UButton
            :href="url"
            target="_blank"
            icon="i-lucide-external-link"
            color="neutral"
            variant="ghost"
            square
            aria-label="Open on its own"
          />
        </UTooltip>
        <UTooltip text="DevTools">
          <UButton
            icon="i-lucide-bug"
            color="neutral"
            :variant="devtoolsOpen ? 'soft' : 'ghost'"
            square
            aria-label="DevTools"
            :aria-pressed="devtoolsOpen"
            @click="devtoolsOpen = !devtoolsOpen"
          />
        </UTooltip>
        <UTooltip :text="panelOpen ? 'Hide the panel' : 'Show the panel'">
          <UButton
            :icon="panelOpen ? 'i-lucide-panel-right-close' : 'i-lucide-panel-right-open'"
            color="neutral"
            variant="ghost"
            square
            :aria-label="panelOpen ? 'Hide the panel' : 'Show the panel'"
            @click="panelOpen = !panelOpen"
          />
        </UTooltip>
      </div>
    </div>

    <div
      class="stage relative flex min-h-0 flex-1 items-center justify-center overflow-hidden"
      :class="{ 'p-6': view !== 'desktop' }"
    >
      <div
        v-if="view !== 'desktop'"
        aria-hidden="true"
        class="dot-paper fade-radial pointer-events-none absolute inset-0 opacity-70"
      />
      <div
        class="relative flex h-full overflow-hidden bg-default"
        :class="{
          'w-full': view === 'desktop',
          'max-h-[1180px] w-[820px] max-w-full shadow-xl ring-1 ring-default': view === 'tablet',
          'max-h-[844px] w-[410px] rounded-[2.75rem] border-[10px] border-[#18181b] shadow-2xl ring-1 ring-(--ui-border-accented)':
            view === 'phone',
        }"
      >
        <iframe
          ref="frame"
          :src="initial"
          :title="`Demo: ${demo.title}`"
          class="size-full"
          :class="{ 'pointer-events-none': resizing, 'rounded-[2rem]': view === 'phone' }"
        />
      </div>
    </div>
  </div>
</template>
