<script setup lang="ts">
import { provide, ref } from 'vue';
import { useEventListener } from '@vueuse/core';
import { useDnD } from '@vue-dnd-kit/core';
import Canvas from './Canvas.vue';
import Inspector from './Inspector.vue';
import LayersPanel from './LayersPanel.vue';
import Toolbar from './Toolbar.vue';
import type { LayerKind } from './design';
import { EDITOR, createEditor } from './editor';

// The editor works with the provider's selection: what clicks and bands select is what a
// drag moves.
const { selection, status } = useDnD();
const editor = createEditor(selection);
provide(EDITOR, editor);

/** Where both panels don't fit next to the canvas, they share a column with tabs; on a phone, a drawer. */
const tab = ref<'layers' | 'design'>('layers');
const drawer = ref(false);

const INSERTS: Record<string, LayerKind> = { f: 'frame', r: 'rect', o: 'ellipse', t: 'text', i: 'image' };
const ARROWS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

const typing = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

// Shortcuts, while the focus is in the editor. A keyboard drag takes its keys (Enter, the
// arrows, Escape) before they get here.
const keydown = (event: KeyboardEvent) => {
  if (typing(event.target) || status.value === 'dragging') return;
  const mod = event.ctrlKey || event.metaKey;
  const key = event.key.toLowerCase();
  const run = (action: () => void) => {
    event.preventDefault();
    action();
  };

  // Space is the hand for as long as it is held; on a button it stays a click.
  if (key === ' ') {
    if (!(event.target as Element).closest('button')) run(() => (editor.spaceHeld.value = true));
  } else if (mod) {
    if (key === 'z') run(event.shiftKey ? editor.redo : editor.undo);
    else if (key === 'y') run(editor.redo);
    else if (key === 'd') run(editor.duplicate);
    else if (key === 'a') run(editor.selectAll);
    else if (key === '=' || key === '+') run(() => editor.zoomBy(1.25));
    else if (key === '-') run(() => editor.zoomBy(1 / 1.25));
    else if (key === '0') run(() => editor.zoomBy(1 / editor.view.zoom));
  } else if (event.altKey) {
    return;
  } else if (ARROWS[event.key] && editor.selected.value.length) {
    const [x, y] = ARROWS[event.key]!;
    const step = event.shiftKey ? 10 : 1;
    run(() => editor.nudge(x * step, y * step));
  } else if (event.shiftKey && event.code === 'Digit1') {
    run(editor.fit);
  } else if (key === 'delete' || key === 'backspace') {
    run(editor.remove);
  } else if (key === 'escape' && (drawer.value || selection.ids.size)) {
    // Handled here, so the page around (a dialog, a full-screen view) doesn't close as well.
    run(() => (drawer.value ? (drawer.value = false) : selection.clear()));
  } else if (key === 'v' || key === 'h') {
    run(() => (editor.tool.value = key === 'v' ? 'move' : 'hand'));
  } else if (INSERTS[key]) {
    run(() => editor.add(INSERTS[key]!, editor.center()));
  }
};

useEventListener(window, 'keyup', (event: KeyboardEvent) => {
  if (event.key === ' ') editor.spaceHeld.value = false;
});
useEventListener(window, 'blur', () => (editor.spaceHeld.value = false));
</script>

<template>
  <div class="editor" @keydown="keydown">
    <Toolbar :panels-open="drawer" @toggle-panels="drawer = !drawer" />
    <div class="workspace">
      <Canvas class="canvas-area" />
      <div class="sidebar" :class="{ open: drawer }">
        <div class="tabs" role="group" aria-label="Panels">
          <button type="button" :aria-pressed="tab === 'layers'" @click="tab = 'layers'">Layers</button>
          <button type="button" :aria-pressed="tab === 'design'" @click="tab = 'design'">Design</button>
        </div>
        <LayersPanel class="panel layers-panel" :class="{ current: tab === 'layers' }" />
        <Inspector class="panel design-panel" :class="{ current: tab === 'design' }" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
 * A design tool's chrome is neutral grey with one blue, light or dark with the page: every
 * colour is mixed from the text colour and `Canvas`. The design itself keeps its own colours.
 */
