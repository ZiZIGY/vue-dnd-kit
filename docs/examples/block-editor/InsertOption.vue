<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';
import { KINDS, type BlockKind } from './blocks';

/**
 * A kind of block to add: clicked, it is added; dragged, it goes where it is dropped. In the
 * menu it is an option of a listbox (`option`), which the keyboard reaches through the
 * menu; in the sidebar a draggable of its own, which Space picks up.
 */
const props = defineProps<{ kind: BlockKind; option?: boolean; active?: boolean }>();
const emit = defineEmits<{ pick: [] }>();

const el = useTemplateRef<HTMLElement>('el');
// A plain draggable: it stays where it is, and the page's `createItem` makes the new block.
makeDraggable(el, {
  id: () => `new-${props.kind}${props.option ? '-option' : ''}`,
  type: 'new-block',
  data: () => ({ kind: props.kind }),
  attributes: () => !props.option,
});
</script>

<template>
  <li
    :id="option ? `option-${kind}` : undefined"
    ref="el"
    class="kind"
    :class="{ active }"
    :role="option ? 'option' : undefined"
    :aria-selected="option ? active : undefined"
    :aria-label="option ? undefined : `Drag a new ${KINDS[kind].name.toLowerCase()} into the page`"
    @click="emit('pick')"
  >
    <span class="icon">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="KINDS[kind].icon" /></svg>
    </span>
    <span class="text">
      <strong>{{ KINDS[kind].name }}</strong>
      <small>{{ KINDS[kind].hint }}</small>
    </span>
    <kbd v-if="KINDS[kind].markdown && option">{{ KINDS[kind].markdown }}</kbd>
  </li>
</template>

<style scoped>
.kind {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 8px;
  border-radius: 7px;
  cursor: grab;
  user-select: none;
  transition: background-color 0.1s;
}

/* Opaque: the copy that follows the pointer is taken while the pointer is over it. */
.kind:hover,
.kind.active {
  background: color-mix(in srgb, currentColor 7%, Canvas);
}

.kind:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

/* The copy that follows the pointer: a card of its own. */
[data-dnd-overlay] .kind {
  background: Canvas;
  box-shadow:
    0 14px 28px -12px rgb(0 0 0 / 0.45),
    0 0 0 1px color-mix(in srgb, currentColor 12%, transparent);
}

.icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 8px;
  background: Canvas;
}

svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

strong {
  font-size: 13.5px;
  font-weight: 550;
}

small {
  overflow: hidden;
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.55;
}

kbd {
  padding: 1px 5px;
  border-radius: 4px;
  background: color-mix(in srgb, currentColor 7%, transparent);
  font: 11px/16px ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  opacity: 0.6;
}
</style>
