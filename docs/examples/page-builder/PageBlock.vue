<script setup lang="ts">
import { computed, nextTick, useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import BlockView from './BlockView.vue';
import Icon from './Icon.vue';
import { useBuilder } from './builder';
import { BLOCKS, excerpt, type Block } from './page';

const props = defineProps<{ block: Block }>();
const builder = useBuilder();
const { selected, hovered, editing } = builder;

const isSelected = computed(() => selected.value === props.block.id);
const isEditing = computed(() => editing.value === props.block.id);
const info = computed(() => BLOCKS[props.block.kind]);
// "Heading: Know what your users…", for screen readers.
const label = computed(() => [info.value.name, excerpt(props.block)].filter(Boolean).join(': '));

const el = useTemplateRef<HTMLElement>('el');
// The whole block drags: a click selects it, a press and a move pick it up. Not while its
// texts are edited: a press then places the caret or selects words.
makeSortableItem(el, {
  item: () => props.block,
  canDrag: () => !isEditing.value,
});

/** Double-click or Enter: the texts become editable, the caret where it was clicked. */
const edit = async (event?: MouseEvent) => {
  if (!info.value.text) return;
  builder.select(props.block.id);
  editing.value = props.block.id;
  await nextTick();
  const clicked = (event?.target as HTMLElement | undefined)?.closest<HTMLElement>('[contenteditable]');
  (clicked ?? el.value?.querySelector<HTMLElement>('[contenteditable]'))?.focus();
  const caret = event && document.caretPositionFromPoint?.(event.clientX, event.clientY);
  if (clicked && caret) getSelection()?.collapse(caret.offsetNode, caret.offset);
};

/** Done editing: one step of the history. Enter and Escape give the focus back to the block. */
const finish = (refocus: boolean) => {
  if (!isEditing.value) return;
  editing.value = null;
  builder.commit();
  if (refocus) el.value?.focus();
};

// A click outside the block's texts ends the editing; moving between its texts doesn't.
const onFocusout = (event: FocusEvent) => {
  if (!el.value?.contains(event.relatedTarget as Node | null)) finish(false);
};
</script>

<template>
  <div
    ref="el"
    class="page-block"
    :class="{ selected: isSelected, editing: isEditing, hovered: hovered === block.id }"
    :data-node="block.id"
    :data-focus="block.id"
    :aria-label="label"
    @click.stop="builder.select(block.id)"
    @focus="builder.select(block.id)"
    @dblclick="edit"
    @keydown.enter.self.prevent="edit()"
    @focusout="onFocusout"
  >
    <BlockView :block="block" :editing="isEditing" @finish="finish(true)" />

    <span class="tag" @click.stop @dblclick.stop>
      <Icon :name="info.icon" />
      {{ info.name }}
      <button type="button" aria-label="Duplicate" title="Duplicate (Ctrl+D)" @click="builder.duplicate(block.id)">
        <Icon name="copy" />
      </button>
      <button type="button" class="delete" aria-label="Delete" title="Delete (Del)" @click="builder.remove(block.id)">
        <Icon name="trash" />
      </button>
    </span>
  </div>
</template>

<style scoped>
.page-block {
  position: relative;
  border-radius: 4px;
  outline: 1px solid transparent;
  outline-offset: 4px;
  cursor: grab;
  transition: outline-color 0.12s;
}

.page-block:hover,
.page-block.hovered {
  outline-color: rgb(66 184 131 / 0.8);
}

.page-block.selected,
.page-block:focus-visible {
  outline: 2px solid #42b883;
}

.page-block.editing {
  outline-style: dashed;
  cursor: text;
}

html[data-dnd-dragging] .page-block:not(.selected) {
  outline-color: transparent;
}

/* The slot a block in hand will land in: its size, empty, dashed while you drag. */
.page-block[data-dnd-placeholder] {
  opacity: 0;
}

.page-block[data-dnd-placeholder] > * {
  visibility: hidden;
}

html[data-dnd-dragging] .page-block[data-dnd-placeholder] {
  opacity: 1;
  border-radius: 8px;
  outline: 1.5px dashed #42b883;
  outline-offset: 0;
  background: rgb(66 184 131 / 0.1);
}

/* ─── The selected block's tag, above it ──────────────────────────────────── */

.tag {
  position: absolute;
  bottom: calc(100% + 6px);
  left: -6px;
  z-index: 5;
  display: none;
  align-items: center;
  gap: 4px;
  height: 20px;
  padding: 0 2px 0 6px;
  border-radius: 5px;
  background: #42b883;
  color: #fff;
  font: 600 10.5px/1 ui-sans-serif, system-ui, sans-serif;
  letter-spacing: normal;
  text-align: left;
  white-space: nowrap;
  box-shadow: 0 2px 6px -2px rgb(0 0 0 / 0.35);
  cursor: default;
}

.selected:not(.editing) > .tag {
  display: flex;
}

html[data-dnd-dragging] .selected > .tag {
  display: none;
}

.tag button {
  display: grid;
  place-items: center;
  width: 18px;
  height: 16px;
  padding: 0;
  border: 0;
  border-radius: 3px;
  background: none;
  color: inherit;
  font-size: 11px;
  cursor: pointer;
}

.tag button:first-of-type {
  margin-left: 2px;
}

.tag button:hover {
  background: rgb(255 255 255 / 0.22);
}

.tag button:focus-visible {
  outline: 2px solid #1e293b;
}
</style>
