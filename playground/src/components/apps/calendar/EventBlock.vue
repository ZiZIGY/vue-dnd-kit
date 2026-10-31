<script setup lang="ts">
  import { computed, useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';
  import { DAY_START, DAY_WIDTH, SLOT_HEIGHT, SLOT_MINUTES, formatRange, type CalendarEvent } from './calendar';

  const props = defineProps<{ event: CalendarEvent }>();
  const el = useTemplateRef<HTMLElement>('el');
  // A free draggable: the provider's modifiers snap it to the grid and keep it in the week.
  const { isDragging } = makeDraggable(el, {
    id: () => props.event.id,
    type: 'event',
    data: () => props.event,
  });

  // The box covers whole cells, so its top-left is on the grid the overlay snaps to.
  const style = computed(() => ({
    left: `${props.event.day * DAY_WIDTH}px`,
    top: `${((props.event.start - DAY_START) / SLOT_MINUTES) * SLOT_HEIGHT}px`,
    width: `${DAY_WIDTH}px`,
    height: `${(props.event.duration / SLOT_MINUTES) * SLOT_HEIGHT}px`,
  }));
</script>

<template>
  <div
    ref="el"
    class="cal-event"
    :class="{ dragging: isDragging }"
    :style="style"
    :data-id="event.id"
    :aria-label="`${event.title}, ${formatRange(event.day, event.start, event.duration)}`"
  >
    <div
      class="cal-card"
      :style="{ '--color': event.color }"
    >
      <strong>{{ event.title }}</strong>
      <small>{{ formatRange(event.day, event.start, event.duration).slice(4) }}</small>
    </div>
  </div>
</template>

<style scoped>
  .cal-event {
    position: absolute;
    z-index: 1;
    padding: 1px 3px;
    cursor: grab;
  }

  .cal-event:focus-visible {
    outline: none;
  }

  .cal-event:focus-visible .cal-card {
    box-shadow: 0 0 0 2px var(--ui-focus);
  }

  .cal-event.dragging {
    opacity: 0.35;
  }

  .cal-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 2px 6px;
    overflow: hidden;
    border-left: 3px solid var(--color);
    border-radius: var(--ui-radius-sm);
    background: color-mix(in srgb, var(--color) 16%, var(--ui-bg));
    color: var(--ui-text-highlighted);
    font-size: 12px;
    line-height: 1.3;
  }

  small {
    color: var(--ui-text-muted);
    font-variant-numeric: tabular-nums;
  }
</style>
