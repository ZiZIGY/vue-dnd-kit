<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue';
import { useDnDMonitor } from '@vue-dnd-kit/core';
import type { LoggedEvent } from './describe';

const props = defineProps<{ events: LoggedEvent[]; record: (name: string, type: string, payload: unknown) => void }>();

// `null`: follow the newest event.
const chosen = ref<number | null>(null);
const shown = computed(() => props.events.find((event) => event.id === chosen.value) ?? props.events.at(-1));

// The newest events stay in view.
const timeline = useTemplateRef<HTMLElement>('timeline');
watch(
  () => props.events.length,
  () => timeline.value?.scrollTo({ top: timeline.value.scrollHeight }),
  { flush: 'post' },
);

// Every drag under the provider, wherever it starts. Monitors hear `onBeforeDrop` first.
useDnDMonitor({
  onDragStart: (event) => {
    chosen.value = null;
    props.record('onDragStart', 'DnDEvent', event);
  },
  onDragMove: (event) => props.record('onDragMove', 'DnDEvent', event),
  onDragOver: (event) => props.record('onDragOver', 'DnDEvent', event),
  onBeforeDrop: (event) => props.record('onBeforeDrop', 'DnDEvent', event),
  onDragEnd: (event) => {
    props.record('onDragEnd', 'DnDEndEvent', event);
    // Open the list's drop event: it carries `result`, the lists as the drop leaves them.
    chosen.value = props.events.find((entry) => entry.name.endsWith('.onDrop'))?.id ?? null;
  },
  onDragCancel: (event) => props.record('onDragCancel', 'DnDEvent', event),
});
</script>

<template>
  <section class="inspector" aria-label="Events">
    <div ref="timeline" class="timeline">
      <button
        v-for="event in events"
        :key="event.id"
        type="button"
        :aria-pressed="event === shown"
        @click="chosen = event.id"
      >
        {{ event.name }}<span v-if="event.count > 1" class="times"> ×{{ event.count }}</span>
      </button>
    </div>
    <div class="payload">
      <template v-if="shown">
        <div v-for="(line, index) in shown.lines" :key="index" class="code-line" :style="{ '--depth': line.depth }">
          <span v-for="(token, at) in line.tokens" :key="at" :class="token.kind">{{ token.text }}</span>
        </div>
      </template>
      <p v-else class="empty">Drag a task: its events land here, payloads in full.</p>
    </div>
  </section>
</template>

<style scoped>
.inspector {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 356px;
  max-width: 100%;
  padding: 10px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  font: 11px/1.5 ui-monospace, Menlo, Consolas, monospace;
}

/* Fixed heights: the inspector never grows during a drag, so nothing moves under the pointer. */
.timeline {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 4px;
  height: 72px;
  overflow: auto;
}

.timeline button {
  padding: 2px 7px;
  border: 0;
  border-radius: 6px;
  background: color-mix(in srgb, currentColor 7%, transparent);
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.timeline button[aria-pressed='true'] {
  background: #42b883;
  color: #fff;
}

.timeline button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 1px;
}

.times {
  opacity: 0.7;
}

.empty {
  margin: 0;
  opacity: 0.5;
}

.payload {
  height: 230px;
  overflow: auto;
  padding: 8px 10px;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 5%, Canvas);
}

/* Wrapped lines hang under their key. */
.code-line {
  padding-left: calc(var(--depth) * 2ch + 2ch);
  text-indent: -2ch;
  overflow-wrap: anywhere;
}

.key {
  opacity: 0.6;
}

.type {
  color: #42b883;
  font-weight: 600;
}

.string {
  color: #42b883;
}

.number {
  color: #e6a23c;
}

.literal {
  color: #c678dd;
}
</style>
