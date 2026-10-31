<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable, snapCenterToCursor } from '@vue-dnd-kit/core';
import MessageChip from './MessageChip.vue';

const props = defineProps<{
  message: { id: string; from: string; subject: string; snippet: string; time: string; hue: number };
}>();

const el = useTemplateRef<HTMLElement>('el');
const { isDragging, selected } = makeDraggable(el, {
  id: () => props.message.id,
  data: () => props.message,
  // A compact chip under the cursor, as mail apps do, instead of the whole row.
  overlay: MessageChip,
  modifiers: [snapCenterToCursor],
});
</script>

<template>
  <li ref="el" class="message" :class="{ picked: selected, away: isDragging }">
    <button
      type="button"
      role="checkbox"
      class="check"
      :aria-checked="selected"
      :aria-label="`Select ${message.subject}`"
      @click.stop="selected = !selected"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 8.5 2.5 2.5L12 5.5" /></svg>
    </button>
    <span class="avatar" :style="{ '--hue': message.hue }">{{ message.from[0] }}</span>
    <span class="text">
      <span class="top">
        <strong>{{ message.from }}</strong>
        <time>{{ message.time }}</time>
      </span>
      <span class="subject">{{ message.subject }}</span>
      <span class="snippet">{{ message.snippet }}</span>
    </span>
  </li>
</template>

<style scoped>
.message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 10px;
  font-size: 13px;
  cursor: grab;
  user-select: none;
  transition:
    background-color 0.15s,
    opacity 0.15s;
}

.message:hover {
  background: color-mix(in srgb, currentColor 4%, transparent);
}

.message.picked {
  background: color-mix(in srgb, #42b883 10%, transparent);
}

/* The messages on their way to a folder. */
.message.away {
  opacity: 0.4;
}

.message:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.check {
  display: grid;
  flex: none;
  place-items: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 1.5px solid color-mix(in srgb, currentColor 35%, transparent);
  border-radius: 5px;
  background: none;
  color: inherit;
  cursor: pointer;
}

.check svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: #04130c;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
}

.picked .check {
  border-color: #42b883;
  background: #42b883;
}

.picked .check svg {
  opacity: 1;
}

.avatar {
  display: grid;
  flex: none;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: hsl(var(--hue) 70% 50% / 0.18);
  color: hsl(var(--hue) 60% 45%);
  font-weight: 700;
}

.text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.top {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

time {
  margin-left: auto;
  font-size: 11px;
  opacity: 0.5;
}

.subject,
.snippet {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.snippet {
  opacity: 0.55;
}
</style>
