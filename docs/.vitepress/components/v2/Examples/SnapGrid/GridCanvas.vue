<script setup lang="ts">
  import {computed, useTemplateRef} from 'vue'

  const props = defineProps<{
    stepX: number;
    stepY: number;
  }>();

  const canvasRef = useTemplateRef('canvasRef');

  /** Workaround for example 
   * snap on DragPreview must be handle "round" logic, based on parent position
  */
  const canvasPadding = computed(() => {
    const rect = canvasRef.value?.getBoundingClientRect()
    if(!rect)
      return { pX: 0, pY: 0 }

    const pX = rect.left % props.stepX * -1
    const pY = rect.top % props.stepY * -1

    return { pX, pY }
  })
</script>

<template>
  <div
    ref="canvasRef"
    class="canvas"
    :style="{ 
      '--gx': `${props.stepX}px`, 
      '--gy': `${props.stepY}px`, 
      '--px': `${canvasPadding.pX}px`, 
      '--py': `${canvasPadding.pY}px` 
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
  .canvas {
    position: relative;
    min-height: 240px;
    border-radius: 8px;
    border: 1px solid rgba(148, 163, 184, 0.2);
    background-color: var(--vp-c-bg);
    background-image:
      linear-gradient(rgba(62, 175, 124, 0.15) 1px, transparent 1px),
      linear-gradient(90deg, rgba(62, 175, 124, 0.15) 1px, transparent 1px);
    background-size: var(--gx) var(--gy);
    background-position: var(--px) var(--py);
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
