<script setup lang="ts">
  import { DnDProvider, restrictToParent, snapToGrid } from '@vue-dnd-kit/core';
  import CalendarWeek from '../../components/apps/calendar/CalendarWeek.vue';
  import EventGhost from '../../components/apps/calendar/EventGhost.vue';
  import { DAY_WIDTH, SLOT_HEIGHT, eventTopSlot } from '../../components/apps/calendar/calendar';

  // Own provider: modifiers and collision detection are provider-wide.
  // Snap to whole cells of the week (from its top-left), then keep the event inside it.
  const modifiers = [snapToGrid({ x: DAY_WIDTH, y: SLOT_HEIGHT, smooth: { duration: 80 } }), restrictToParent];
</script>

<template>
  <section>
    <h2 class="cal-heading">Week</h2>
    <p class="cal-hint">
      Drag events to another day or time: they snap to half-hours and stay inside the week. Weekends are kept free. With
      the keyboard, arrows move a picked-up event by one day or half-hour.
    </p>
    <DnDProvider
      :modifiers="modifiers"
      :collision="eventTopSlot"
    >
      <CalendarWeek />
      <template #overlay="{ items, over, accepted }">
        <EventGhost
          :items="items"
          :over="over"
          :accepted="accepted"
        />
      </template>
    </DnDProvider>
  </section>
</template>

<style scoped>
  .cal-heading {
    margin: 0 0 4px;
  }

  .cal-hint {
    max-width: 760px;
    margin: 0 0 12px;
    color: var(--ui-text-muted);
  }
</style>
