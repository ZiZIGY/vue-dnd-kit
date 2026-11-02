<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';
import { makeSelectionArea, makeSortableTree, useDnD, useDnDMonitor, type Key } from '@vue-dnd-kit/core';
import BlockGhost from './BlockGhost.vue';
import BlockMenu from './BlockMenu.vue';
import BlockRow from './BlockRow.vue';
import Editable from './Editable.vue';
import InsertMenu from './InsertMenu.vue';
import { KINDS, copyBlock, createBlock, type BlockKind } from './blocks';
import { caretOnEdgeLine } from './caret';
import { EDITOR, MAX_DEPTH } from './editor';

const editor = inject(EDITOR)!;
const { menu } = editor;
const { selection } = useDnD();

const INDENT = 24;
const scroller = useTemplateRef<HTMLElement>('scroller');
const sheet = useTemplateRef<HTMLElement>('sheet');
const root = useTemplateRef<HTMLElement>('root');

// The page is a tree: the blocks nested in a block are its children, one level in.
// `placeholder: 'indicator'`: nothing moves while you drag, a line shows where the blocks
// go and at which level. Dragging sideways changes the level (`nesting: 'offset'`), as far
// as the block above takes nested blocks. The whole sheet takes drops, below the last block too.
const { items } = makeSortableTree(root, {
  id: 'page',
  items: editor.blocks,
  group: 'blocks',
  placeholder: 'indicator',
  nesting: 'offset',
  indentation: INDENT,
  maxDepth: MAX_DEPTH,
  canNest: (_block, parent) => !!KINDS[parent.kind].nests,
  collapsed: editor.collapsed,
  // Alt-drag copies a block, with what is nested in it.
  clone: copyBlock,
  // A kind dragged from the menu or the sidebar becomes a new block, where the line is.
  createItem: (active) => createBlock((active.data as { kind: BlockKind }).kind),
  // Changes no drag made (Enter, Tab, Delete, Undo) slide and fade too.
  animateChanges: true,
  overOverlay: BlockGhost,
  dropzone: sheet,
  onDrop: (event) => {
    editor.record(); // the library writes the drop after this: Undo takes it back
    // A new block takes the caret. A moved one keeps the focus on its handle, so the
    // shortcuts (Undo, Delete) go on working: moving its row in the page would drop it.
    const first = event.items[0]!.id;
    if (event.mode === 'insert') editor.focus(first, 'start');
    else editor.focusHandle(first);
  },
});

// A numbered item counts the numbered items right above it, at its level.
const numbers = computed(() => {
  const numbers = new Map<Key, number>();
  const previous = new Map<Key | null, Key>(); // the last block seen under each parent
  for (const { key, item, parentKey } of items.value) {
    const before = previous.get(parentKey);
    if (item.kind === 'numbered') numbers.set(key, (before === undefined ? 0 : (numbers.get(before) ?? 0)) + 1);
    previous.set(parentKey, key);
  }
  return numbers;
});

// A box drawn from the margins selects the blocks it touches, and a click there clears the
// selection (`'select'`). It picks blocks only, not the options of the menu.
const { isSelecting, style } = makeSelectionArea(scroller, {
  strategy: 'select',
  accept: 'blocks',
  disabled: () => menu.value !== null, // a press closes the menu first
});

// A handle's click selects its block and opens its menu; Shift-click selects every block
// from the last clicked one, Ctrl/Cmd-click adds or removes one. Selected blocks drag together.
let anchor: string | null = null;
const pick = (id: string, event: MouseEvent) => {
  const ids = editor.visibleIds();
  if (event.shiftKey && anchor && ids.includes(anchor)) {
    const [from, to] = [ids.indexOf(anchor), ids.indexOf(id)].sort((a, b) => a - b);
    return selection.set(ids.slice(from, to! + 1));
  }
  anchor = id;
  if (event.ctrlKey || event.metaKey) return selection.toggle(id);
  if (!selection.has(id)) selection.set([id]);
  menu.value = { type: 'block', id };
};

const addAtEnd = () => {
  const last = editor.blocks.value.at(-1);
  if (last?.kind === 'text' && !last.text && !last.children.length) return editor.focus(last.id);
  editor.insertAfter(null, createBlock('text'));
};

const onTitleKeydown = (event: KeyboardEvent) => {
  const first = editor.blocks.value[0];
  if (event.key === 'Enter') {
    event.preventDefault();
    if (first) editor.focus(first.id, 'start');
    else addAtEnd();
  } else if (event.key === 'ArrowDown' && caretOnEdgeLine(event.currentTarget as HTMLElement, 1)) {
    event.preventDefault();
    editor.focusNext(event.currentTarget as HTMLElement, 1, 'start');
  }
};

// ─── Menus ─────────────────────────────────────────────────────────────────────

/** "/" menu: what was typed after the slash; `null` once the slash is gone. */
const typed = computed(() => {
  const open = menu.value;
  if (open?.type !== 'command') return undefined;
  const text = editor.get(open.id)?.text ?? '';
  return text[open.at] === '/' ? text.slice(open.at + 1) : null;
});
watch(typed, (value) => {
  if (value === null || value?.includes('\n')) menu.value = null;
});

