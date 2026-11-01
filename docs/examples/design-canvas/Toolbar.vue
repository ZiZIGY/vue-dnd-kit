<script setup lang="ts">
import { inject } from 'vue';
import InsertTool from './InsertTool.vue';
import ToolButton from './ToolButton.vue';
import type { LayerKind } from './design';
import { EDITOR, MOD } from './editor';

defineProps<{ panelsOpen: boolean }>();
defineEmits<{ togglePanels: [] }>();

const editor = inject(EDITOR)!;
const { tool, canUndo, canRedo } = editor;

const INSERTS: { kind: LayerKind; shortcut: string }[] = [
  { kind: 'frame', shortcut: 'F' },
  { kind: 'rect', shortcut: 'R' },
  { kind: 'ellipse', shortcut: 'O' },
  { kind: 'text', shortcut: 'T' },
  { kind: 'image', shortcut: 'I' },
];
</script>

<template>
  <div class="toolbar">
    <!-- On a phone the hand is the only way to pan: it toggles, and the move tool steps aside. -->
    <div class="group">
      <ToolButton class="move-tool" icon="move" label="Move" shortcut="V" :pressed="tool === 'move'" @click="tool = 'move'" />
      <ToolButton
        icon="hand"
        label="Hand"
        shortcut="H · Space"
        :pressed="tool === 'hand'"
        @click="tool = tool === 'hand' ? 'move' : 'hand'"
      />
    </div>
    <span class="divider" />
    <div class="group" role="group" aria-label="Add a layer">
      <InsertTool v-for="insert in INSERTS" :key="insert.kind" :kind="insert.kind" :shortcut="insert.shortcut" />
    </div>
    <span class="spacer" />
    <div class="group">
      <ToolButton icon="undo" label="Undo" :shortcut="`${MOD} Z`" :disabled="!canUndo" @click="editor.undo()" />
      <ToolButton icon="redo" label="Redo" :shortcut="`${MOD} Shift Z`" :disabled="!canRedo" @click="editor.redo()" />
    </div>
    <div class="group panels-toggle">
      <ToolButton icon="panels" label="Layers and design" :pressed="panelsOpen" :aria-expanded="panelsOpen" @click="$emit('togglePanels')" />
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 44px;
  padding: 0 8px;
  border-bottom: 1px solid var(--dc-line);
  background: var(--dc-panel);
}

.group {
  display: flex;
  align-items: center;
  gap: 1px;
}

.divider {
  flex: none;
  width: 1px;
  height: 18px;
  background: var(--dc-line);
}

.spacer {
  flex: 1;
}

/* The panels open as a drawer only where they don't fit next to the canvas. */
.panels-toggle {
  display: none;
}

@container editor (max-width: 599px) {
  .toolbar {
    gap: 2px;
    padding: 0 4px;
  }

  .move-tool,
  .divider {
    display: none;
  }

  .panels-toggle {
    display: flex;
  }
}
</style>
