<script setup lang="ts">
  import { computed, ref, shallowRef } from 'vue';
  import { useDnDMonitor, type DnDEvent } from '@vue-dnd-kit/core';
  import SlotCell from './SlotCell.vue';
  import EventBlock from './EventBlock.vue';
  import {
    DAYS,
    DAY_START,
    DAY_WIDTH,
    SLOTS,
    SLOT_HEIGHT,
    SLOT_MINUTES,
    createEvents,
    formatRange,
    formatTime,
    isWeekend,
    type CalendarEvent,
    type SlotData,
  } from './calendar';

  const events = ref<CalendarEvent[]>(createEvents());
  const lastAction = shallowRef('');

  // A slot takes the drop only when its accept rule passes (no weekends).
  const moveTo = (event: DnDEvent, slot: SlotData) => {
    const item = events.value.find((entry) => entry.id === event.active.id);
    if (!item || (item.day === slot.day && item.start === slot.minutes)) return;
    item.day = slot.day;
    item.start = slot.minutes;
    lastAction.value = `${item.title} moved to ${formatRange(item.day, item.start, item.duration)}`;
  };

  // Arrow keys move a picked-up event one day or one half-hour at a time.
  useDnDMonitor({
    getKeyboardCoordinates: (_event, { pointer, direction }) => ({
      x: pointer.x + direction.x * DAY_WIDTH,
      y: pointer.y + direction.y * SLOT_HEIGHT,
    }),
  });

  const hours = Array.from({ length: SLOTS / 2 }, (_, index) => formatTime(DAY_START + index * 2 * SLOT_MINUTES));
  const state = computed(() =>
    [...events.value]
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((item) => `${item.id}:${formatRange(item.day, item.start, item.duration).replace(' – ', '-')}`)
      .join(' | '),
  );
</script>

<template>
  <div class="cal">
    <div class="cal-head">
      <span />
      <span
        v-for="(day, index) in DAYS"
        :key="day"
        :class="{ weekend: isWeekend(index) }"
        >{{ day }}</span
      >
    </div>
    <div class="cal-main">
      <div class="cal-hours">
        <span
          v-for="hour in hours"
          :key="hour"
          >{{ hour }}</span
        >
      </div>
      <!-- The events' parent: snapToGrid counts from its top-left, restrictToParent keeps events in it. -->
      <div
        class="cal-body"
        data-testid="week"
      >
        <div class="cal-cells">
          <template
            v-for="slot in SLOTS"
            :key="slot"
          >
            <SlotCell
              v-for="(_, day) in DAYS"
              :key="`${day}-${slot}`"
              :day="day"
              :slot="slot - 1"
              @drop="moveTo"
            />
          </template>
        </div>
        <EventBlock
          v-for="item in events"
          :key="item.id"
          :event="item"
        />
      </div>
    </div>
    <p
      class="cal-last"
      data-testid="calendar-last"
    >
      {{ lastAction }}
    </p>
  </div>
  <pre data-testid="calendar-state">{{ state }}</pre>
</template>

<style scoped>
  .cal {
    width: max-content;
    padding: 12px 16px 4px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
  }

  .cal-head {
    display: grid;
    grid-template-columns: 48px repeat(7, 110px);
    margin-bottom: 4px;
    color: #475569;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
  }

  .cal-head .weekend {
    color: #94a3b8;
  }

  .cal-main {
    display: flex;
  }

  /* Labels sit centered on the hour lines. */
  .cal-hours {
    display: flex;
    flex-direction: column;
    width: 48px;
    margin-top: -7px;
    color: #94a3b8;
    font-size: 11px;
    line-height: 14px;
  }

  .cal-hours span {
    flex: none;
    height: 48px;
    padding-right: 6px;
    text-align: right;
  }

  /* No border or padding: the grid starts exactly at the body's top-left corner. */
  .cal-body {
    position: relative;
    width: 770px;
    height: 480px;
    box-shadow: 0 0 0 1px #e2e8f0;
  }

  .cal-cells {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: repeat(7, 110px);
    grid-template-rows: repeat(20, 24px);
  }

  .cal-last {
    min-height: 20px;
    margin: 8px 0 0;
    color: #475569;
    font-size: 12px;
  }
</style>
