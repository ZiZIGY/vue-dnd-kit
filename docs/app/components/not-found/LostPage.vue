<script setup lang="ts">
  import { makeDraggable } from '@vue-dnd-kit/core';
  import SheetOverlay from './SheetOverlay.vue';

  /**
   * The lost page, to drag onto a place that exists. `sent`: it was dropped on one. Hidden
   * then, so the drop sends its overlay into the place; its box keeps its room on the desk.
   */
  const props = defineProps<{ path: string; sent: boolean }>();
  const { t } = useI18n();
  const el = useTemplateRef<HTMLElement>('el');
  const { isDragging } = makeDraggable(el, {
    id: 'lost-page',
    label: 'lost page',
    type: 'page',
    data: () => ({ path: props.path }),
    disabled: () => props.sent,
    overlay: SheetOverlay,
  });
</script>

<template>
  <div class="h-72 w-56">
    <div
      v-show="!sent"
      ref="el"
      :aria-label="t('notFound.lost')"
      class="group size-full cursor-grab rounded-(--ui-radius) outline-offset-8 select-none focus-visible:outline-2 focus-visible:outline-(--ui-primary)"
      :class="isDragging ? 'opacity-25' : ''"
    >
      <!-- Its tilt is on the sheet: the box the drag measures stays upright. -->
      <NotFoundSheet
        :path="path"
        class="-rotate-3 drop-shadow-[0_22px_26px_rgb(0_0_0/0.22)] transition-transform duration-300 ease-(--ease-spring) group-hover:-translate-y-1 group-hover:-rotate-1"
      />
    </div>
  </div>
</template>