const pickKind = (kind: BlockKind) => {
  const open = menu.value!;
  const command = `/${typed.value ?? ''}`;
  menu.value = null;
  if (open.type === 'command') editor.command(open.id, open.at, open.at + command.length, kind);
  else editor.insertAfter(open.id, createBlock(kind));
};

const closeInsert = () => {
  const open = menu.value;
  menu.value = null;
  if (open?.type === 'insert') editor.focus(open.id);
};

// Opened below the block ("+", "/") or its handle, and kept inside the sheet.
const popover = useTemplateRef<HTMLElement>('popover');
const place = ref<{ top: number; left: number } | null>(null);
watch(menu, async (open) => {
  place.value = null;
  if (!open) return;
  await nextTick();
  const row = sheet.value?.querySelector<HTMLElement>(`[data-row="${open.id}"]`);
  if (!row || !sheet.value) return (menu.value = null);
  const below = (open.type === 'block' ? row.querySelector('.handle')! : row).getBoundingClientRect();
  const box = sheet.value.getBoundingClientRect();
  place.value = { top: below.bottom - box.top + 6, left: below.left - box.left };
  await nextTick();
  if (!popover.value) return;
  place.value.left = Math.max(8, Math.min(place.value.left, box.width - popover.value.offsetWidth - 8));
  popover.value.scrollIntoView({ block: 'nearest' });
});

// In the "/" menu the caret stays in the block: the menu takes the keys it uses first.
const insertMenu = useTemplateRef<InstanceType<typeof InsertMenu>>('insertMenu');
const onKeydownCapture = (event: KeyboardEvent) => {
  if (menu.value?.type === 'command' && insertMenu.value?.key(event)) event.stopPropagation();
};

// A press anywhere else closes the menu.
const onPressOutside = (event: PointerEvent) => {
  if (menu.value && !popover.value?.contains(event.target as Node)) menu.value = null;
};
onMounted(() => window.addEventListener('pointerdown', onPressOutside, true));
onBeforeUnmount(() => window.removeEventListener('pointerdown', onPressOutside, true));

// A block dragged out of the menu of new blocks: the menu hides while it travels, so the
// page shows where it goes, and closes once it has landed.
const lifted = ref(false);
useDnDMonitor({
  onDragStart: ({ active }) => (lifted.value = !!popover.value?.contains(active.element)),
  onDragSettle: () => {
    if (!lifted.value) return;
    lifted.value = false;
    menu.value = null;
  },
});
</script>

<template>
  <div ref="scroller" class="scroller" @keydown.capture="onKeydownCapture">
    <div ref="sheet" class="sheet">
      <div class="emoji" aria-hidden="true">🚀</div>
      <Editable
        v-model="editor.title.value"
        tag="h1"
        class="title"
        placeholder="Untitled"
        data-text="title"
        aria-label="Page title"
        @beforeinput="editor.recordTyping('title')"
        @keydown="onTitleKeydown"
      />

      <div ref="root" class="blocks">
        <BlockRow
          v-for="node in items"
          :key="node.key"
          :node="node"
          :indent="INDENT"
          :number="numbers.get(node.key) ?? 0"
          @pick="pick(String(node.key), $event)"
        />
      </div>

      <!-- Below the last block: a click starts a new line, and drops land at the end. A
           button, so a press on it never draws a selection box. -->
      <button type="button" class="tail" aria-label="Add a block at the end" @click="addAtEnd">
        <span v-if="!items.length" class="empty">An empty page. Click to start writing, or drop a block here.</span>
      </button>

      <div
        v-if="menu && place"
        ref="popover"
        class="popover"
        :class="{ lifted }"
        :style="{ top: `${place.top}px`, left: `${place.left}px` }"
      >
        <BlockMenu v-if="menu.type === 'block'" @close="menu = null" />
        <InsertMenu v-else ref="insertMenu" :typed="typed ?? undefined" @pick="pickKind" @close="closeInsert" />
      </div>
    </div>
    <div v-if="isSelecting" class="band" :style="style" />
  </div>
</template>

<style scoped>
/* The area that draws the selection box: it needs a position, the box is placed in it. */
.scroller {
  position: relative;
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* The page column: readable width, the handles in its left margin. */
.sheet {
  container-type: inline-size;
  position: relative;
  box-sizing: border-box;
  max-width: 780px;
  margin: 0 auto;
  padding: 32px 48px 0 76px;
}

.emoji {
  font-size: 36px;
  line-height: 1;
}

.title {
  margin: 12px 0 10px 2px;
  font-size: 34px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.03em;
}

.blocks {
  position: relative;
}

.tail {
  display: flex;
  align-items: flex-start;
  width: 100%;
  min-height: 120px;
  padding: 6px 2px;
  border: 0;
  border-radius: 6px;
  background: none;
  color: inherit;
  font: inherit;
  font-size: 15px;
  text-align: left;
  cursor: text;
}

.tail:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.empty {
  opacity: 0.45;
}

.popover {
  position: absolute;
  z-index: 5;
  transition: opacity 0.15s;
}

.popover.lifted {
  opacity: 0;
  pointer-events: none;
}

.band {
  border: 1px solid #42b883;
  border-radius: 3px;
  background: color-mix(in srgb, #42b883 14%, transparent);
}

@container workspace (max-width: 560px) {
  .sheet {
    padding: 24px 16px 0 50px;
  }

  .emoji {
    font-size: 32px;
  }

  .title {
    font-size: 27px;
  }
}
</style>
