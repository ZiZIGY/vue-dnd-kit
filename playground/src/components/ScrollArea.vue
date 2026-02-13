<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import {
    makeAutoScroll,
    makeAutoScrollViewport,
  } from '../../../packages/utilities/src/index';
  import { makeConstraintArea } from '@vue-dnd-kit/core';

  const scrollContainerRef = useTemplateRef('scrollContainerRef');

  makeConstraintArea(scrollContainerRef, {
    restrictToArea: true,
  });
  makeAutoScrollViewport({ threshold: 60, speed: 12 });
  makeAutoScroll(scrollContainerRef, { threshold: 60, speed: 12 });
</script>

<template>
  <div ref="scrollContainerRef">
    <slot />
  </div>
</template>
