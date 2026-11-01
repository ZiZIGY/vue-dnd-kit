<script setup lang="ts">
// The few line icons the board uses, drawn at the text's size and color.
const PATHS: Record<string, string> = {
  search: 'M11 4.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM20 20l-4.3-4.3',
  close: 'M6.5 6.5l11 11M17.5 6.5l-11 11',
  plus: 'M12 5.5v13M5.5 12h13',
  check: 'M5.5 12.5l4 4 9-9.5',
  comment: 'M20 15a2 2 0 0 1-2 2H8.5L4 20.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z',
  file: 'M20 11.5l-8 8a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.6 1.6 0 0 1-2.3-2.3L15 7.3',
  calendar: 'M4.5 7.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2zM4.5 10.5h15M9 3.5v4M15 3.5v4',
  trash: 'M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5',
  limit: 'M12 3.5l9 16h-18zM12 10v4.5M12 17.2v.3',
  undo: 'M9 14.5l-5-5 5-5M4 9.5h10.5a5.5 5.5 0 0 1 0 11H11',
};

defineProps<{ name: string }>();
</script>

<template>
  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path :d="PATHS[name]" /></svg>
</template>

<style scoped>
.icon {
  flex: none;
  width: 1em;
  height: 1em;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
