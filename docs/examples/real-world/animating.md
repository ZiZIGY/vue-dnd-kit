# Animating Drag and Drop

Adding animations to your drag and drop interactions can significantly enhance the user experience. Vue DnD Kit provides powerful animation capabilities to create engaging interactions.

<script setup>
import Example from '@examples/Animation/Example.vue';
</script>

## Overview

Vue DnD Kit offers several ways to animate drag and drop interactions:

1. **Custom drag containers**: Create specialized components for drag overlays
2. **CSS transitions**: Use Vue's transition system for simple animations
3. **JavaScript animations**: Integrate with libraries like GSAP for complex effects
4. **Animation state tracking**: Monitor animation states to coordinate UI updates

<Example />

## Custom Drag Container

For advanced animations, you can create a custom container component that controls how dragged elements appear:

```vue
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
```

## Draggable Component with Animation Tracking

This component shows how to create a draggable element that coordinates its animations with the custom container:

```vue
<script setup lang="ts">
  import { useDnDStore, useDraggable } from '@vue-dnd-kit/core';
  import CustomContainer from './CustomContainer.vue';
  import { computed, markRaw } from 'vue';

  const emit = defineEmits<{
    (e: 'end'): void;
  }>();

  const { elementRef, handleDragStart, isDragging } = useDraggable({
    container: markRaw(CustomContainer),
    events: {
      onEnd: () => emit('end'),
    },
  });

  const { activeContainer } = useDnDStore();

  const containerIsAnimating = computed(
    () =>
      activeContainer.animating.leave.value ||
      isDragging.value ||
      activeContainer.ref.value
  );
</script>

<template>
  <Transition name="fill">
    <div
      v-show="!containerIsAnimating"
      ref="elementRef"
      @pointerdown="handleDragStart"
      class="fill-container"
      :class="{ 'fill-container-active': isDragging }"
    >
      <slot>Drag me</slot>
    </div>
  </Transition>
</template>

<style scoped>
  .fill-container {
    padding: 20px;
    box-sizing: border-box;
    width: 150px;
    height: 100px;
    border-radius: 8px;
    background-color: var(--vp-c-brand);
    color: white;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    user-select: none;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    clip-path: circle(150% at 50% 50%);
  }

  .fill-container:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .fill-container:active {
    cursor: grabbing;
  }

  .fill-container-active {
    display: none;
  }

  .fill-enter-active {
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .fill-enter-from {
    clip-path: circle(0% at 50% 50%);
  }
</style>
```

## Complete Example with Drop Zone Animations

This example shows how to coordinate animations between draggable elements and drop zones:

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import Draggable from './Draggable.vue';
  import { useDnDStore, useDroppable } from '@vue-dnd-kit/core';

  const dropped = ref(false);

  const { elementRef, isOvered } = useDroppable({
    events: {
      onDrop: () => (dropped.value = true),
    },
  });

  const { isDragging } = useDnDStore();
</script>

<template>
  <div class="animation-example">
    <Draggable
      v-if="!dropped"
      @end="dropped = false"
      class="source-draggable"
    >
      Drag me to zone
    </Draggable>

    <div
      ref="elementRef"
      class="drop-zone"
      :class="{ 'is-overed': isOvered && isDragging }"
    >
      <span class="drop-zone-label">Drop here</span>

      <Transition name="circle-skeleton">
        <div
          v-if="isOvered && isDragging"
          class="circle-skeleton"
        />
      </Transition>

      <Draggable
        v-if="dropped"
        @end="dropped = false"
        class="target-draggable"
      >
        Drag me back
      </Draggable>
    </div>
  </div>
</template>

<style>
  .animation-example {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 40px;
    padding: 20px;
  }

  .drop-zone {
    height: 200px;
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.3s ease;
  }

  .drop-zone-label {
    margin-bottom: 20px;
    font-weight: 500;
    color: #666;
  }

  .is-overed {
    border-color: var(--vp-c-brand);
    background-color: rgba(var(--vp-c-brand-rgb), 0.05);
    transform: scale(1.03);
  }

  .circle-skeleton {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: rgba(var(--vp-c-brand-rgb), 0.15);
    border: 2px dashed var(--vp-c-brand);
    position: absolute;
  }

  .circle-skeleton-leave-active,
  .circle-skeleton-enter-active {
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .circle-skeleton-enter-from,
  .circle-skeleton-leave-to {
    opacity: 0;
    transform: scale(0.5);
  }

  .source-draggable {
    align-self: flex-start;
  }

  .target-draggable {
    margin-top: 20px;
  }
</style>
```

## Animation Features

### Transition Options

When using `useDragContainer`, you can specify various transition options:

```js
const { elementRef } = useDragContainer({
  name: 'ripple', // Transition name
  onEnter, // Enter animation handler
  onLeave, // Leave animation handler
  enterFromClass: 'custom-enter-from',
  enterActiveClass: 'custom-enter-active',
  leaveToClass: 'custom-leave-to',
  // ... other Vue transition props
});
```

### Tracking Animation States

The `animating` object returned by `useDragContainer` helps coordinate animations:

```js
const { animating } = useDragContainer({
  // options
});

// animating.enter.value is true during enter animation
// animating.leave.value is true during leave animation
```

This is useful for coordinating the visibility of original elements while their clones are being animated.

### GSAP Integration

For complex animations, GSAP integration works well with Vue DnD Kit:

```js
function onEnter(el) {
  gsap.fromTo(
    el,
    { clipPath: 'circle(100% at 50% 50%)' },
    {
      clipPath: 'circle(50% at 50% 50%)',
      duration: 0.7,
      ease: 'elastic.inOut(2.5, 1)',
    }
  );
}

function onLeave(el, done) {
  // Remember to call done() when animation completes
  gsap.to(el, {
    opacity: 0,
    scale: 0,
    onComplete: done,
  });
}
```

## Best Practices

1. **Call `done()` in animation callbacks**: Always call the `done()` function in your `onEnter`/`onLeave` callbacks when using custom JavaScript animations
2. **Track animation states**: Use the `animating` object to coordinate UI elements during transitions
3. **Coordinate original and clone visibility**: Hide the original element while its clone is visible using computed properties based on animation state
4. **Use fixed positioning for drag overlays**: Set `position: fixed` in your custom container's styles for smooth dragging
5. **Apply transition styles for smooth movement**: Add transitions to the transform property for smoother cursor following
