<script setup lang="ts">
import { computed } from 'vue';
import type { DnDStatus, DragItem, DragMode, Over } from '@vue-dnd-kit/core';

// The props of an overlay component (`OverlayProps`) this one reads. They change while
// you drag, and the overlay re-renders with them.
const props = defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean; status: DnDStatus; mode: DragMode }>();
const ticket = computed(() => props.items[0]?.item as { title: string; tag: string; approved: boolean });

const state = computed(() => {
  if (props.status === 'dropping') return props.over ? 'landed' : 'landing';
  if (!props.over) return 'free';
  return props.accepted ? 'ok' : 'refused';
});

const hint = computed(() => {
  const column = props.over?.id;
  const copy = props.mode === 'copy';
  switch (state.value) {
    case 'ok':
      return `${copy ? 'Copy' : 'Move'} to ${column}`;
    case 'refused':
      return `${column} takes approved tickets only`;
    case 'landed':
      return `${copy ? 'Copied' : 'Moved'} to ${column}`;
    case 'landing':
      return 'Landing';
    default:
      return 'Drop on a column · Alt copies';
  }
});
</script>

<template>
  <!-- Fills the overlay box, which takes the size of the slot. -->
  <div class="ticket-overlay" :data-state="state">
    <span class="title">{{ ticket.title }}</span>
    <span class="meta">
      <span class="tag">{{ ticket.tag }}</span>
      <span class="review" :class="{ approved: ticket.approved }">
        {{ ticket.approved ? 'Approved' : 'In review' }}
      </span>
    </span>
    <span v-if="mode === 'copy'" class="copy">+ copy</span>
    <span class="hint">
      <svg v-if="state === 'landed'" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 8.5 2.5 2.5L12 5.5" /></svg>
      <svg v-else-if="state === 'refused'" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 5l6 6M11 5l-6 6" /></svg>
      {{ hint }}
    </span>
  </div>
</template>

<style scoped>
.ticket-overlay {
  --ring: color-mix(in srgb, currentColor 25%, transparent);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  background: Canvas;
  box-shadow:
    0 0 0 1.5px var(--ring),
    0 18px 32px -14px rgb(0 0 0 / 0.55);
  font-size: 13px;
  transition:
    box-shadow 0.15s,
    rotate 0.15s;
}

.ticket-overlay[data-state='ok'],
.ticket-overlay[data-state='landed'] {
  --ring: #42b883;
}

.ticket-overlay[data-state='refused'] {
  --ring: #ef4444;
  background: color-mix(in srgb, #ef4444 8%, Canvas);
  rotate: -1.5deg;
}

.title {
  font-weight: 500;
  line-height: 1.3;
}

.meta {
  display: flex;
  align-items: center;
  font-size: 11px;
}

.tag {
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}

.review {
  margin-left: auto;
  padding: 2px 6px;
  border-radius: 6px;
  background: color-mix(in srgb, #f59e0b 16%, transparent);
  color: #f59e0b;
  font-weight: 600;
}

.review.approved {
  background: color-mix(in srgb, #42b883 16%, transparent);
  color: #42b883;
}

.copy {
  position: absolute;
  top: -9px;
  right: -9px;
  padding: 3px 7px;
  border-radius: 99px;
  background: #42b883;
  color: #04130c;
  font-size: 11px;
  font-weight: 700;
}

/* The hint hangs under the box, like a tooltip of the pointer. */
.hint {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 7px;
  background: color-mix(in srgb, currentColor 85%, Canvas);
  color: Canvas;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

[data-state='ok'] .hint,
[data-state='landed'] .hint {
  background: #42b883;
  color: #04130c;
}

[data-state='refused'] .hint {
  background: #ef4444;
  color: #fff;
}

.hint svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
