<script setup lang="ts">
import { computed, inject, onMounted, useTemplateRef } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';
import { KINDS, KIND_LIST, type Block, type BlockKind } from './blocks';
import { EDITOR } from './editor';

/** The menu of a handle: for the selected blocks, or the clicked one. Turn into, duplicate, delete. */
const emit = defineEmits<{ close: [] }>();
const editor = inject(EDITOR)!;
const { selection } = useDnD();

const ids = computed(() => [...selection.ids].map(String));
const blocks = computed(() => ids.value.map(editor.get).filter((block): block is Block => !!block));
const TURNS = KIND_LIST.filter((kind) => !KINDS[kind].fixed);
const turnable = computed(() => blocks.value.some((block) => !KINDS[block.kind].fixed));
const current = computed(() => (new Set(blocks.value.map((block) => block.kind)).size === 1 ? blocks.value[0]!.kind : null));
const heading = computed(() => (blocks.value.length > 1 ? `${blocks.value.length} blocks` : KINDS[blocks.value[0]?.kind ?? 'text'].name));

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);

const turn = (kind: BlockKind) => {
  editor.turnInto(ids.value, kind);
  emit('close');
};

const duplicate = () => {
  const copies = editor.duplicate(ids.value);
  selection.set(copies);
  emit('close');
  editor.focusHandle(copies[0]!);
};

const remove = () => {
  editor.remove(ids.value);
  selection.clear();
  emit('close');
};

// A menu: the arrows go through its items, Escape closes it and gives the focus back.
const menu = useTemplateRef<HTMLElement>('menu');
const items = () => [...(menu.value?.querySelectorAll<HTMLElement>('[role^="menuitem"]') ?? [])];
onMounted(() => (items().find((item) => item.getAttribute('aria-checked') === 'true') ?? items()[0])?.focus());

const STEPS: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
const onKeydown = (event: KeyboardEvent) => {
  event.stopPropagation(); // the page's shortcuts (Delete, arrows) stay out of the menu
  const all = items();
  const step = STEPS[event.key];
  if (step) {
    event.preventDefault();
    const at = all.indexOf(document.activeElement as HTMLElement);
    all[(at + step + all.length) % all.length]?.focus();
  } else if (event.key === 'Escape') {
    event.preventDefault();
    emit('close');
    editor.focusHandle(ids.value[0]!);
  }
};
</script>

<template>
  <div ref="menu" class="menu" role="menu" :aria-label="`${heading} options`" @keydown="onKeydown">
    <p class="section">{{ heading }}</p>
    <template v-if="turnable">
      <p class="caption">Turn into</p>
      <div class="kinds">
        <button
          v-for="kind in TURNS"
          :key="kind"
          type="button"
          class="kind"
          role="menuitemradio"
          tabindex="-1"
          :aria-checked="kind === current"
          :aria-label="KINDS[kind].name"
          :title="KINDS[kind].name"
          @click="turn(kind)"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="KINDS[kind].icon" /></svg>
        </button>
      </div>
      <hr />
    </template>
    <button type="button" class="action" role="menuitem" tabindex="-1" @click="duplicate">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 9h10v10H9zM5 15V5h10" /></svg>
      Duplicate
      <kbd>{{ isMac ? '⌘' : 'Ctrl+' }}D</kbd>
    </button>
    <button type="button" class="action danger" role="menuitem" tabindex="-1" @click="remove">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3" /></svg>
      Delete
      <kbd>Del</kbd>
    </button>
  </div>
</template>

<style scoped>
.menu {
  display: flex;
  flex-direction: column;
  width: 236px;
  padding: 6px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 10px;
  background: Canvas;
  box-shadow:
    0 18px 40px -16px rgb(0 0 0 / 0.4),
    0 2px 6px -2px rgb(0 0 0 / 0.12);
  animation: pop 0.14s cubic-bezier(0.2, 0, 0, 1);
}

@keyframes pop {
  from {
    opacity: 0;
    translate: 0 -4px;
    scale: 0.98;
  }
}

.section,
.caption {
  margin: 4px 8px 6px;
  font-size: 11.5px;
  font-weight: 600;
  opacity: 0.5;
}

.section {
  margin-bottom: 2px;
  font-size: 12.5px;
  opacity: 0.85;
}

.kinds {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 2px;
  padding: 0 2px;
}

.kind {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: none;
  color: inherit;
  cursor: pointer;
}

.kind[aria-checked='true'] {
  background: color-mix(in srgb, #42b883 18%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, #42b883 55%, transparent);
}

.kind:hover,
.kind:focus-visible,
.action:hover,
.action:focus-visible {
  background: color-mix(in srgb, currentColor 8%, transparent);
  outline: none;
}

.kind:focus-visible,
.action:focus-visible {
  box-shadow: inset 0 0 0 2px #42b883;
}

svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

hr {
  margin: 6px 4px;
  border: 0;
  border-top: 1px solid color-mix(in srgb, currentColor 10%, transparent);
}

.action {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border: 0;
  border-radius: 6px;
  background: none;
  color: inherit;
  font: inherit;
  font-size: 13.5px;
  text-align: left;
  cursor: pointer;
}

.action kbd {
  margin-left: auto;
  font: 11.5px/1 ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  opacity: 0.45;
}

.danger:hover,
.danger:focus-visible {
  background: color-mix(in srgb, #ef4444 12%, transparent);
  color: light-dark(#dc2626, #f87171);
}

@media (prefers-reduced-motion: reduce) {
  .menu {
    animation: none;
  }
}
</style>
