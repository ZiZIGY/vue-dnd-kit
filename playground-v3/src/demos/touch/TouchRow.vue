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
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    color: #111827;
    font: 15px/1.3 system-ui, sans-serif;
  }

  .avatar {
    flex: none;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #dbeafe;
    color: #1d4ed8;
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
    color: #6b7280;
    font-size: 13px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
