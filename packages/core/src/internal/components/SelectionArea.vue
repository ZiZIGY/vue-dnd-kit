<script setup lang="ts">
  import { makeBoundingBox, makeDroppable } from '../../external';
  import { makeSelectableArea } from '../../external/composables/makeSelectableArea';
  import { useTemplateRef } from 'vue';

  const props = defineProps<{
    groups?: string[];
    modifier?: { keys: string[]; method: 'every' | 'some' };
  }>();

  const node = useTemplateRef('node');

  const { isSelecting, style } = makeSelectableArea(node, {
    groups: props.groups ?? [],
    modifier: props.modifier ?? {
      keys: ['ControlLeft'],
      method: 'some',
    },
  });

  makeBoundingBox(node, {
    axis: 'y',
    restrictToArea: true,
  });

  makeDroppable(node, {
    events: {
      onDrop: (event) => {
        const { payload, provider } = event;
        if (!payload?.items) return;

        const hoveredDraggable = provider.hovered.draggable;
        if (!hoveredDraggable.size) return;

        const draggableNode = hoveredDraggable.keys().next().value!;
        const placement = hoveredDraggable.get(draggableNode);
        const hoveredEntity = provider.entities.draggableMap.get(draggableNode);
        const hoveredPayload = hoveredEntity?.payload?.();

        if (!placement || !hoveredPayload || hoveredPayload.length < 2) return;

        const [targetIndex, targetSource] = hoveredPayload;
        const [removed] = payload.items.splice(payload.index, 1);
        if (removed === undefined) return;

        const isSameArray = payload.items === targetSource;
        const adjustedIndex =
          isSameArray && payload.index < targetIndex
            ? targetIndex - 1
            : targetIndex;

        const insertBefore = placement.top || placement.left;
        const insertIndex = insertBefore ? adjustedIndex : adjustedIndex + 1;

        targetSource.splice(insertIndex, 0, removed);
      },
    },
  });
</script>

<template>
  <div
    ref="node"
    class="selection-area-container"
  >
    <slot />

    <div
      v-if="isSelecting"
      :style
    />
  </div>
</template>

<style scoped>
  .selection-area-container {
    position: relative;
    padding: 1rem;
    background: rgba(30, 41, 59, 0.6);
    border-radius: 12px;
    border: 1px dashed rgba(148, 163, 184, 0.3);
  }
</style>
