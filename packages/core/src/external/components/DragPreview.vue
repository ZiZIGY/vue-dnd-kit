<script setup lang="ts">
  import { useTemplateRef, watch } from 'vue';
  import { useDnDProvider } from '../composables/useDnDProvider';

  const { state, entities, preview } = useDnDProvider();

  const contentRef = useTemplateRef('contentRef');

  watch(
    () => contentRef.value,
    () => {
      const rect = contentRef.value?.getBoundingClientRect();
      if (rect) preview.size.value = rect;
    }
  );
</script>

<template>
  <div
    v-if="state === 'dragging'"
    class="dnd-kit-preview"
    ref="contentRef"
    :style="{
      transform: `translate3d(${preview.position.value.x}px, ${preview.position.value.y}px, 0)`,
    }"
  >
    <slot :dragging-map="entities.draggingMap">
      <template
        v-for="[node, draggable] in entities.draggingMap"
        :key="node"
      >
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
    </slot>
  </div>
</template>

<style>
  .dnd-kit-preview {
    transform-origin: 0 0;
    will-change: transform;
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
</style>
