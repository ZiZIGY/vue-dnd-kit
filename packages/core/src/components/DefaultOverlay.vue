<script setup lang="ts">
import { useDnDProvider } from '../composables/useDnDProvider';

  const { entities, state, overlayStyle } = useDnDProvider();
</script>

<template>
  <Transition>
    <div v-if="state === 'dragging'" class="dnd-kit-default-overlay" :style="overlayStyle">
      <template v-for="[node, draggable] in entities.draggingMap">
        <component
          v-if="entities.draggableMap.get(node)?.render"
          :is="entities.draggableMap.get(node)?.render"
        />
        <component
          v-else
          :is="node.tagName"
          v-html="draggable.initialHTML"
          :style="{
            width: draggable.initialRect.width + 'px',
            height: draggable.initialRect.height + 'px'
          }"
        />
      </template>
    </div>
  </Transition>
</template>
