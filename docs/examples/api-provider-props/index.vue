<script setup lang="ts">
import { computed, ref } from 'vue';
import { DnDProvider, type ActivationOptions } from '@vue-dnd-kit/core';
import PropRow from './PropRow.vue';
import DensityList from './DensityList.vue';

const ACTIVATIONS: Record<string, ActivationOptions | undefined> = {
  default: undefined,
  '{ mouse: { delay: 300 } }': { mouse: { delay: 300, tolerance: 5 } },
};

const overlayFit = ref<'slot' | 'source'>('slot');
const activation = ref('default');
const keyboard = ref<'true' | 'false'>('true');
const copyModifier = ref<'Alt' | 'Shift' | 'null'>('Alt');

// The provider reads its props when it needs them: a change applies to the next drag.
const props = computed(() => ({
  overlayFit: overlayFit.value,
  activation: ACTIVATIONS[activation.value],
  // `false` turns keyboard drags off; an object sets their keys and steps.
  keyboard: keyboard.value === 'true' ? undefined : (false as const),
  copyModifier: copyModifier.value === 'null' ? null : copyModifier.value,
}));

const compact = ref([
  { id: 'copy', title: 'Write copy' },
  { id: 'login', title: 'Fix login' },
]);
const roomy = ref([
  { id: 'sprint', title: 'Plan the sprint' },
  { id: 'review', title: 'Review the PR' },
]);
</script>

<template>
  <DnDProvider v-bind="props">
    <div class="demo">
      <div class="props" role="group" aria-label="DnDProvider props">
        <PropRow v-model="overlayFit" name="overlay-fit" :options="['slot', 'source']" />
        <PropRow v-model="activation" name=":activation" :options="Object.keys(ACTIVATIONS)" />
        <PropRow v-model="keyboard" name=":keyboard" :options="['true', 'false']" />
        <PropRow v-model="copyModifier" name="copy-modifier" :options="['Alt', 'Shift', 'null']" />
      </div>
      <div class="lists">
        <DensityList v-model="compact" title="Compact" compact />
        <DensityList v-model="roomy" title="Roomy" />
      </div>
    </div>
  </DnDProvider>
</template>

<style scoped>
/* Room for every row in one list: the lists grow downward and nothing moves under the pointer. */
.demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  min-height: 430px;
}

.props {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  gap: 6px 14px;
  max-width: 100%;
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

.lists {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 14px;
}

@media (max-width: 480px) {
  .props {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
