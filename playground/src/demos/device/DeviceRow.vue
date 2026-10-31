<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import type { TouchTask } from '../touch/data';

  /**
   * An item of the device checks:
   * - `plain`: text only, the whole item drags after a long press;
   * - `rich`: also a real link and an image, which a browser would long-press or drag
   *   natively (callout menu, context menu, native drag preview);
   * - `handle`: drags by its ⠿ handle only, at once (`touch-action: none`, 4px).
   */
  const props = defineProps<{ task: TouchTask; variant: 'plain' | 'rich' | 'handle' }>();
  const el = useTemplateRef<HTMLElement>('el');
  const handle = useTemplateRef<HTMLElement>('handle');
  makeSortableItem(
    el,
    // The variant never changes for an item.
    props.variant === 'handle'
      ? { id: () => props.task.id, handle, activation: { touch: { distance: 4 } } }
      : { id: () => props.task.id },
  );

  // An image of its own, without a network request.
  const IMAGE = `data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#bfdbfe"/><path d="M8 30l9-11 6 7 4-5 5 9z" fill="#1d4ed8"/><circle cx="28" cy="12" r="4" fill="#1d4ed8"/></svg>',
  )}`;
</script>

<template>
  <li
    ref="el"
    class="device-row"
    :data-id="task.id"
  >
    <img
      v-if="variant === 'rich'"
      :src="IMAGE"
      alt=""
      width="40"
      height="40"
      class="thumb"
      data-testid="image"
    />
    <span
      v-else
      class="avatar"
      aria-hidden="true"
      >{{ task.id.toUpperCase() }}</span
    >
    <span class="text">
      <strong class="title">{{ task.title }}</strong>
      <small class="note">
        <a
          v-if="variant === 'rich'"
          href="https://vuejs.org/"
          target="_blank"
          rel="noopener"
          data-testid="link"
          >vuejs.org</a
        >
        {{ task.note }}
      </small>
    </span>
    <span
      v-if="variant === 'handle'"
      ref="handle"
      class="handle"
      data-testid="handle"
      aria-label="Drag handle"
      >⠿</span
    >
  </li>
</template>

<style scoped>
  .device-row {
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

  .avatar,
  .thumb {
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: var(--ui-radius);
  }

  .avatar {
    display: grid;
    place-items: center;
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
    flex: 1;
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

  .note a {
    color: var(--ui-primary);
  }

  /* As in the touch-handle demo: only the handle refuses to pan, the rest scrolls. */
  .handle {
    flex: none;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    margin: -4px -8px -4px 0;
    border-radius: var(--ui-radius);
    color: var(--ui-text-dimmed);
    font-size: 22px;
    touch-action: none;
    cursor: grab;
  }
</style>
