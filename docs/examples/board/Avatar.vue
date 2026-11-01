<script setup lang="ts">
import { computed } from 'vue';
import { person } from './store';

const props = defineProps<{ id: string }>();
const who = computed(() => person(props.id));
</script>

<template>
  <span class="avatar" :style="{ background: who.color }" :title="who.name">{{ who.name[0] }}</span>
</template>

<style scoped>
/* A ring of the surface under it (`--ring`) parts avatars that overlap. */
.avatar {
  display: inline-grid;
  flex: none;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-shadow: 0 0 0 2px var(--ring, Canvas);
  color: #fff;
  font: 600 10px/1 system-ui, sans-serif;
  user-select: none;
}
</style>
