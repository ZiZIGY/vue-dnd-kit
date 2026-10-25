<script setup lang="ts">
  import { computed } from 'vue';
  import type { OverlayProps } from '@vue-dnd-kit/core';
  import { cardOf } from './gallery';

  // Item-level overlay (`makeSortableItem({ overlay })`): wins over the list and the provider.
  const props = defineProps<OverlayProps>();
  const card = computed(() => cardOf(props.items[0]));
</script>

<template>
  <!-- width/height 100%: follows the overlay box, which takes the size of the target slot. -->
  <div
    class="note-overlay"
    data-overlay-kind="note"
  >
    <span class="pin" />
    <strong>{{ card?.title }}</strong>
    <small>sticky note</small>
  </div>
</template>

<style scoped>
  .note-overlay {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 6px 12px;
    box-sizing: border-box;
    background: linear-gradient(170deg, hsl(52 100% 86%), hsl(46 96% 76%));
    border-radius: 2px 2px 14px 2px;
    box-shadow: 0 14px 24px -10px rgb(120 90 0 / 0.55);
    transform: rotate(-2.5deg);
    font: 14px/1.2 'Segoe Print', 'Comic Sans MS', cursive;
    color: #713f12;
  }

  .pin {
    position: absolute;
    top: -6px;
    left: 50%;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #dc2626;
    box-shadow: 0 2px 2px rgb(0 0 0 / 0.3);
  }

  small {
    font: 11px system-ui, sans-serif;
    opacity: 0.7;
  }
</style>
