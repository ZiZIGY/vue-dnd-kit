<script setup lang="ts">
  import Draggable from './Draggable.vue';
  import ExampleContainer from '../../ExampleContainer.vue';
  import { useDroppable } from '@vue-dnd-kit/core';
  import gsap from 'gsap';
  import { onMounted } from 'vue';
  import MorphSVGPlugin from 'gsap/MorphSVGPlugin';

  const { elementRef } = useDroppable({
    events: {
      onHover: (store) => {
        const hippo = store.activeContainer.ref.value?.querySelector(
          '#hippo'
        ) as SVGPathElement;
        const circle = store.activeContainer.ref.value?.querySelector(
          '#circle'
        ) as SVGPathElement;

        if (!hippo || !circle) return;

        gsap.to(hippo, { duration: 1, morphSVG: circle });
      },
    },
  });

  onMounted(() => {
    gsap.registerPlugin(MorphSVGPlugin);
  });
</script>

<template>
  <ExampleContainer>
    <div class="container">
      <Draggable />

      <div
        ref="elementRef"
        class="droppable"
        >morph me</div
      >
    </div>
  </ExampleContainer>
</template>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
  }

  .droppable {
    padding: 30px;
    border: 2px dashed rgba(62, 175, 124, 0.4);
    border-radius: 8px;
    background-color: rgba(62, 175, 124, 0.05);
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    color: rgba(60, 60, 60, 0.7);
  }
</style>
