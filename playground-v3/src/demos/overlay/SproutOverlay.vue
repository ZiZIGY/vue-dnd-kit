<script setup lang="ts">
  import type { OverlayProps } from '@vue-dnd-kit/core';

  // The garden's overlay wraps the seed's own (its default slot): a sprout grows from it,
  // and it says which place in the garden the seed would take (`to`).
  defineProps<OverlayProps>();
</script>

<template>
  <div
    class="sprout"
    data-overlay-kind="sprout"
    :data-to="to ? `${to.list}:${to.index}` : undefined"
  >
    <slot />
    <span class="leaf">🌿 {{ to ? `#${to.index + 1}` : '' }}</span>
  </div>
</template>

<style scoped>
  .sprout {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .leaf {
    position: absolute;
    top: -14px;
    right: -8px;
    padding: 2px 8px;
    font-size: 12px;
    background: #dcfce7;
    border: 1px solid #86efac;
    border-radius: 999px;
    animation: grow 0.3s cubic-bezier(0.2, 0.8, 0.2, 1.4) both;
  }

  @keyframes grow {
    from {
      scale: 0;
    }
  }
</style>
