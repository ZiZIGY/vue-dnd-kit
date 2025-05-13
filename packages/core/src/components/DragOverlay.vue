<script setup lang="ts">
  import { computed, CSSProperties } from 'vue';
  import { useDnDStore } from '../composables/useDnDStore';
  import DefaultOverlay from './DefaultOverlay.vue';

  const props = defineProps<{
    styles?: CSSProperties;
  }>();

  const { activeContainer } = useDnDStore();

  const overlay = computed(() => ({
    component: activeContainer.component.value ?? DefaultOverlay,
    props,
  }));
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
    :appear-active-class="activeContainer.options.value.appearActiveClass"
    :appear-from-class="activeContainer.options.value.appearFromClass"
    :appear-to-class="activeContainer.options.value.appearToClass"
    :mode="activeContainer.options.value.mode"
    :type="activeContainer.options.value.type"
    :css="activeContainer.options.value.css"
    :appear="true"
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
    <component
      :is="overlay.component || overlay"
      v-bind="overlay.props || {}"
    />
  </Transition>

  <component
    v-else
    :is="overlay.component || overlay"
    v-bind="overlay.props || {}"
  />
</template>
