<script setup lang="ts">
  import { useDnDProvider } from '@vue-dnd-kit/core';
  import { makeSnappedOverlayStyle } from '../../../packages/utilities/src';

  const { entities, state, overlay } = useDnDProvider();

  const coords = makeSnappedOverlayStyle(overlay.style, {
    gridY: 20,
    gridX: 20,
  });
</script>

<template>
  <div
    v-if="state === 'dragging'"
    class="dnd-kit-default-overlay"
    :style="{
      '--position-x': coords.x + 'px',
      '--position-y': coords.y + 'px',
    }"
  >
    <template v-for="[node, draggable] in entities.draggingMap">
      <component
        v-if="entities.draggableMap.get(node)?.render"
        :is="entities.draggableMap.get(node)?.render"
      />
      <component
        v-else
        :is="node.tagName"
        v-html="draggable.initialOuterHTML"
        :style="{
          width: draggable.initialRect.width + 'px',
          height: draggable.initialRect.height + 'px',
        }"
      />
    </template>
  </div>
</template>

<style>
  .dnd-kit-default-overlay {
    transform: translate3d(var(--position-x), var(--position-y), 0px);
  }
</style>
