<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

type Mail = { id: string; from: string; subject: string; time: string; hue: number };
const props = defineProps<{ mail: Mail }>();
const emit = defineEmits<{ archive: [id: string] }>();

const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.mail });

const initials = computed(() =>
  props.mail.from
    .split(' ')
    .map((word) => word[0])
    .join(''),
);
</script>

<template>
  <li ref="el" class="mail-row">
    <span class="avatar" :style="{ background: `hsl(${mail.hue} 60% 45%)` }">{{ initials }}</span>
    <span class="text">
      <strong>{{ mail.from }}</strong>
      <small>{{ mail.subject }}</small>
    </span>
    <span class="time">{{ mail.time }}</span>
    <!-- A control for this row only: the copy that follows the pointer leaves it out. -->
    <button type="button" class="archive" aria-label="Archive" data-dnd-no-clone @click="emit('archive', mail.id)">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v4H4zM6 9v10h12V9M10 13h4" /></svg>
    </button>
  </li>
</template>

<style scoped>
/* No background: the inbox behind the rows paints them. */
.mail-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: grab;
  user-select: none;
}

.mail-row:not(:first-child)::before {
  content: '';
  position: absolute;
  top: 0;
  right: 12px;
  left: 56px;
  border-top: 1px solid color-mix(in srgb, currentColor 10%, transparent);
}

.mail-row:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

/*
 * The overlay is a copy of the row in <body>, outside the inbox: without this rule it
 * would be see-through. The copy keeps the row's classes and scope attribute, so a scoped
 * rule reaches it.
 */
[data-dnd-overlay] .mail-row {
  background: color-mix(in srgb, currentColor 3%, Canvas);
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent);
}

/* Lifted while it is dragged; the shadow goes as it lands ('dropping'). */
[data-dnd-overlay='dragging'] .mail-row {
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 12%, transparent),
    0 18px 32px -14px rgb(0 0 0 / 0.5);
}

/* The slot the row will land in. */
.mail-row[data-dnd-placeholder] {
  opacity: 1;
}

.mail-row[data-dnd-placeholder] > * {
  visibility: hidden;
}

.mail-row[data-dnd-placeholder]::after {
  content: '';
  position: absolute;
  inset: 2px;
  border: 1.5px dashed color-mix(in srgb, currentColor 30%, transparent);
  border-radius: inherit;
}

.avatar {
  display: grid;
  flex: none;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

.text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

strong {
  font-size: 13px;
  font-weight: 600;
}

small {
  overflow: hidden;
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.6;
}

.time {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}

.archive {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: none;
  color: inherit;
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.15s;
}

.mail-row:hover .archive,
.archive:focus-visible {
  opacity: 0.7;
}

.archive:hover {
  background: color-mix(in srgb, currentColor 10%, transparent);
  opacity: 1;
}

.archive svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
