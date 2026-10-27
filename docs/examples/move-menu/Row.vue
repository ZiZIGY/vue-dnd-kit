<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue';
import { onClickOutside, onKeyStroke } from '@vueuse/core';
import { makeSortableItem } from '@vue-dnd-kit/core';
import { useDnDActions } from '@vue-dnd-kit/actions';

const props = defineProps<{
  task: { id: string; title: string; points: number };
  index: number;
  other: { id: string; title: string };
}>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.task });

const open = ref(false);
const menu = useTemplateRef<HTMLElement>('menu');
onClickOutside(menu, () => (open.value = false));
onKeyStroke('Escape', () => (open.value = false));

const { moveItem, startDrag } = useDnDActions();
const choose = async (action: () => unknown) => {
  open.value = false;
  await nextTick();
  await action();
};

// One move in one call: picked up, put there and dropped, announced and animated.
const toTop = () => moveItem(props.task.id, { index: 0 });
const toOther = () => moveItem(props.task.id, { list: props.other.id, index: 0 });
// A keyboard drag, handed to the arrow keys: Space or Enter drops, Escape cancels.
const withKeys = () => {
  el.value?.focus();
  startDrag(props.task.id, { type: 'keyboard' });
};
</script>

<template>
  <li ref="el" class="row">
    <span class="title">{{ task.title }}</span>
    <span class="points">{{ task.points }}</span>
    <span ref="menu" class="more">
      <button type="button" aria-label="Move…" :aria-expanded="open" @click="open = !open">⋯</button>
      <span v-if="open" class="menu" role="menu">
        <button type="button" role="menuitem" @click="choose(withKeys)">Move with arrow keys</button>
        <button type="button" role="menuitem" @click="choose(toOther)">Send to {{ other.title }}</button>
        <button type="button" role="menuitem" :disabled="index === 0" @click="choose(toTop)">To the top</button>
      </span>
    </span>
  </li>
</template>

<style scoped>
.row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 6px 7px 12px;
  border-radius: 10px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 9%, transparent);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.row:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.row[data-dnd-placeholder] {
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #42b883 55%, transparent);
  background: color-mix(in srgb, #42b883 7%, Canvas);
}

.row[data-dnd-placeholder] > * {
  visibility: hidden;
}

[data-dnd-overlay] .row {
  box-shadow:
    0 0 0 2px #42b883,
    0 16px 28px -14px rgb(0 0 0 / 0.5);
}

.title {
  flex: 1;
}

.points {
  padding: 3px 7px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
}

.more > button {
  width: 26px;
  height: 26px;
  border: 0;
  border-radius: 7px;
  background: none;
  color: inherit;
  font-size: 16px;
  cursor: pointer;
}

.more > button:hover,
.more > button[aria-expanded='true'] {
  background: color-mix(in srgb, currentColor 10%, transparent);
}

.menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  min-width: 210px;
  padding: 4px;
  border-radius: 10px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 14%, transparent),
    0 14px 30px -12px rgb(0 0 0 / 0.5);
}

.menu button {
  padding: 8px 10px;
  border: 0;
  border-radius: 7px;
  background: none;
  color: inherit;
  font: 13px/1.2 system-ui, sans-serif;
  text-align: left;
  cursor: pointer;
}

.menu button:hover:not(:disabled),
.menu button:focus-visible {
  background: color-mix(in srgb, #42b883 16%, transparent);
  outline: none;
}

.menu button:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
