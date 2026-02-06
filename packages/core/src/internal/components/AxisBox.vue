<script setup lang="ts">
import { useTemplateRef } from 'vue';
import type { TDragAxis } from '../../external/types';
import { makeBoundingBox } from '../../external/composables/makeBoundingBox';

const props = defineProps<{
  axis: TDragAxis // "x" | "y" | "both";
  restrictToArea?: boolean;
}>();

const node = useTemplateRef('node');

makeBoundingBox(node, props);
</script>

<template>
  <div ref="node" class="bounding-box">
    <slot />
  </div>
</template>

<style scoped>
.bounding-box {
  position: relative;
}
</style>