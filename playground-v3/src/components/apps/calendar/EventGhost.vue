<script setup lang="ts">
  import { computed } from 'vue';
  import type { DragItem, Over } from '@vue-dnd-kit/core';
  import { formatRange, type CalendarEvent, type SlotData } from './calendar';

  /** Overlay of the calendar: the event with the time it would land on (from `over.data`). */
  const props = defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean }>();

  const event = computed(() => props.items[0]?.data as CalendarEvent | undefined);
  const slot = computed(() => (props.over?.data as SlotData | undefined) ?? null);
  const label = computed(() => {
    if (!event.value || !slot.value) return '';
    return props.accepted ? formatRange(slot.value.day, slot.value.minutes, event.value.duration) : 'Weekends are off';
  });
</script>

<template>
  <div
    v-if="event"
    class="cal-ghost"
    :class="{ refused: !!over && !accepted }"
    :style="{ '--color': event.color }"
    data-testid="event-ghost"
    :data-accepted="accepted"
  >
    <strong>{{ event.title }}</strong>
    <span data-testid="ghost-time">{{ label }}</span>
  </div>
</template>

<style scoped>
  .cal-ghost {
    display: flex;
    flex-direction: column;
    width: calc(100% - 6px);
    height: calc(100% - 2px);
    margin: 1px 3px;
    padding: 2px 6px;
    overflow: hidden;
    border-left: 3px solid var(--color);
    border-radius: 4px;
    background: color-mix(in srgb, var(--color) 22%, white);
    box-shadow: 0 10px 24px -6px rgb(15 23 42 / 0.35);
    color: #0f172a;
    font: 12px/1.3 system-ui, sans-serif;
  }

  .cal-ghost.refused {
    border-left-color: #dc2626;
    background: #fee2e2;
  }

  span {
    font-weight: 600;
    white-space: nowrap;
  }

  .refused span {
    color: #b91c1c;
  }
</style>
