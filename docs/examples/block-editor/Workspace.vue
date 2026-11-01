<script setup lang="ts">
import { computed, inject, onMounted, useTemplateRef } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';
import InsertOption from './InsertOption.vue';
import Outline from './Outline.vue';
import Page from './Page.vue';
import { KIND_LIST, createBlock, type Block } from './blocks';
import { EDITOR } from './editor';

/** The editor's window: a top bar, the page, and two sidebars when there is room for them. */
const editor = inject(EDITOR)!;
const { selection, status } = useDnD();

const el = useTemplateRef<HTMLElement>('el');
onMounted(() => (editor.root.value = el.value));

const words = computed(() => {
  const count = (blocks: Block[]): number =>
    blocks.reduce((sum, block) => sum + (block.text.match(/\S+/g)?.length ?? 0) + count(block.children), 0);
  return count(editor.blocks.value);
});
const meta = computed(() =>
  selection.ids.size ? `${selection.ids.size} selected` : `${words.value} ${words.value === 1 ? 'word' : 'words'}`,
);

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);
const shortcut = (keys: string) => (isMac ? keys.replace('Ctrl+', '⌘') : keys);

// The editor's shortcuts. A keyboard drag owns the keys while it runs.
const onKeydown = (event: KeyboardEvent) => {
  if (status.value === 'dragging' || event.defaultPrevented) return;
  const target = event.target as HTMLElement;
  const command = event.ctrlKey || event.metaKey;
  const key = event.key.toLowerCase();
  const chosen = [...selection.ids].map(String);
  const handle = target.dataset.handle; // a focused handle: its block
  const field = target.dataset.text; // a focused text: its block, or the title

  if (command && (key === 'z' || key === 'y')) {
    event.preventDefault();
    if (key === 'y' || event.shiftKey) editor.redo();
    else editor.undo();
    if (field) editor.focus(field);
  } else if (command && key === 'd') {
    // Duplicates the selected blocks, or the one being typed in.
    const ids = chosen.length ? chosen : [field ?? handle].filter((id) => id && id !== 'title') as string[];
    if (!ids.length) return;
    event.preventDefault();
    const copies = editor.duplicate(ids);
    if (chosen.length) selection.set(copies);
    if (chosen.length || handle) editor.focusHandle(copies[0]!);
  } else if (target.isContentEditable || target.matches('input')) {
    // Typing: the other keys are the text's.
  } else if ((key === 'delete' || key === 'backspace') && (chosen.length || handle)) {
    event.preventDefault();
    editor.remove(chosen.length ? chosen : [handle!]);
    selection.clear();
  } else if (key === 'escape' && chosen.length) {
    event.preventDefault();
    selection.clear();
  } else if (handle && (key === 'arrowup' || key === 'arrowdown')) {
    // From handle to handle, selecting as it goes (Shift: adding).
    event.preventDefault();
    const ids = editor.visibleIds();
    const next = ids[ids.indexOf(handle) + (key === 'arrowdown' ? 1 : -1)];
    if (!next) return;
    if (event.shiftKey) selection.add(handle, next);
    else selection.set([next]);
    editor.focusHandle(next);
  } else if (handle && command && key === 'a') {
    event.preventDefault();
    selection.set(editor.visibleIds());
  }
};
</script>

<template>
  <div ref="el" class="workspace" @keydown="onKeydown">
    <header class="bar">
      <nav class="crumbs" aria-label="Breadcrumb">
        <span class="space">Team space</span>
        <span class="slash" aria-hidden="true">/</span>
        <span class="page" aria-current="page"><span aria-hidden="true">🚀</span> {{ editor.title.value || 'Untitled' }}</span>
      </nav>
      <span class="status" role="status">{{ editor.message.value }}</span>
      <span class="meta">{{ meta }}</span>
      <div class="tools">
        <button
          type="button"
          :disabled="!editor.canUndo.value"
          :aria-label="`Undo (${shortcut('Ctrl+Z')})`"
          :title="`Undo (${shortcut('Ctrl+Z')})`"
          @click="editor.undo()"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11" /></svg>
        </button>
        <button
          type="button"
          :disabled="!editor.canRedo.value"
          :aria-label="`Redo (${shortcut('Ctrl+Shift+Z')})`"
          :title="`Redo (${shortcut('Ctrl+Shift+Z')})`"
          @click="editor.redo()"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 14 5-5-5-5M20 9H9.5a5.5 5.5 0 0 0 0 11H13" /></svg>
        </button>
      </div>
    </header>

    <div class="body">
      <!-- Wide screens: every kind of block at hand. Drag one into the page, or click it. -->
      <aside class="library" aria-label="Blocks">
        <p class="caption">Blocks</p>
        <ul>
          <InsertOption v-for="kind in KIND_LIST" :key="kind" :kind="kind" @pick="editor.insertAfter(null, createBlock(kind))" />
        </ul>
        <p class="tip">Drag a block into the page, or click it to add it at the end.</p>
      </aside>
      <Page />
      <Outline />
    </div>
  </div>
</template>

<style scoped>
/*
 * Fixed height in the docs' frame; `flex: 1` fills it when the frame goes full screen (a
 * column that gives it the room). A container: the layout follows the editor's own width.
 */
.workspace {
  container: workspace / inline-size;
  display: flex;
  flex-direction: column;
  flex: 1;
  box-sizing: border-box;
  width: 100%;
  height: 30rem;
  min-height: 0;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 14px;
  background: Canvas;
  box-shadow: 0 30px 60px -36px rgb(0 0 0 / 0.55);
  font-size: 14px;
}

.bar {
  display: flex;
  flex: none;
  align-items: center;
  gap: 12px;
  height: 44px;
  padding: 0 8px 0 16px;
  border-bottom: 1px solid color-mix(in srgb, currentColor 8%, transparent);
}

.crumbs {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-size: 13.5px;
  white-space: nowrap;
}

.space,
.slash {
  opacity: 0.5;
}

.page {
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 550;
}

.status {
  margin-left: auto;
  font-size: 12.5px;
  white-space: nowrap;
  opacity: 0.6;
}

.meta {
  font-size: 12.5px;
  white-space: nowrap;
  opacity: 0.45;
  font-variant-numeric: tabular-nums;
}

.status:empty + .meta {
  margin-left: auto;
}

.tools {
  display: flex;
  gap: 2px;
}

.tools button {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 7px;
  background: none;
  color: inherit;
  cursor: pointer;
  transition:
    background-color 0.12s,
    opacity 0.12s;
}

.tools button:hover:not(:disabled) {
  background: color-mix(in srgb, currentColor 8%, transparent);
}

.tools button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.tools button:disabled {
  opacity: 0.3;
  cursor: default;
}

.tools svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.body {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 0;
}

.library {
  display: none;
  flex: none;
  flex-direction: column;
  width: 264px;
  overflow-y: auto;
  padding: 24px 12px;
  box-sizing: border-box;
  border-right: 1px solid color-mix(in srgb, currentColor 9%, transparent);
  background: color-mix(in srgb, currentColor 2.5%, Canvas);
}

.library ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.caption {
  margin: 0 8px 8px;
  font-size: 11.5px;
  font-weight: 600;
  opacity: 0.5;
}

.tip {
  margin: 14px 8px 0;
  font-size: 12px;
  line-height: 1.5;
  opacity: 0.5;
}

@container workspace (min-width: 1080px) {
  .library {
    display: flex;
  }
}

@container workspace (max-width: 560px) {
  .space,
  .slash,
  .meta {
    display: none;
  }

  .bar {
    padding-left: 12px;
  }
}
</style>
