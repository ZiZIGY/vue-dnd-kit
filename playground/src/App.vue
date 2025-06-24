<script setup lang="ts">
  import { HTMLBuilderBase } from '@vue-dnd-kit/components/templates/HTMLBuilder';
</script>

<template>
  <HTMLBuilderBase />
</template>

<style scoped>
  .html-builder {
    display: flex;
    gap: 10px;
    width: 100%;
    height: 100%;
    height: 100svh;
  }

  .html-builder-area {
    flex: 1;

    border: 1px solid #000;
    background-color: #f0f0f0;
  }

  .html-builder-tree {
    width: 200px;
  }

  .html-builder-config {
    height: 300px;
    width: 100%;
    position: fixed;
    background-color: #fff;
    bottom: 0;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.25);
    overflow: auto;
  }
</style>
