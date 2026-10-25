<script setup lang="ts">
  import { DnDProvider } from '@vue-dnd-kit/core';
  import TaskList from '../components/TaskList.vue';
  import TagList from '../components/TagList.vue';
  import PeopleTable from '../components/PeopleTable.vue';
  import ModalList from '../components/ModalList.vue';
</script>

<template>
  <DnDProvider>
    <div class="flex flex-wrap items-start gap-8">
      <div class="flex flex-col gap-8">
        <TaskList />
        <ModalList />
      </div>
      <div class="flex flex-col gap-8">
        <TagList />
        <PeopleTable />
      </div>
    </div>
  </DnDProvider>
</template>
