<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable, type DnDEvent } from '@vue-dnd-kit/core';
  import { DAY_START, SLOT_MINUTES, isWeekend, type SlotData } from './calendar';

  const props = defineProps<{ day: number; slot: number }>();
  const emit = defineEmits<{ drop: [event: DnDEvent, slot: SlotData] }>();
  const el = useTemplateRef<HTMLElement>('el');

  const data: SlotData = { day: props.day, minutes: DAY_START + props.slot * SLOT_MINUTES };
  const { isOver, isAccepting } = makeDroppable(el, {
    id: `slot-${props.day}-${props.slot}`,
    data,
    // The accept rule: weekends stay free. Hovering them still shows why the drop is refused.
    accept: isWeekend(props.day) ? () => false : 'event',
    onDrop: (event) => emit('drop', event, data),
  });
</script>

<template>
  <div
    ref="el"
    class="cal-slot"
    :class="{ hour: slot % 2 === 0, weekend: isWeekend(day), over: isOver, refused: isOver && !isAccepting }"
  />
</template>

<style scoped>
  .cal-slot {
    border-right: 1px solid var(--ui-border);
    border-top: 1px dashed var(--ui-border-muted);
  }

  .cal-slot.hour {
    border-top: 1px solid var(--ui-border);
  }

  .cal-slot.weekend {
    background: repeating-linear-gradient(
      -45deg,
      transparent 0 6px,
      color-mix(in srgb, var(--ui-text) 4%, transparent) 6px 12px
    );
  }

  .cal-slot.over {
    background: var(--ui-primary-soft);
  }

  .cal-slot.refused {
    background: var(--ui-danger-soft);
  }
</style>
