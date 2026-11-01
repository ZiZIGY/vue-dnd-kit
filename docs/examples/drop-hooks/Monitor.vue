<script setup lang="ts">
import { useDnDMonitor } from '@vue-dnd-kit/core';
import type { Answer, Trace } from './types';

const props = defineProps<{ answer: Answer; trace: Trace }>();

// Hears every drag under the provider, and decides before the target does.
useDnDMonitor({
  onBeforeDrop: () => {
    props.trace('monitor', `onBeforeDrop → ${props.answer}`);
    return props.answer;
  },
  onDragEnd: () => props.trace('monitor', 'onDragEnd'),
  onDragCancel: () => props.trace('monitor', 'onDragCancel'),
  onDragResume: () => props.trace('monitor', 'onDragResume: click to drop'),
});
</script>

<template>
  <p class="note">A monitor answers every drop first: “reject” or “continue” end the asking before the target is asked.</p>
</template>

<style scoped>
.note {
  max-width: 440px;
  margin: 0;
  font: 11px/1.5 ui-monospace, Menlo, Consolas, monospace;
  text-align: center;
  opacity: 0.55;
}
</style>
