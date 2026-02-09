<script setup lang="ts">
  import { useDragContainer } from '@vue-dnd-kit/core';
  import { computed, CSSProperties } from 'vue';
  import gsap from 'gsap';

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

  const computedStyle = computed<CSSProperties>(() => {
    const currentX = pointerPosition.current.value?.x ?? 0;
    const currentY = pointerPosition.current.value?.y ?? 0;
    const offsetX = pointerPosition.offset.pixel.value?.x ?? 0;
    const offsetY = pointerPosition.offset.pixel.value?.y ?? 0;

    return {
      transform: `translate3d(${currentX - offsetX}px, ${
        currentY - offsetY
      }px, 0)`,
      zIndex: 1000,
      position: 'fixed',
      top: 0,
      left: 0,
      transition: '0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
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
      class="dragging-element"
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
    pointer-events: none;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
  }

  .dragging-element {
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--vp-c-brand);
    color: white;
    font-weight: 500;
  }

  .ripple-enter-active,
  .ripple-leave-active {
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }
</style>
