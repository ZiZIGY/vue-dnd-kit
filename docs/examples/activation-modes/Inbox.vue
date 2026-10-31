<script setup lang="ts">
import { ref, shallowRef, useTemplateRef, watch } from 'vue';
import { useEventListener } from '@vueuse/core';
import { makeDragArea, makeSortableList, useDnD, type ActivationOptions } from '@vue-dnd-kit/core';
import Message from './Message.vue';
import { CHATS } from './chats';

const MODES: Record<string, { activation?: ActivationOptions; code: string }> = {
  hold: {
    activation: { mouse: { delay: 400, tolerance: 8 }, touch: { delay: 400, tolerance: 8 } },
    code: 'activation: { mouse: { delay: 400, tolerance: 8 }, touch: … }',
  },
  distance: { activation: { mouse: { distance: 24 }, pen: { distance: 24 } }, code: 'activation: { mouse: { distance: 24 }, pen: … }' },
  handle: { code: "handle: '.grip'  // mouse: at once" },
};
const mode = ref('hold');

const chats = ref(CHATS);
const listRef = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(listRef, { items: chats });

// Rules for the drags that start inside the panel: here, when a press becomes a drag.
// An item's own `activation` would win over the area's, the provider's comes last.
const panel = useTemplateRef<HTMLElement>('panel');
makeDragArea(panel, { activation: () => MODES[mode.value]!.activation });

// While a press waits, `status` is 'activating' and `progress` goes from 0 to 1.
const { status, activation } = useDnD();

// The ring is drawn where the press started; the note says why a press gave up.
const press = shallowRef({ x: 0, y: 0 });
const note = ref('');
let holding = false;
const onPress = (event: PointerEvent) => {
  const box = panel.value!.getBoundingClientRect();
  press.value = { x: event.clientX - box.left, y: event.clientY - box.top };
  holding = true;
  note.value = '';
};
// Capture: before the sensor hears the release and the status changes.
useEventListener('pointerup', () => (holding = false), { capture: true });
// A press that gave up goes back to rest ('idle', or 'dropping' while an overlay lands).
watch(status, (now, before) => {
  if (before !== 'activating' || now === 'dragging') return;
  note.value = holding ? 'Moved more than 8 px while holding: no drag.' : 'Let go too early: just a click.';
});
</script>

<template>
  <div class="inbox">
    <div class="modes" role="radiogroup" aria-label="When a press becomes a drag">
      <label v-for="(_, name) in MODES" :key="name" :class="{ on: mode === name }">
        <input v-model="mode" type="radio" :value="name" />
        {{ name }}
      </label>
    </div>
    <code class="code">{{ MODES[mode]!.code }}</code>

    <div ref="panel" class="panel" @pointerdown.capture="onPress">
      <ul ref="list" class="list">
        <Message v-for="chat in items" :key="chat.id" :chat="chat" :handle="mode === 'handle'" />
      </ul>
      <svg
        v-if="status === 'activating'"
        class="press-ring"
        viewBox="0 0 40 40"
        :style="{ left: `${press.x}px`, top: `${press.y}px` }"
        aria-hidden="true"
      >
        <circle cx="20" cy="20" r="17" class="track" />
        <circle cx="20" cy="20" r="17" class="fill" pathLength="1" :stroke-dasharray="`${activation.progress.value} 1`" />
      </svg>
    </div>

    <p class="note" :class="{ on: note }">{{ note }}</p>
  </div>
</template>

<style scoped>
.inbox {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.modes {
  display: inline-flex;
  padding: 3px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

.modes label {
  padding: 6px 14px;
  border-radius: 7px;
  font: 600 12px/1.2 ui-monospace, Menlo, Consolas, monospace;
  cursor: pointer;
}

.modes label.on {
  background: Canvas;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
}

.modes label:has(input:focus-visible) {
  outline: 2px solid #42b883;
}

.modes input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.code {
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  text-align: center;
  opacity: 0.6;
}

.panel {
  position: relative;
  width: min(380px, 100%);
  padding: 6px;
  box-sizing: border-box;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 18px;
  background: Canvas;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Centered on the press; never what a hit test finds. */
.press-ring {
  position: absolute;
  width: 44px;
  height: 44px;
  margin: -22px 0 0 -22px;
  rotate: -90deg;
  pointer-events: none;
}

.press-ring circle {
  fill: none;
  stroke-width: 4;
}

.press-ring .track {
  stroke: color-mix(in srgb, currentColor 15%, transparent);
}

.press-ring .fill {
  stroke: #42b883;
  stroke-linecap: round;
}

.note {
  min-height: 1.4em;
  margin: 0;
  font: 12px/1.4 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0;
  transition: opacity 0.2s;
}

.note.on {
  opacity: 0.7;
}
</style>
