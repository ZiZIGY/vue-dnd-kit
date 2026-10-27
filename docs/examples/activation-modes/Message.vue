<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import type { Chat } from './chats';

const props = defineProps<{ chat: Chat; handle: boolean }>();
const el = useTemplateRef<HTMLElement>('el');

makeSortableItem(el, {
  item: () => props.chat,
  // With a handle only the grip starts a drag: at once with a mouse (the default for
  // handles), after 4 px by touch, since the grip doesn't scroll the page.
  handle: () => (props.handle ? '.grip' : undefined),
  activation: () => (props.handle ? { touch: { distance: 4 } } : undefined),
});
</script>

<template>
  <li ref="el" class="chat" :class="{ 'by-handle': handle }">
    <span class="avatar" :style="{ '--hue': chat.hue }">{{ chat.name[0] }}</span>
    <span class="text">
      <strong>{{ chat.name }}</strong>
      <small>{{ chat.text }}</small>
    </span>
    <time>{{ chat.time }}</time>
    <span class="grip" aria-hidden="true">⠿</span>
  </li>
</template>

<style scoped>
.chat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 10px 9px 12px;
  border-radius: 12px;
  background: Canvas;
  cursor: grab;
  user-select: none;
}

.chat.by-handle {
  cursor: default;
}

.chat:focus-visible,
.grip:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.chat[data-dnd-placeholder] {
  background: color-mix(in srgb, #42b883 9%, Canvas);
}

.chat[data-dnd-placeholder] > * {
  visibility: hidden;
}

[data-dnd-overlay] .chat {
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 12%, transparent),
    0 16px 28px -14px rgb(0 0 0 / 0.5);
}

.avatar {
  display: grid;
  flex: none;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, hsl(var(--hue) 70% 62%), hsl(calc(var(--hue) + 40) 65% 45%));
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}

.text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  font-size: 13px;
}

.text small {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.55;
}

time {
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.45;
}

.grip {
  display: grid;
  place-items: center;
  width: 26px;
  height: 32px;
  margin-right: -4px;
  border-radius: 7px;
  font-size: 16px;
  opacity: 0.3;
}

/* The only place a drag starts: it shows, and a touch on it never scrolls. */
.by-handle .grip {
  background: color-mix(in srgb, #42b883 14%, transparent);
  color: #42b883;
  opacity: 1;
  cursor: grab;
  touch-action: none;
}
</style>
