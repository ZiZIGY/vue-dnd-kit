<script setup lang="ts">
import { computed, inject } from 'vue';
import { DragPreview, type DnDStatus, type DragItem, type Over } from '@vue-dnd-kit/core';
import Icon from './Icon.vue';
import StatusIcon from './StatusIcon.vue';
import { BOARD } from './store';

// The overlay's props this one reads (see `OverlayProps`).
const props = defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean; status: DnDStatus }>();
const board = inject(BOARD)!;

// A preview is as large as its card was; here each one fills the box instead.
const FILL = { width: '100%', height: '100%' };
// Where the cards under the grabbed one lie: turned by their wrappers' `transform`, which
// the landing undoes as each one flies to its own slot.
const PILE = ['translate(7px, 6px) rotate(3deg)', 'translate(-6px, 10px) rotate(-3.5deg)'];

/** The cards under the grabbed one, the deepest first. */
const pile = computed(() =>
  props.items
    .slice(1, 3)
    .map((item, index) => ({ item, place: PILE[index] }))
    .reverse(),
);

/** What letting go here would do, said under the cards while they are dragged. */
const hint = computed(() => {
  if (props.status !== 'dragging' || !props.over) return null;
  const many = props.items.length > 1 ? ` ${props.items.length} cards` : '';
  if (props.over.id === 'trash') return { tone: 'danger', icon: 'trash', text: `Delete${many}` };
  const column = board.column(props.over.id);
  if (!column) return null;
  if (!props.accepted) return { tone: 'danger', icon: 'limit', text: `${column.title} is full · ${column.limit} max` };
  // The board changes on drop: while dragging, the grabbed card is still in its column.
  if (board.find(props.items[0]!.id)?.column.id === column.id) return null;
  if (column.confirm) return { tone: 'done', column, text: `Complete${many}` };
  return { tone: '', column, text: `Move${many} to ${column.title}` };
});
</script>

<template>
  <!-- The card in hand, lifted and tilted, the rest of a selection piled up under it. -->
  <div class="hand" :class="{ held: status === 'dragging', refused: hint?.tone === 'danger' }">
    <!-- Over the trash, the cards shrink, ready to go in. -->
    <div class="stack" :class="{ shrunk: over?.id === 'trash' }">
      <div v-for="{ item, place } in pile" :key="item.id" class="under" :style="{ transform: place }">
        <DragPreview :id="item.id" class="face" :style="FILL" />
      </div>
      <DragPreview :id="items[0]!.id" class="face grabbed" :style="FILL" />
      <span v-if="items.length > 1" class="count">{{ items.length }}</span>
    </div>
    <span v-if="hint" :key="hint.text" class="hint" :class="hint.tone">
      <StatusIcon v-if="hint.column" :color="hint.tone === 'done' ? '#fff' : hint.column.color" :progress="hint.column.progress" />
      <Icon v-else :name="hint.icon!" />
      {{ hint.text }}
    </span>
  </div>
</template>

<style scoped>
.hand {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Shrunk with `transform`, which a landing reads: the cards go into the trash from where they are. */
.stack {
  position: absolute;
  inset: 0;
  transition: transform 0.2s;
}

.stack.shrunk {
  transform: scale(0.6);
}

.under {
  position: absolute;
  inset: 0;
}

.face {
  border-radius: 10px;
}

.grabbed {
  position: relative;
  transition:
    rotate 0.2s,
    scale 0.2s,
    box-shadow 0.2s;
}

.under .face {
  box-shadow: 0 4px 12px -6px rgb(0 0 0 / 0.4);
}

/* Over a column that refuses the cards (its limit), or over the trash. */
.refused .grabbed {
  box-shadow: 0 0 0 2px #f43f5e;
}

.count {
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  box-sizing: border-box;
  border-radius: 11px;
  background: #42b883;
  box-shadow: 0 0 0 2px light-dark(#fff, #18181b);
  color: #fff;
  font: 700 11px/22px 'Geist Mono', ui-monospace, Menlo, Consolas, monospace;
  text-align: center;
}

.refused .count {
  background: #f43f5e;
}

.hint {
  position: absolute;
  top: calc(100% + 12px);
  left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px 6px 8px;
  border-radius: 8px;
  background: light-dark(#18181b, #f4f4f5);
  box-shadow: 0 8px 20px -8px rgb(0 0 0 / 0.5);
  color: light-dark(#fafafa, #18181b);
  font: 600 12px/1 system-ui, sans-serif;
  white-space: nowrap;
}

.hint.done {
  background: #42b883;
  color: #fff;
}

.hint.danger {
  background: #f43f5e;
  color: #fff;
}

@media (prefers-reduced-motion: no-preference) {
  /* Picked up: the card lifts and tilts; it lies flat again as it lands. */
  .held .grabbed {
    rotate: 2deg;
    scale: 1.02;
  }

  .refused {
    animation: shake 0.3s;
  }

  .hint {
    animation: rise 0.18s ease-out;
  }
}

@keyframes shake {
  25% {
    translate: -4px 0;
  }

  75% {
    translate: 4px 0;
  }
}

@keyframes rise {
  from {
    opacity: 0;
    translate: 0 -4px;
  }
}
</style>
