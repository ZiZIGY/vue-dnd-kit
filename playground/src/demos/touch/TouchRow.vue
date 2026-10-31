<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import type { TouchTask } from './data';

  /**
   * A whole-item drag target. It keeps the default `touch-action: auto`: a swipe that
   * starts on it scrolls the page, and only a long press (200ms, 5px tolerance) drags.
   * Its text is ordinary selectable text; the library keeps the long press from
   * selecting it or opening the context menu.
   */
  const props = defineProps<{ task: TouchTask }>();
  const el = useTemplateRef<HTMLElement>('el');
  makeSortableItem(el, { id: () => props.task.id });
</script>

<template>
  <li
    ref="el"
    class="touch-row"
    :data-id="task.id"
  >
    <span
      class="avatar"
      aria-hidden="true"
      >{{ task.id.toUpperCase() }}</span
    >
    <span class="text">
      <strong class="title">{{ task.title }}</strong>
      <small class="note">{{ task.note }}</small>
    </span>
  </li>
</template>

<style scoped>
  .touch-row {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 60px;
    padding: 8px 12px;
    background: var(--ui-surface);
    border: 1px solid var(--ui-border-accented);
    border-radius: var(--ui-radius-lg);
    color: var(--ui-text-highlighted);
    font: 15px/1.3 var(--font-sans);
  }

  .avatar {
    flex: none;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--ui-bg-elevated);
    box-shadow: inset 0 0 0 1px var(--ui-border-accented);
    color: var(--ui-text-muted);
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
  }

  .text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .title {
    font-weight: 600;
  }

  .note {
    overflow: hidden;
    color: var(--ui-text-muted);
    font-size: 13px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
