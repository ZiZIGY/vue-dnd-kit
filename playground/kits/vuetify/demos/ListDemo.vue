<script setup lang="ts">
  import { DnDProvider } from '@vue-dnd-kit/core';
  import TaskList from '../components/TaskList.vue';
  import TagList from '../components/TagList.vue';
  import PeopleTable from '../components/PeopleTable.vue';
  import DialogList from '../components/DialogList.vue';
</script>

<template>
  <DnDProvider>
    <!-- `max-width`: on a phone the columns stack and the table scrolls inside its own wrapper. -->
    <div class="d-flex flex-wrap align-start ga-8">
      <div
        class="d-flex flex-column ga-8"
        style="max-width: 100%"
      >
        <TaskList />
        <DialogList />
      </div>
      <div
        class="d-flex flex-column ga-8"
        style="max-width: 100%"
      >
        <TagList />
        <PeopleTable />
      </div>
    </div>
  </DnDProvider>
</template>

<style>
  /*
   * The overlay is a copy of the row, shown outside <v-list> (or the table): a transparent
   * row gets the surface back (the theme's variables travel with the copy).
   */
  [data-dnd-overlay] .v-list-item,
  [data-dnd-overlay] tr {
    background: rgb(var(--v-theme-surface));
  }
</style>