.editor {
  --dc-accent: #0d99ff;
  --dc-panel: color-mix(in srgb, currentColor 3%, Canvas);
  --dc-canvas: color-mix(in srgb, currentColor 8%, Canvas);
  --dc-dots: color-mix(in srgb, currentColor 18%, transparent);
  --dc-line: color-mix(in srgb, currentColor 11%, transparent);
  --dc-hover: color-mix(in srgb, currentColor 8%, transparent);
  --dc-field: color-mix(in srgb, currentColor 5%, transparent);
  --dc-muted: color-mix(in srgb, currentColor 58%, transparent);

  container: editor / inline-size;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  /* Its height on the page; in a full-screen frame it takes all the room there is. */
  height: 31rem;
  flex: 1;
  min-height: 0;
  overflow: clip;
  border: 1px solid var(--dc-line);
  border-radius: 12px;
  background: var(--dc-panel);
  box-shadow: 0 24px 60px -32px rgb(0 0 0 / 0.45);
  font-size: 12px;
  line-height: 1.4;
}

.workspace {
  position: relative;
  display: grid;
  flex: 1;
  grid-template-rows: minmax(0, 1fr);
  grid-template-columns: minmax(0, 1fr);
  min-height: 0;
}

.canvas-area {
  grid-area: 1 / 1;
}

/* A phone: the panels are a drawer over the canvas, opened from the toolbar. */
.sidebar {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  width: min(272px, 88%);
  border-left: 1px solid var(--dc-line);
  background: var(--dc-panel);
  box-shadow: -18px 0 40px -24px rgb(0 0 0 / 0.5);
  visibility: hidden;
  transform: translateX(100%);
  transition:
    transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1),
    visibility 0.22s;
}

.sidebar.open {
  visibility: visible;
  transform: none;
}

.tabs {
  display: flex;
  flex: none;
  gap: 2px;
  margin: 8px 8px 0;
  padding: 2px;
  border-radius: 8px;
  background: var(--dc-field);
}

.tabs button {
  flex: 1;
  height: 26px;
  border: 0;
  border-radius: 6px;
  background: none;
  color: var(--dc-muted);
  font: inherit;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.15s,
    color 0.15s;
}

.tabs button:hover {
  color: inherit;
}

.tabs button[aria-pressed='true'] {
  background: Canvas;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.12);
  color: inherit;
}

.tabs button:focus-visible {
  outline: 2px solid var(--dc-accent);
}

.sidebar > .panel {
  flex: 1;
}

.sidebar > .panel:not(.current) {
  display: none;
}

/* A docs page: the canvas, and the two panels in one column with tabs. */
@container editor (min-width: 600px) {
  .workspace {
    grid-template-columns: minmax(0, 1fr) 236px;
  }

  .sidebar {
    position: static;
    grid-area: 1 / 2;
    width: auto;
    box-shadow: none;
    visibility: visible;
    transform: none;
    transition: none;
  }
}

/* Room for everything: layers on the left, properties on the right, as in Figma. */
@container editor (min-width: 960px) {
  .workspace {
    grid-template-columns: 248px minmax(0, 1fr) 264px;
  }

  .canvas-area {
    grid-area: 1 / 2;
  }

  .sidebar {
    display: contents;
  }

  .tabs {
    display: none;
  }

  .sidebar > .panel:not(.current) {
    display: flex;
  }

  .layers-panel {
    grid-area: 1 / 1;
    border-right: 1px solid var(--dc-line);
  }

  .design-panel {
    grid-area: 1 / 3;
    border-left: 1px solid var(--dc-line);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sidebar,
  .tabs button {
    transition: none;
  }
}
</style>
