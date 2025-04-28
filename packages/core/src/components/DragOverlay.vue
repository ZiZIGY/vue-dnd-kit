<script setup lang="ts">
  import { computed, Transition } from 'vue';
  import { useDnDStore } from '../composables/useDnDStore';
  import DefaultOverlay from './DefaultOverlay.vue';

  const { activeContainer } = useDnDStore();

  const overlay = computed(() => {
    return activeContainer.component.value ?? DefaultOverlay;
  });
</script>

<template>
  <Transition
    v-if="activeContainer.options.value"
    :name="activeContainer.options.value.name"
    :duration="activeContainer.options.value.duration"
    :enter-from-class="activeContainer.options.value.enterFromClass"
    :enter-to-class="activeContainer.options.value.enterToClass"
    :enter-active-class="activeContainer.options.value.enterActiveClass"
    :leave-from-class="activeContainer.options.value.leaveFromClass"
    :leave-to-class="activeContainer.options.value.leaveToClass"
    :leave-active-class="activeContainer.options.value.leaveActiveClass"
    :mode="activeContainer.options.value.mode"
    :type="activeContainer.options.value.type"
    :css="activeContainer.options.value.css"
    :appear="activeContainer.options.value.appear"
    :appear-active-class="activeContainer.options.value.appearActiveClass"
    :appear-from-class="activeContainer.options.value.appearFromClass"
    :appear-to-class="activeContainer.options.value.appearToClass"
    :persisted="activeContainer.options.value.persisted"
    @enter="activeContainer.options.value.onEnter"
    @leave="activeContainer.options.value.onLeave"
    @before-enter="activeContainer.options.value.onBeforeEnter"
    @before-leave="activeContainer.options.value.onBeforeLeave"
    @before-appear="activeContainer.options.value.onBeforeAppear"
    @after-enter="activeContainer.options.value.onAfterEnter"
    @after-leave="activeContainer.options.value.onAfterLeave"
    @after-appear="activeContainer.options.value.onAfterAppear"
  >
    <component :is="overlay" />
  </Transition>

  <component
    v-else
    :is="overlay"
  />
</template>
