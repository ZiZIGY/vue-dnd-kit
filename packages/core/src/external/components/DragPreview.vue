<script setup lang="ts">
  import { computed, useTemplateRef, watch } from 'vue';
  import { useDnDProvider } from '../composables/useDnDProvider';

  const { grid } = defineProps<{
    /** Snap overlay to a grid. Pass a number for a uniform grid or { x, y } for per-axis control. */
    grid?: number | { x: number; y: number };
  }>();

  const { state, entities, preview } = useDnDProvider();

  const contentRef = useTemplateRef('contentRef');

  watch(
    () => contentRef.value,
    () => {
      const rect = contentRef.value?.getBoundingClientRect();
      if (rect) preview.size.value = rect;
    }
  );

  const snap = (value: number, step?: number) => {
    if (!step || step <= 0) return value;
    return Math.round(value / step) * step;
  };

  const position = computed(() => {
    const { x, y } = preview.position.value;
    const stepX = typeof grid === 'object' ? grid.x : grid;
    const stepY = typeof grid === 'object' ? grid.y : grid;
    return { x: snap(x, stepX), y: snap(y, stepY) };
  });
</script>

<template>
  <div
    v-if="state === 'dragging'"
    class="dnd-kit-preview"
    ref="contentRef"
    :style="{
      transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
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
  }
</style>
