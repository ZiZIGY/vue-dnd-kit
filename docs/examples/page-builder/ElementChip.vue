<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';
import BlockGhost from './BlockGhost.vue';
import Icon from './Icon.vue';
import { useBuilder } from './builder';
import { BLOCKS, type BlockKind, type ChipData } from './page';

const props = defineProps<{ kind: BlockKind }>();
const builder = useBuilder();
const info = computed(() => BLOCKS[props.kind]);

const el = useTemplateRef<HTMLElement>('el');
// A plain draggable, no list: a column makes a block from its `data` (`createItem`). The
// arrow keys jump from column to column.
makeDraggable(el, {
  id: () => `chip-${props.kind}`,
  data: (): ChipData => ({ kind: props.kind }),
  overlay: BlockGhost,
  keyboardMode: 'droppables',
});
</script>

<template>
  <!-- Space drags it; a click or Enter adds the block after the selection. -->
  <button ref="el" type="button" class="chip" :aria-label="`${info.name} element`" @click="builder.addBlock(kind)">
    <span class="symbol"><Icon :name="info.icon" /></span>
    {{ info.name }}
  </button>
</template>

<style scoped>
.chip {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 8px 0 4px;
  border: 0;
  border-radius: 9px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 11%, transparent);
  color: inherit;
  font: inherit;
  font-size: 12px;
  font-weight: 550;
  cursor: grab;
  transition: box-shadow 0.15s;
}

.chip:hover {
  box-shadow:
    0 0 0 1px color-mix(in srgb, #42b883 70%, transparent),
    0 8px 18px -10px rgb(0 0 0 / 0.4);
}

.chip:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 1px;
}

.symbol {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: color-mix(in srgb, currentColor 6%, transparent);
  font-size: 14px;
}

/* The chip in hand, before it reaches a column. */
[data-dnd-overlay] .chip {
  box-shadow:
    0 0 0 1.5px #42b883,
    0 18px 30px -14px rgb(0 0 0 / 0.55);
  rotate: -2deg;
}
</style>
