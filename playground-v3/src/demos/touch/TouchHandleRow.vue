<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import type { TouchTask } from './data';

  const props = defineProps<{ task: TouchTask }>();
  const el = useTemplateRef<HTMLElement>('el');
  const handle = useTemplateRef<HTMLElement>('handle');
  makeSortableItem(el, {
    id: () => props.task.id,
    handle,
    // The long press only exists to tell a scroll from a drag. A touch on the handle
    // can't scroll (`touch-action: none` below), so it drags after a few pixels.
    activation: { touch: { distance: 4 } },
  });
</script>

<template>
  <li
    ref="el"
    class="handle-row"
    :data-id="task.id"
  >
    <span class="text">
      <strong class="title">{{ task.title }}</strong>
      <small class="note">{{ task.note }}</small>
    </span>
    <span
      ref="handle"
      class="handle"
      data-testid="handle"
      aria-label="Drag handle"
      >⠿</span
    >
  </li>
</template>

<style scoped>
  /*
   * Only the handle has `touch-action: none`; the rest of the item keeps `auto`.
   *
   * - On the handle, the browser knows when the finger lands that this touch never
   *   pans or zooms. It doesn't wait to see whether the page wants the touchmove, it
   *   never fires `pointercancel` to start a scroll, and it works even while a fling is
   *   still running (touchmoves are then not cancelable, so `preventDefault()` in a
   *   touchmove listener couldn't stop the scroll). The drag can start after a few
   *   pixels instead of a long press.
   * - On the item body, a swipe scrolls the page as usual. With `touch-action: none` on
   *   the whole item, a list that fills the screen couldn't be scrolled at all.
   */
  .handle {
    flex: none;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    margin: -4px -8px -4px 0;
    border-radius: 8px;
    color: #6b7280;
    font-size: 22px;
    touch-action: none;
    cursor: grab;
  }

  .handle-row {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 60px;
    padding: 8px 12px;
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    color: #111827;
    font: 15px/1.3 system-ui, sans-serif;
  }

  .text {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
  }

  .title {
    font-weight: 600;
  }

  .note {
    color: #6b7280;
    font-size: 13px;
  }
</style>
