<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import {
  makeDraggable,
  makeDroppable,
  restrictToElement,
  restrictToFirstScrollableAncestor,
  restrictToHorizontalAxis,
  restrictToParent,
  restrictToVerticalAxis,
  restrictToWindowEdges,
  snapCenterToCursor,
  snapToGrid,
  type Modifier,
} from '@vue-dnd-kit/core';

const fence = useTemplateRef<HTMLElement>('fence');
// In the order they run: each one gets the offset the previous one returned.
const MODIFIERS: Record<string, Modifier> = {
  snapCenterToCursor,
  'snapToGrid(24)': snapToGrid(24),
  restrictToVerticalAxis,
  restrictToHorizontalAxis,
  restrictToParent,
  'restrictToElement(fence)': restrictToElement(fence),
  restrictToFirstScrollableAncestor,
  restrictToWindowEdges,
};
const names = Object.keys(MODIFIERS);
const enabled = ref(['restrictToParent']);
const chosen = computed(() => names.filter((name) => enabled.value.includes(name)));

const token = useTemplateRef<HTMLElement>('token');
// A getter: read when the drag starts, so a switch applies to the next drag.
const { isDragging } = makeDraggable(token, { modifiers: () => chosen.value.map((name) => MODIFIERS[name]!) });

const padA = useTemplateRef<HTMLElement>('padA');
const padB = useTemplateRef<HTMLElement>('padB');
const { isOver: overA } = makeDroppable(padA, { id: 'A' });
const { isOver: overB } = makeDroppable(padB, { id: 'B' });
</script>

<template>
  <div class="lab">
    <div class="switches" role="group" aria-label="modifiers">
      <label v-for="name in names" :key="name" :class="{ on: enabled.includes(name) }">
        <input v-model="enabled" type="checkbox" :value="name" />
        {{ name }}
      </label>
    </div>
    <code class="call">makeDraggable(el, { modifiers: [{{ chosen.join(', ') }}] })</code>

    <!-- `overflow: auto`: the token's first scrollable ancestor. -->
    <div class="viewport">
      <div class="parent">
        <span class="caption">parent</span>
        <div ref="token" class="token" :class="{ lifted: isDragging }" aria-label="Token" />
      </div>
      <div ref="fence" class="fence"><span class="caption">fence</span></div>
      <div ref="padA" class="pad a" :class="{ over: overA }">A</div>
      <div ref="padB" class="pad b" :class="{ over: overB }">B</div>
      <span class="caption corner">scrollable ancestor</span>
    </div>
  </div>
</template>

<style scoped>
.lab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.switches {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  max-width: 520px;
}

.switches label {
  padding: 3px 8px;
  border-radius: 6px;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 14%, transparent);
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.7;
  cursor: pointer;
  user-select: none;
}

.switches label.on {
  background: color-mix(in srgb, #42b883 16%, transparent);
  box-shadow: inset 0 0 0 1px #42b883;
  color: #42b883;
  opacity: 1;
}

.switches label:has(input:focus-visible) {
  outline: 2px solid #42b883;
}

.switches input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.call {
  max-width: 100%;
  padding: 5px 10px;
  overflow-x: auto;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 6%, transparent);
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  white-space: nowrap;
  color: #42b883;
}

.viewport {
  position: relative;
  box-sizing: border-box;
  width: 500px;
  max-width: 100%;
  height: 208px;
  overflow: auto;
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 14%, transparent);
}

.parent {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 264px;
  height: 168px;
  border-radius: 8px;
  /* The grid of `snapToGrid(24)`: it starts at the parent's top-left corner. */
  background:
    linear-gradient(to right, color-mix(in srgb, currentColor 7%, transparent) 1px, transparent 1px) 0 0 / 24px 24px,
    linear-gradient(to bottom, color-mix(in srgb, currentColor 7%, transparent) 1px, transparent 1px) 0 0 / 24px 24px;
  outline: 1px dashed color-mix(in srgb, currentColor 40%, transparent);
}

.fence {
  position: absolute;
  top: 36px;
  left: 120px;
  width: 228px;
  height: 120px;
  border-radius: 8px;
  outline: 1.5px dotted #42b883;
  pointer-events: none;
}

.token {
  position: absolute;
  top: 48px;
  left: 120px;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #42b883;
  box-shadow: 0 6px 14px -6px rgb(0 0 0 / 0.6);
  cursor: grab;
}

.token:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}

.token.lifted {
  opacity: 0.3;
}

.pad {
  position: absolute;
  left: 372px;
  display: grid;
  place-items: center;
  width: 112px;
  height: 80px;
  border-radius: 10px;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 18%, transparent);
  font: 600 13px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.6;
  transition:
    background 0.15s,
    box-shadow 0.15s,
    opacity 0.15s;
}

.pad.a {
  top: 12px;
}

.pad.b {
  top: 104px;
}

/* The target the collision function picked. */
.pad.over {
  background: color-mix(in srgb, #42b883 14%, transparent);
  box-shadow: inset 0 0 0 1.5px #42b883;
  color: #42b883;
  opacity: 1;
}

.caption {
  position: absolute;
  top: 6px;
  left: 8px;
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}

.fence .caption {
  top: auto;
  right: 8px;
  bottom: 6px;
  left: auto;
  color: #42b883;
  opacity: 0.9;
}

.caption.corner {
  top: auto;
  bottom: 6px;
  left: 14px;
}
</style>
