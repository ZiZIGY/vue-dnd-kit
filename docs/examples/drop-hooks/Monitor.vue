<script setup lang="ts">
import { useDnDMonitor } from '@vue-dnd-kit/core';

const props = defineProps<{
  answer: 'accept' | 'reject';
  trace: (who: string, what: string) => void;
}>();

// Hears every drag under the provider, and decides before the target does.
useDnDMonitor({
  onBeforeDrop: () => {
    props.trace('monitor', `onBeforeDrop → ${props.answer}`);
    return props.answer;
  },
  onDragEnd: () => props.trace('monitor', 'onDragEnd'),
  onDragCancel: () => props.trace('monitor', 'onDragCancel'),
});
</script>

<template>
  <p class="note">A monitor here answers every drop first. “reject” vetoes it before any list is asked.</p>
</template>

<style scoped>
.note {
  max-width: 420px;
  margin: 0;
  font: 11px/1.5 ui-monospace, Menlo, Consolas, monospace;
  text-align: center;
  opacity: 0.55;
}
</style>
