<script setup lang="ts">
import { inject } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';
import Editable from './Editable.vue';
import { KINDS, KIND_LIST, type Block } from './blocks';
import { caretOffset, caretOnEdgeLine } from './caret';
import { EDITOR } from './editor';

/**
 * A block's text, with the keys of an editor: Enter splits the block, Backspace at the
 * start joins it to the one above, the arrows go on to the next block, Tab nests it, "/"
 * opens the menu of blocks, and Markdown ("## ", "- ", "[] ") changes its kind.
 */
const props = defineProps<{ block: Block; tag?: string; placeholder: string; multiline?: boolean }>();
const editor = inject(EDITOR)!;
const { selection } = useDnD();

const MARKDOWN = new Map(KIND_LIST.filter((kind) => KINDS[kind].markdown).map((kind) => [KINDS[kind].markdown!, kind]));
const STEPS: Record<string, 1 | -1> = { ArrowUp: -1, ArrowLeft: -1, ArrowDown: 1, ArrowRight: 1 };

const onKeydown = (event: KeyboardEvent) => {
  const field = event.currentTarget as HTMLElement;
  const { id, text } = props.block;
  const caret = caretOffset(field);
  const step = STEPS[event.key];
  const plain = !event.altKey && !event.ctrlKey && !event.metaKey;

  if (event.key === 'Enter' && plain && !event.shiftKey && !props.multiline) {
    event.preventDefault();
    editor.split(id, caret ?? text.length);
  } else if (event.key === 'Backspace' && caret === 0) {
    event.preventDefault();
    editor.backspace(id);
  } else if (event.key === 'Tab') {
    event.preventDefault();
    if (event.shiftKey) editor.outdent(id);
    else editor.indent(id);
  } else if (event.key === 'Escape') {
    // Out of the text, onto the block: selected, with its handle focused. Space drags it from there.
    event.preventDefault();
    selection.set([id]);
    editor.focusHandle(id);
  } else if (step && plain && !event.shiftKey) {
    const vertical = event.key === 'ArrowUp' || event.key === 'ArrowDown';
    const atEdge = vertical ? caretOnEdgeLine(field, step) : caret === (step < 0 ? 0 : text.length);
    if (!atEdge) return;
    event.preventDefault();
    editor.focusNext(field, step, step < 0 ? 'end' : 'start');
  }
};

// Runs after the field has written its text into the block.
const onInput = (event: Event) => {
  const { id, text } = props.block;
  const caret = caretOffset(event.currentTarget as HTMLElement) ?? text.length;
  const typed = (event as InputEvent).data;
  if (typed === '/') editor.menu.value = { type: 'command', id, at: caret - 1 };
  if (typed !== ' ') return;
  const kind = MARKDOWN.get(text.slice(0, caret - 1));
  if (!kind || kind === props.block.kind) return;
  editor.turnInto([id], kind);
  editor.get(id)!.text = text.slice(caret);
};
</script>

<template>
  <Editable
    v-model="block.text"
    :tag="tag"
    :placeholder="placeholder"
    :data-text="block.id"
    :aria-label="KINDS[block.kind].name"
    :aria-multiline="multiline || undefined"
    @beforeinput="editor.recordTyping(block.id)"
    @input="onInput"
    @keydown="onKeydown"
    @focus="selection.clear()"
  />
</template>
