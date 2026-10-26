<script setup lang="ts">
  import type { HTMLAttributes } from 'vue';

  /**
   * A band of the page: its rule spans the viewport, its content sits in the frame, and a
   * cross marks where the rule meets each side of the frame.
   */
  withDefaults(defineProps<{ tag?: string; frameClass?: HTMLAttributes['class']; rule?: boolean }>(), {
    tag: 'section',
    frameClass: undefined,
    rule: true,
  });
</script>

<template>
  <component
    :is="tag"
    class="relative"
    :class="rule ? 'border-b border-default' : ''"
  >
    <div
      class="frame"
      :class="frameClass"
    >
      <slot />
      <template v-if="rule">
        <DecorCross at="bottom-left" />
        <DecorCross at="bottom-right" />
      </template>
    </div>
  </component>
</template>
