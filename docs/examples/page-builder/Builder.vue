<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from 'vue';
import { useDnD, useDnDMonitor } from '@vue-dnd-kit/core';
import Canvas from './Canvas.vue';
import Icon from './Icon.vue';
import Layers from './Layers.vue';
import Palette from './Palette.vue';
import { DEVICES, useBuilder, type Device } from './builder';

const builder = useBuilder();
const { device, pageWidth, selected, canUndo, canRedo } = builder;

// Wide, both panels are docked, Add on the left and Layers on the right. Narrower, they
// share one panel with tabs; narrower still, that panel is a drawer over the canvas.
type Tab = 'add' | 'layers';
const tab = ref<Tab>('add');
const drawer = ref(false);
const toggleDrawer = (next: Tab) => {
  drawer.value = !(drawer.value && tab.value === next);
  tab.value = next;
};

// Every drop is a step of the history: when `onDragEnd` runs, the lists have written it.
useDnDMonitor({ onDragEnd: () => builder.commit() });

// A template or a chip picked up in the drawer: the drawer slides away (it stays mounted:
// the drag's source stays in the page), and the whole canvas shows where the drop goes.
const panel = useTemplateRef<HTMLElement>('panel');
const addPanel = useTemplateRef<HTMLElement>('addPanel');
const { active, status } = useDnD();
watch(active, (now) => {
  if (now && addPanel.value?.contains(now.element)) drawer.value = false;
});
const closeOutside = (event: PointerEvent) => {
  if (drawer.value && !panel.value?.contains(event.target as Node)) drawer.value = false;
};

const root = useTemplateRef<HTMLElement>('root');
/** Gives the focus to the page's control for a node (a section's grip, a block), or keeps it in the editor. */
const focusNode = async (id: string | null) => {
  await nextTick();
  const target = id ? root.value?.querySelector<HTMLElement>(`[data-focus="${id}"]`) : null;
  (target ?? root.value)?.focus();
};

/** The editor's shortcuts, while the focus is in it. A text being edited keeps its own keys. */
const onKeydown = (event: KeyboardEvent) => {
  if (event.defaultPrevented || (event.target as HTMLElement).isContentEditable) return;
  const command = event.ctrlKey || event.metaKey;
  const key = event.key.toLowerCase();
  if (command && (key === 'z' || key === 'y')) {
    event.preventDefault();
    if (key === 'y' || event.shiftKey) builder.redo();
    else builder.undo();
    return;
  }
  const id = selected.value;
  if (!id || status.value !== 'idle') return;
  if (command && key === 'd') {
    event.preventDefault();
    builder.duplicate(id);
    focusNode(selected.value);
  } else if (key === 'delete' || key === 'backspace') {
    event.preventDefault();
    builder.remove(id);
    focusNode(selected.value);
  } else if (key === 'escape') {
    // Handled here: an expanded docs frame stays open.
    event.preventDefault();
    builder.select(null);
  }
};
</script>

