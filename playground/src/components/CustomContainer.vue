<script setup lang="ts">
  import { useDragContainer } from '@vue-dnd-kit/core';
  import { computed, CSSProperties, ref } from 'vue';
  import gsap from 'gsap';

  // Настройки сетки
  const gridSize = ref(100); // Размер ячейки сетки в пикселях

  const {
    elementRef,
    pointerPosition,
    isDragging,
    animating,
    draggingElements,
  } = useDragContainer({
    name: 'ripple',
    onEnter,
    onLeave,
  });

  // Функция для привязки к сетке
  const snapToGrid = (value: number): number => {
    return Math.round(value / gridSize.value) * gridSize.value;
  };

  const computedStyle = computed<CSSProperties>(() => {
    // Базовые стили всегда применяются
    const baseStyles = {
      zIndex: 1000,
      position: 'fixed',
      top: 0,
      left: 0,
      transition: '0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
    };

    // Если нет позиции указателя, возвращаем только базовые стили
    if (!pointerPosition.current.value || !pointerPosition.offset.pixel.value) {
      return baseStyles;
    }

    // Вычисляем позицию с привязкой к сетке
    const x =
      pointerPosition.current.value.x -
      (pointerPosition.offset.pixel.value?.x || 0);
    const y =
      pointerPosition.current.value.y -
      (pointerPosition.offset.pixel.value?.y || 0);

    // Применяем привязку к сетке
    const snappedX = snapToGrid(x);
    const snappedY = snapToGrid(y);

    // Возвращаем стили с привязкой к сетке
    return {
      ...baseStyles,
      transform: `translate3d(${snappedX}px, ${snappedY}px, 0)`,
    };
  });

  function onEnter(el: HTMLElement | Element) {
    gsap.fromTo(
      el,
      {
        clipPath: 'circle(100% at 50% 50%)',
      },
      {
        clipPath: 'circle(50% at 50% 50%)',
        duration: 0.7,
        ease: 'elastic.inOut(2.5, 1)',
        width: 100,
      }
    );
  }

  function onLeave(el: HTMLElement | Element, done: () => void) {
    animating.leave.value = true;
    gsap.to(el, {
      duration: 0.7,
      scaleX: 0.25,
      scaleY: 0.25,
      ease: 'elastic.inOut(2.5, 1)',
    });
    gsap.to(el, {
      duration: 0.2,
      delay: 0.5,
      scaleX: 0,
      scaleY: 0,
      opacity: 0,
      onComplete: () => {
        animating.leave.value = false;
        done();
      },
    });
  }
</script>

<template>
  <div
    v-if="isDragging"
    ref="elementRef"
    :style="computedStyle"
    class="ripple"
  >
    <div
      v-for="[, element] in draggingElements"
      :key="element.id"
      v-html="element.initialHTML"
      :style="{
        width: element.initialRect?.width + 'px',
        height: element.initialRect?.height + 'px',
      }"
    />
  </div>
</template>

<style scoped>
  .ripple {
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ripple-enter-active,
  .ripple-leave-active {
    transition: all 1s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
</style>
