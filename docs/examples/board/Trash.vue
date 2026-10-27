<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable, useDnD } from '@vue-dnd-kit/core';

const el = useTemplateRef<HTMLElement>('el');
const { selection } = useDnD();
// Takes cards only (their `type`), not columns. `source.remove()` takes the dragged cards
// out of the columns they came from.
const { isOver, isAccepting } = makeDroppable(el, {
  accept: 'card',
  onDrop: (event) => {
    event.source?.remove();
    selection.delete(...event.active.ids);
  },
});
</script>

<template>
  <div ref="el" class="trash" :class="{ armed: isAccepting, over: isOver && isAccepting }">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v5M14 11v5" />
    </svg>
    {{ isAccepting ? 'Drop to delete' : 'Trash' }}
  </div>
</template>

<style scoped>
.trash {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-sizing: border-box;
  width: 148px;
  height: 40px;
  border: 1.5px dashed color-mix(in srgb, currentColor 18%, transparent);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  opacity: 0.6;
  transition:
    opacity 0.2s,
    color 0.2s,
    border-color 0.2s,
    background 0.2s;
}

/* A card is in hand: the trash would take it. */
.trash.armed {
  border-color: color-mix(in srgb, #f43f5e 60%, transparent);
  color: #f43f5e;
  opacity: 1;
}

.trash.over {
  border-style: solid;
  background: color-mix(in srgb, #f43f5e 12%, transparent);
}

svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
