<script setup lang="ts">
  import { useLocalStorage } from '@vueuse/core';
  import UButton from '@nuxt/ui/components/Button.vue';
  import UTooltip from '@nuxt/ui/components/Tooltip.vue';
  import { TAB_ROUTE } from '../../../packages/devtools/src/protocol';
  import { devtoolsOpen } from './state';

  /** The dock's height while dragged: the frames above and in it must not take the pointer. */
  const resizing = defineModel<boolean>('resizing', { default: false });

  const MIN = 160;
  const height = useLocalStorage('vue-dnd-kit:lab:devtools-height', 380);

  // The handle on the dock's top edge: up makes it taller, never past most of the column.
  const resize = (event: PointerEvent) => {
    const handle = event.currentTarget as HTMLElement;
    const column = handle.parentElement!.parentElement!;
    const start = { y: event.clientY, height: height.value };
    handle.setPointerCapture(event.pointerId);
    resizing.value = true;
    const move = (next: PointerEvent) => {
      const max = column.clientHeight - 120;
      height.value = Math.round(Math.min(max, Math.max(MIN, start.height + start.y - next.clientY)));
    };
    const end = () => {
      resizing.value = false;
      handle.removeEventListener('pointermove', move);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('lostpointercapture', end, { once: true });
  };
</script>

<template>
  <section
    class="relative flex shrink-0 flex-col border-t border-default bg-default"
    :style="{ height: `${height}px` }"
    aria-label="DevTools"
  >
    <div
      class="absolute inset-x-0 -top-1 z-10 h-2 cursor-row-resize"
      role="separator"
      aria-orientation="horizontal"
      aria-label="Resize the DevTools"
      @pointerdown.prevent="resize"
    />
    <div class="flex h-9 shrink-0 items-center gap-2 border-b border-default ps-4 pe-1.5">
      <span class="label text-[10px] text-dimmed">DevTools</span>
      <span class="hidden text-xs text-dimmed sm:inline">· the demo above, live</span>
      <UTooltip text="Open in a window">
        <UButton
          class="ms-auto"
          :href="TAB_ROUTE"
          target="_blank"
          icon="i-lucide-external-link"
          size="sm"
          color="neutral"
          variant="ghost"
          square
          aria-label="Open in a window"
        />
      </UTooltip>
      <UButton
        icon="i-lucide-x"
        size="sm"
        color="neutral"
        variant="ghost"
        square
        aria-label="Close the DevTools"
        @click="devtoolsOpen = false"
      />
    </div>
    <iframe
      :src="TAB_ROUTE"
      title="Vue DnD Kit DevTools"
      class="min-h-0 flex-1"
      :class="{ 'pointer-events-none': resizing }"
    />
  </section>
</template>
