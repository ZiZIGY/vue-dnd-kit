<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable, type AcceptRule, type Key } from '@vue-dnd-kit/core';

const props = defineProps<{ title: string; rule: string; accept?: AcceptRule; disabled?: boolean }>();
const emit = defineEmits<{ drop: [file: Key] }>();

const el = useTemplateRef<HTMLElement>('el');
const { isOver, isAccepting } = makeDroppable(el, {
  accept: props.accept,
  disabled: () => !!props.disabled,
  // A plain drop target moves nothing itself: the drop is yours to apply.
  onDrop: (e) => emit('drop', e.active.id),
});
</script>

<template>
  <section
    ref="el"
    class="zone"
    :class="{ accepting: isAccepting, over: isOver && isAccepting, refusing: isOver && !isAccepting, disabled }"
  >
    <header>
      <strong>{{ title }}</strong>
      <code>{{ rule }}</code>
    </header>
    <div class="files"><slot /></div>
  </section>
</template>

<style scoped>
.zone {
  display: flex;
  flex-direction: column;
  min-height: 140px;
  padding: 12px;
  border: 1.5px dashed color-mix(in srgb, currentColor 18%, transparent);
  border-radius: 14px;
  transition:
    border-color 0.15s,
    background 0.15s;
}

/* Something is being dragged that this zone takes. */
.zone.accepting {
  border-color: color-mix(in srgb, #42b883 45%, transparent);
}

.zone.over {
  border-style: solid;
  border-color: #42b883;
  background: color-mix(in srgb, #42b883 8%, transparent);
}

/* Over a zone that refuses the drag: a drop here flies back. */
.zone.refusing {
  border-style: solid;
  border-color: #ef4444;
  background: color-mix(in srgb, #ef4444 7%, transparent);
}

.zone.disabled {
  opacity: 0.5;
}

header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
  font-size: 13px;
}

code {
  font: 11px/1.3 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.6;
}

.files {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 8px;
}
</style>