<template>
  <div ref="root" class="builder" :class="{ 'drawer-open': drawer }" tabindex="-1" @keydown="onKeydown">
    <header class="topbar">
      <div class="start">
        <div class="site">
          <span class="site-mark" aria-hidden="true" />
          <strong>Lumora</strong>
          <span class="site-page">Home</span>
        </div>
        <div class="drawer-toggles">
          <button type="button" :aria-pressed="drawer && tab === 'add'" aria-label="Add" @click="toggleDrawer('add')">
            <Icon name="plus" /><span>Add</span>
          </button>
          <button type="button" :aria-pressed="drawer && tab === 'layers'" aria-label="Layers" @click="toggleDrawer('layers')">
            <Icon name="layers" /><span>Layers</span>
          </button>
        </div>
      </div>

      <div class="devices" role="group" aria-label="Preview width">
        <button
          v-for="(info, key) in DEVICES"
          :key="key"
          type="button"
          :aria-pressed="device === key"
          :aria-label="info.name"
          :title="info.name"
          @click="device = key as Device"
        >
          <Icon :name="key" />
        </button>
        <span class="width">{{ Math.round(pageWidth) }} px</span>
      </div>

      <div class="history">
        <button type="button" :disabled="!canUndo" aria-label="Undo" title="Undo (Ctrl+Z)" @click="builder.undo()">
          <Icon name="undo" />
        </button>
        <button type="button" :disabled="!canRedo" aria-label="Redo" title="Redo (Ctrl+Shift+Z)" @click="builder.redo()">
          <Icon name="redo" />
        </button>
      </div>
    </header>

    <div class="workspace" @pointerdown="closeOutside">
      <aside ref="panel" class="panel" aria-label="Add and layers">
        <div class="tabs" role="tablist">
          <button type="button" role="tab" :aria-selected="tab === 'add'" @click="tab = 'add'">
            <Icon name="plus" /> Add
          </button>
          <button type="button" role="tab" :aria-selected="tab === 'layers'" @click="tab = 'layers'">
            <Icon name="layers" /> Layers
          </button>
          <button type="button" class="drawer-close" aria-label="Close the panel" @click="drawer = false">
            <Icon name="close" />
          </button>
        </div>
        <!-- Both stay mounted, hidden by CSS: wide editors show them side by side. -->
        <div ref="addPanel" class="tab-panel add" :class="{ active: tab === 'add' }" role="tabpanel" aria-label="Add">
          <Palette />
        </div>
        <div class="tab-panel layers" :class="{ active: tab === 'layers' }" role="tabpanel" aria-label="Layers">
          <Layers />
        </div>
      </aside>

      <Canvas />
    </div>
  </div>
</template>

<style scoped>
/*
 * 560px tall in the docs' frame. Expanded to the full screen, the frame's wrapper is a flex
 * column: `flex: 1` makes the editor fill it.
 */
.builder {
  container: builder / inline-size;
  display: flex;
  flex: 1;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 560px;
  min-height: 0;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, currentColor 13%, transparent);
  border-radius: 14px;
  background: Canvas;
  box-shadow: 0 28px 60px -36px rgb(0 0 0 / 0.55);
  font-size: 13px;
  text-align: left;
}

.builder:focus {
  outline: none;
}

button {
  color: inherit;
  font: inherit;
}

/* ─── Top bar ─────────────────────────────────────────────────────────────── */

.topbar {
  display: grid;
  flex: none;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 10px 0 14px;
  border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);
}

.start {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.site {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  white-space: nowrap;
}

.site-mark {
  flex: none;
  width: 22px;
  height: 22px;
  border-radius: 7px;
  background:
    radial-gradient(circle at 50% 50%, #fff 0 3px, transparent 3.5px),
    linear-gradient(135deg, #6366f1, #a855f7);
}

.site strong {
  font-weight: 650;
}

.site-page {
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.5;
}

.site-page::before {
  content: '/';
  margin-right: 8px;
  opacity: 0.6;
}

.drawer-toggles {
  display: none;
  gap: 4px;
}

.drawer-toggles button {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 10px;
  border: 0;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 6%, transparent);
  font-weight: 550;
  cursor: pointer;
}

.drawer-toggles button:first-child {
  background: #42b883;
  color: #fff;
}

.drawer-toggles button[aria-pressed='true'] {
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 35%, transparent);
}

.devices {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 6%, transparent);
}

.devices button,
.history button {
  display: grid;
  place-items: center;
  width: 30px;
  height: 26px;
  padding: 0;
  border: 0;
  border-radius: 7px;
  background: none;
  font-size: 15px;
  opacity: 0.55;
  cursor: pointer;
  transition:
    background-color 0.15s,
    opacity 0.15s,
    box-shadow 0.15s;
}

.devices button:hover,
.history button:not(:disabled):hover {
  opacity: 1;
}

.devices button[aria-pressed='true'] {
  background: Canvas;
  box-shadow:
    0 1px 2px rgb(0 0 0 / 0.18),
    0 0 0 1px color-mix(in srgb, currentColor 8%, transparent);
  opacity: 1;
}

