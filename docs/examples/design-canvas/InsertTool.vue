<script setup lang="ts">
import { inject, useTemplateRef } from 'vue';
import { makeDraggable, snapCenterToCursor } from '@vue-dnd-kit/core';
import ToolButton from './ToolButton.vue';
import ToolGhost from './ToolGhost.vue';
import { KINDS, type LayerKind } from './design';
import { EDITOR } from './editor';
import type { ToolData } from './useLayerDrop';

const props = defineProps<{ kind: LayerKind; shortcut: string }>();
const editor = inject(EDITOR)!;

// A tool is a plain draggable: dropped on the canvas or into a frame, it adds its layer
// there (`useLayerDrop`). Its overlay is the layer's outline, centred on the pointer. With
// the keyboard, Enter picks it up and the arrows jump to the canvas and the frames.
const button = useTemplateRef<InstanceType<typeof ToolButton>>('button');
const { isDragging } = makeDraggable(button, {
  id: `tool-${props.kind}`,
  type: props.kind === 'frame' ? 'frame' : 'layer',
  data: (): ToolData => ({ tool: props.kind, zoom: editor.view.zoom }),
  overlay: ToolGhost,
  modifiers: [snapCenterToCursor],
  keyboardMode: 'droppables',
});

// A click adds the layer in the middle of the view.
const add = () => editor.add(props.kind, editor.center());
</script>

<template>
  <ToolButton
    ref="button"
    :icon="kind"
    :label="`${KINDS[kind].name}: drag onto the canvas or click`"
    :shortcut="shortcut"
    :class="{ lifted: isDragging }"
    @click="add"
  />
</template>

<style scoped>
.lifted {
  opacity: 0.4;
}
</style>
