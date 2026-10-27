<script setup lang="ts">
import { reactive, shallowRef, useTemplateRef } from 'vue';
import {
  makeDroppable,
  restrictToParent,
  restrictToWindowEdges,
  useDnDMonitor,
  type Modifier,
} from '@vue-dnd-kit/core';
import SelfView from './SelfView.vue';

const BOUNDS: { label: string; modifiers: Modifier[] }[] = [
  { label: 'restrictToParent', modifiers: [restrictToParent] },
  { label: 'restrictToWindowEdges', modifiers: [restrictToWindowEdges] },
  { label: 'none', modifiers: [] },
];
const bound = shallowRef(BOUNDS[0]!);

// The self view stays where it is dropped on the screen; dropped off it, it flies back.
const pip = reactive({ x: 380, y: 160 });
const screen = useTemplateRef<HTMLElement>('screen');
makeDroppable(screen, { id: 'screen' });
useDnDMonitor({
  onDragEnd({ over, position }) {
    if (over?.id !== 'screen' || !position) return;
    pip.x = Math.round(position.x);
    pip.y = Math.round(position.y);
  },
});
</script>

<template>
  <div class="call">
    <div class="options" role="group" aria-label="Bounds">
      <button
        v-for="option in BOUNDS"
        :key="option.label"
        type="button"
        :aria-pressed="bound === option"
        @click="bound = option"
      >
        {{ option.label }}
      </button>
    </div>
    <!-- On a narrow screen, the call scrolls sideways. -->
    <div class="scroll">
      <div ref="screen" class="screen">
        <div class="speaker">
          <span class="avatar">MC</span>
          <span class="name">Maya Chen</span>
        </div>
        <SelfView :x="pip.x" :y="pip.y" :modifiers="bound.modifiers" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.call {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: 100%;
}

.options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 3px;
  padding: 3px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

button {
  padding: 6px 10px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: inherit;
  font: 12px/1.2 ui-monospace, Menlo, Consolas, monospace;
  cursor: pointer;
}

button[aria-pressed='true'] {
  background: Canvas;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
}

button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.scroll {
  max-width: 100%;
  overflow-x: auto;
}

.screen {
  position: relative;
  width: 520px;
  height: 260px;
  border-radius: 16px;
  background:
    radial-gradient(circle at 50% 42%, #3b4d6b, transparent 60%),
    #151b26;
  color: #fff;
}

.speaker {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.avatar {
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: hsl(160 55% 42%);
  font-size: 22px;
  font-weight: 600;
}

.name {
  font-size: 13px;
  opacity: 0.8;
}
</style>