.width {
  min-width: 52px;
  padding: 0 6px 0 4px;
  font: 500 11px/1 ui-monospace, Menlo, Consolas, monospace;
  text-align: right;
  opacity: 0.5;
}

.history {
  display: flex;
  justify-content: flex-end;
  gap: 2px;
}

.history button:hover:not(:disabled) {
  background: color-mix(in srgb, currentColor 8%, transparent);
}

.history button:disabled {
  opacity: 0.22;
  cursor: default;
}

.topbar button:focus-visible,
.tabs button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 1px;
}

/* ─── Panels and canvas ───────────────────────────────────────────────────── */

.workspace {
  position: relative;
  display: grid;
  flex: 1;
  grid-template-columns: 252px minmax(0, 1fr);
  min-height: 0;
}

.panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-right: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  background: color-mix(in srgb, currentColor 2.5%, Canvas);
}

.tabs {
  display: flex;
  flex: none;
  gap: 2px;
  margin: 10px 10px 4px;
  padding: 3px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 6%, transparent);
}

.tabs [role='tab'] {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 28px;
  border: 0;
  border-radius: 7px;
  background: none;
  font-weight: 550;
  opacity: 0.6;
  cursor: pointer;
}

.tabs [role='tab']:hover {
  opacity: 1;
}

.tabs [role='tab'][aria-selected='true'] {
  background: Canvas;
  box-shadow:
    0 1px 2px rgb(0 0 0 / 0.18),
    0 0 0 1px color-mix(in srgb, currentColor 8%, transparent);
  opacity: 1;
}

.drawer-close {
  display: none;
}

.tab-panel {
  display: none;
  flex: 1;
  min-height: 0;
}

.tab-panel.active {
  display: block;
}

/* Wide (a full screen): Add docked on the left, Layers on the right, no tabs. */
@container builder (min-width: 1180px) {
  .workspace {
    grid-template-columns: 264px minmax(0, 1fr) 280px;
  }

  .panel {
    display: contents;
  }

  .tabs {
    display: none;
  }

  .tab-panel {
    display: block;
    grid-row: 1;
    min-height: 0;
    background: color-mix(in srgb, currentColor 2.5%, Canvas);
  }

  .tab-panel.add {
    grid-column: 1;
    border-right: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  }

  .tab-panel.layers {
    grid-column: 3;
    border-left: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  }

  .canvas {
    grid-row: 1;
    grid-column: 2;
  }
}

/*
 * Narrow (the docs' frame, a phone): the page takes the whole width, as wide as a desktop
 * page can be there. The panel is a drawer, opened from the top bar.
 */
@container builder (max-width: 899px) {
  .site strong,
  .site-page {
    display: none;
  }

  .drawer-toggles {
    display: flex;
  }

  .workspace {
    grid-template-columns: minmax(0, 1fr);
  }

  .panel {
    position: absolute;
    inset: 0 auto 0 0;
    z-index: 10;
    width: min(280px, 84%);
    border-right: 1px solid color-mix(in srgb, currentColor 12%, transparent);
    background: Canvas;
    box-shadow: 18px 0 40px -20px rgb(0 0 0 / 0.5);
    translate: calc(-100% - 24px) 0;
    visibility: hidden;
    transition:
      translate 0.28s cubic-bezier(0.2, 0.8, 0.2, 1),
      visibility 0s 0.28s;
  }

  .drawer-open .panel {
    translate: 0 0;
    visibility: visible;
    transition: translate 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .drawer-close {
    display: grid;
    flex: none;
    place-items: center;
    width: 30px;
    border: 0;
    border-radius: 7px;
    background: none;
    font-size: 15px;
    opacity: 0.6;
    cursor: pointer;
  }
}

/* A phone: icons only. */
@container builder (max-width: 560px) {
  .topbar {
    gap: 6px;
    padding: 0 6px 0 10px;
  }

  .site,
  .width,
  .drawer-toggles span {
    display: none;
  }

  .drawer-toggles button {
    padding: 0 9px;
    font-size: 15px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .panel,
  .drawer-open .panel {
    transition: none;
  }
}
</style>
