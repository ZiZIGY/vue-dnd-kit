<script setup lang="ts">
  import { useEventListener, useScrollLock } from '@vueuse/core';
  import type { Component } from 'vue';

  /**
   * Where a live demo plays: a bar on top (LIVE, a hint, the pointer's coordinates, expand,
   * reset), then dotted paper with the demo in the middle, framed by viewfinder corners.
   * `bleed`: the demo takes the whole paper (a selection box drawn anywhere on it).
   */
  defineProps<{ demo: Component | null; minHeight?: string; hint?: string; bleed?: boolean }>();
  const { t } = useI18n();
  const runs = ref(0);

  // Expanded, the stage covers the viewport above the site, and the demo gets all the room.
  // Not the Fullscreen API: it shows only the element made fullscreen, and the overlay of a
  // drag renders in `body`, outside it. The stage moves to `body` (a disabled Teleport keeps
  // the demo mounted as it is), so no transform of the page around it becomes its frame.
  const expanded = ref(false);
  const stage = useTemplateRef<HTMLElement>('stage');
  const toggle = useTemplateRef<{ $el: HTMLElement }>('toggle');
  /** The stage's height on the page, held by a placeholder while it is expanded. */
  const held = ref(0);
  const scrollLock = useScrollLock(import.meta.client ? document.body : null);
  // Moving to `body` and back takes the stage out of the document for a moment, which resets
  // the scroll of everything in it, without a scroll event: a scrolled list keeps its place,
  // and a virtual one renders the rows of where it is.
  const keepScroll = () => {
    const scrolled = [...(stage.value?.querySelectorAll<HTMLElement>('*') ?? [])]
      .filter((element) => element.scrollTop || element.scrollLeft)
      .map((element) => [element, element.scrollLeft, element.scrollTop] as const);
    return () => scrolled.forEach(([element, left, top]) => element.scrollTo(left, top));
  };
  const setExpanded = (value: boolean) => {
    if (value) held.value = stage.value?.offsetHeight ?? 0;
    const restore = keepScroll();
    expanded.value = value;
    // After the render that moves the stage.
    nextTick(restore);
  };
  watch(expanded, (now) => {
    scrollLock.value = now;
    // Back on the page, the focus returns to the button that expanded it.
    if (!now) nextTick(() => toggle.value?.$el.focus());
  });
  // Escape collapses it, unless it cancels a drag or a rubber band first (the page is marked
  // while one runs) or something in the demo used it.
  useEventListener('keydown', (event: KeyboardEvent) => {
    if (!expanded.value || event.key !== 'Escape' || event.defaultPrevented) return;
    if (document.documentElement.hasAttribute('data-dnd-dragging')) return;
    setExpanded(false);
  });
  onBeforeUnmount(() => (scrollLock.value = false));

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

  // The viewfinder's corners close in on the paper when it comes into view.
  const CORNERS = [
    { class: 'top-3 left-3 border-t border-s', from: { x: -14, y: -14 } },
    { class: 'top-3 right-3 border-t border-e', from: { x: 14, y: -14 } },
    { class: 'bottom-3 left-3 border-b border-s', from: { x: -14, y: 14 } },
    { class: 'bottom-3 right-3 border-b border-e', from: { x: 14, y: 14 } },
  ];
</script>

<template>
  <!-- Its place on the page, kept while it is expanded: the page doesn't scroll away. -->
  <div
    v-if="expanded"
    aria-hidden="true"
    :style="{ height: `${held}px` }"
  />
  <Teleport
    to="body"
    :disabled="!expanded"
  >
    <div
      ref="stage"
      class="stage flex flex-col"
      :class="expanded ? 'stage-expanded fixed inset-0 z-[60] bg-default' : ''"
      :style="expanded ? undefined : { minHeight: minHeight ?? '20rem' }"
      :role="expanded ? 'dialog' : undefined"
      :aria-modal="expanded || undefined"
      :aria-label="expanded ? (hint ?? t('example.preview')) : undefined"
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
        <UTooltip :text="t(expanded ? 'example.collapse' : 'example.expand')">
          <UButton
            ref="toggle"
            color="neutral"
            variant="ghost"
            size="sm"
            square
            :icon="expanded ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'"
            :aria-label="t(expanded ? 'example.collapse' : 'example.expand')"
            :aria-pressed="expanded"
            class="max-md:ms-auto"
            @click="setExpanded(!expanded)"
          />
        </UTooltip>
        <UTooltip :text="t('example.reset')">
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            square
            icon="i-lucide-rotate-ccw"
            :aria-label="t('example.reset')"
            @click="runs++"
          />
        </UTooltip>
      </div>

      <div
        ref="paper"
        class="relative flex flex-1 justify-center"
        :class="[bleed ? '' : 'px-5 py-14 sm:px-12', expanded ? 'min-h-0 items-stretch overflow-auto' : 'items-center']"
      >
        <div
          aria-hidden="true"
          class="dot-paper fade-radial pointer-events-none absolute inset-0 opacity-70"
        />
        <Motion
          v-for="corner in CORNERS"
          :key="corner.class"
          as="span"
          aria-hidden="true"
          class="pointer-events-none absolute size-3 border-(--ui-text-dimmed)"
          :class="corner.class"
          :initial="{ opacity: 0, ...corner.from }"
          :while-in-view="{ opacity: 1, x: 0, y: 0 }"
          :in-view-options="{ once: true }"
          :transition="{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }"
        />
        <!-- Expanded, the demo's box takes the paper's height: a demo that fills it grows
             (`flex: 1` or `height: 100%` on its root), a smaller one stays in the middle. -->
        <div
          class="w-full"
          :class="[bleed ? 'absolute inset-0' : 'relative', expanded && !bleed ? 'flex h-full flex-col justify-center' : '']"
        >
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
  </Teleport>
</template>

<style>
  /* Expanded, the stage covers the page from <body>, above the site's header (z-index 60).
     What Nuxt UI portals into <body> while it is (menus, tooltips, dialogs) goes above it:
     their wrappers come with `z-index: auto`. A drag's overlay and its ghosts keep their own,
     far higher one. */
  body:has(> .stage-expanded) > :not(#__nuxt, #teleports, .stage-expanded, [data-dnd-overlay], [data-dnd-ghost]),
  body:has(> .stage-expanded) #teleports > * {
    z-index: 70 !important;
  }
</style>
