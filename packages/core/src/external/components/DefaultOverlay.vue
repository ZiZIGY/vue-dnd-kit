<script setup lang="ts">
  import { useDnDProvider } from '../composables/useDnDProvider';

  const { entities, state, overlay } = useDnDProvider();
</script>

<template>
  <div
    v-if="state === 'dragging'"
    class="dnd-kit-default-overlay"
    :style="{
      '--position-x': overlay.position.value.x + 'px',
      '--position-y': overlay.position.value.y + 'px',
    }"
  >
    <template v-for="[node, draggable] in entities.draggingMap">
      <component
        v-if="draggable.render"
        :is="draggable.render"
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
