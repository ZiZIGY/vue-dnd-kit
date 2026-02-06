<script setup lang="ts">
  import { useDnDProvider } from '../composables/useDnDProvider';

  const { entities, state, overlayStyle } = useDnDProvider();
</script>

<template>
  <div v-show="state === 'dragging'" class="dnd-kit-default-overlay" :style="{
    '--position-x': overlayStyle.x + 'px',
    '--position-y': overlayStyle.y + 'px'
  }">
    <template v-for="[node, draggable] in entities.draggingMap">
      <component
        v-if="entities.draggableMap.get(node)?.render"
        :is="entities.draggableMap.get(node)?.render"
        class="test"
      />
      <component
        v-else
        :is="node.tagName"
        v-html="draggable.initialHTML"
        class="test"
        :style="{
          width: draggable.initialRect.width + 'px',
          height: draggable.initialRect.height + 'px'
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
