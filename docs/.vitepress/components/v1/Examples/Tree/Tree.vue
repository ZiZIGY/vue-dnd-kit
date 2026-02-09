<script setup lang="ts">
  import Draggable from './Draggable.vue';
  import Droppable from './Droppable.vue';

  interface TreeItem {
    id?: string | number;
    children?: TreeItem[];
  }

  const { source } = defineProps<{
    source: TreeItem[];
  }>();
</script>

<template>
  <Droppable :source="source">
    <TransitionGroup name="list">
      <Draggable
        v-for="(item, index) in source"
        :key="item.id"
        :index="index"
        :source="source"
      >
        Draggable - {{ item.id }}
        <Tree
          v-if="item.children"
          :source="item.children"
        />
      </Draggable>
    </TransitionGroup>
  </Droppable>
</template>

<style scoped>
  .list-move {
    transition: all 0.3s ease;
  }
  .list-enter-active,
  .list-leave-active {
    transition: all 0.3s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
  }
  .list-leave-active {
    position: absolute;
  }
</style>
