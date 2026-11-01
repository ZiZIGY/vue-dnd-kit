<script setup lang="ts">
import { ref } from 'vue';
import AppList from './AppList.vue';

const apps = ref([
  { id: 'notes', name: 'Notes' },
  { id: 'maps', name: 'Maps' },
  { id: 'photos', name: 'Photos' },
  { id: 'clock', name: 'Clock' },
  { id: 'files', name: 'Files' },
  { id: 'calendar', name: 'Calendar' },
  { id: 'weather', name: 'Weather' },
  { id: 'settings', name: 'Settings' },
]);
const dock = ref([
  { id: 'mail', name: 'Mail' },
  { id: 'chat', name: 'Chat' },
  { id: 'camera', name: 'Camera' },
]);
</script>

<template>
  <!-- Each list in a component of its own: one sortable list per component. -->
  <div class="screen">
    <AppList v-model="apps" />
    <AppList v-model="dock" dock :limit="4" />
  </div>
</template>

<style scoped>
.screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  padding: 24px 20px 14px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 28px;
  background:
    radial-gradient(120% 80% at 0% 0%, color-mix(in srgb, #42b883 16%, transparent), transparent 60%),
    color-mix(in srgb, currentColor 3%, Canvas);
}
</style>
