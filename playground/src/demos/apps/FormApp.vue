<script setup lang="ts">
  import { DnDProvider } from '@vue-dnd-kit/core';
  import FormBuilder from '../../components/apps/form/FormBuilder.vue';
  import FieldGhost from '../../components/apps/form/FieldGhost.vue';
</script>

<template>
  <section>
    <h2 class="fb-heading">Form builder</h2>
    <!-- Own provider: a chip overlay, and Alt (the default copyModifier) duplicates fields. -->
    <DnDProvider overlay-fit="source">
      <FormBuilder />
      <template #overlay="{ items, mode, accepted }">
        <FieldGhost
          :items="items"
          :mode="mode"
          :accepted="accepted"
        />
      </template>
    </DnDProvider>
  </section>
</template>

<style scoped>
  .fb-heading {
    margin: 0 0 12px;
  }
</style>
