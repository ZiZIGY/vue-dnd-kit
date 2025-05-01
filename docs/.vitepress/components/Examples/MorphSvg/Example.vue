<script setup lang="ts">
  import Draggable from './Draggable.vue';
  import ExampleContainer from '../../ExampleContainer.vue';
  import { useDroppable } from '@vue-dnd-kit/core';
  import { onMounted, ref } from 'vue';

  // Флаг для проверки клиентской среды
  const isBrowser = typeof window !== 'undefined';
  const gsap = ref<any>(null);

  const { elementRef } = useDroppable({
    events: {
      onHover: (store) => {
        if (!isBrowser || !gsap.value) return;

        const hippo = store.activeContainer.ref.value?.querySelector(
          '#hippo'
        ) as SVGPathElement;
        const circle = store.activeContainer.ref.value?.querySelector(
          '#circle'
        ) as SVGPathElement;

        if (!hippo || !circle) return;

        gsap.value?.to(hippo, { duration: 1, morphSVG: circle });
      },
    },
  });

  onMounted(async () => {
    if (isBrowser) {
      // Динамический импорт GSAP и плагина только на клиенте
      try {
        const gsapModule = await import('gsap');
        const MorphSVGPluginModule = await import('gsap/MorphSVGPlugin');

        gsap.value = gsapModule.default;
        gsap.value.registerPlugin(MorphSVGPluginModule.default);
      } catch (error) {
        console.error('Не удалось загрузить GSAP или MorphSVG плагин:', error);
      }
    }
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
