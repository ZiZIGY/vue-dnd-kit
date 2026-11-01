<script setup lang="ts">
import { inject, ref, useTemplateRef } from 'vue';
import { makeDroppable, useDnD, useDnDMonitor } from '@vue-dnd-kit/core';
import { BOARD } from './store';

const board = inject(BOARD)!;
const { selection } = useDnD();

const el = useTemplateRef<HTMLElement>('el');
// A plain drop target that takes cards only (their `type`), not columns. The board owns
// the cards, so the trash deletes them there, as the Delete buttons do: Undo brings them
// back. With no slot left to land on, the cards go into the trash one after another.
const { isOver, isAccepting } = makeDroppable(el, {
  id: 'trash',
  accept: 'card',
  onDrop: (event) => {
    board.remove(event.active.ids);
    selection.delete(...event.active.ids);
  },
});

// The lid shuts once the last card is in: a new count plays the gulp again.
const gulps = ref(0);
useDnDMonitor({
  onDragSettle: (event) => {
    if ('dropped' in event && event.over?.id === 'trash') gulps.value++;
  },
});
</script>

<template>
  <div ref="el" class="trash" :class="{ armed: isAccepting, over: isOver && isAccepting }">
    <svg :key="gulps" class="can" :class="{ gulp: gulps }" viewBox="0 0 24 24" aria-hidden="true">
      <path class="lid" d="M4.5 7h15M9.5 7V4.5h5V7" />
      <path d="M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5" />
    </svg>
    <span>{{ isOver && isAccepting ? 'Release to delete' : isAccepting ? 'Drop to delete' : 'Trash' }}</span>
  </div>
</template>

<style scoped>
.trash {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  gap: 7px;
  box-sizing: border-box;
  width: 148px;
  height: 34px;
  border: 1.5px dashed color-mix(in srgb, currentColor 18%, transparent);
  border-radius: 9px;
  font-size: 12px;
  font-weight: 600;
  opacity: 0.55;
  transition:
    opacity 0.2s,
    color 0.2s,
    border-color 0.2s,
    background-color 0.2s;
}

/* A card is in hand: the trash would take it. */
.trash.armed {
  border-color: color-mix(in srgb, #f43f5e 65%, transparent);
  background: color-mix(in srgb, #f43f5e 6%, transparent);
  color: light-dark(#e11d48, #fb7185);
  opacity: 1;
}

/* On a narrow board, the can alone: red while a card is in hand, filled when it is over. */
@container board (max-width: 600px) {
  .trash {
    width: 40px;
  }

  .trash span {
    display: none;
  }
}

.trash.over {
  border-style: solid;
  border-color: #f43f5e;
  background: #f43f5e;
  color: #fff;
}

.can {
  width: 16px;
  height: 16px;
  overflow: visible;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.lid {
  transform-origin: 19.5px 7px;
  transition: rotate 0.2s;
}

@media (prefers-reduced-motion: no-preference) {
  /* Over it, the lid opens; when the cards are in, the can gulps. */
  .over .lid {
    rotate: 24deg;
  }

  .gulp {
    animation: gulp 0.35s cubic-bezier(0.34, 1.6, 0.64, 1);
  }
}

@keyframes gulp {
  40% {
    scale: 1.25;
  }
}
</style>
