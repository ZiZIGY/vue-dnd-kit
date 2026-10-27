<script setup lang="ts">
import { computed, ref, shallowRef, useTemplateRef } from 'vue';
import { makeSelectionArea, makeSortableList, useDnD, type Key } from '@vue-dnd-kit/core';
import OptionRow from './OptionRow.vue';
import ShapeTile from './ShapeTile.vue';

const shapes = ref(
  Array.from({ length: 12 }, (_, i) => ({
    id: `${i % 3 ? 'c' : 's'}${i + 1}`,
    kind: i % 3 ? 'circle' : 'square',
    hue: (i * 37) % 360,
  })),
);
const list = useTemplateRef<HTMLElement>('list');
// The shapes are sortable: drag a selected one and the whole selection travels.
const { items } = makeSortableList(list, { items: shapes, strategy: 'grid' });

const strategy = ref<'toggle' | 'select'>('toggle');
const modifier = ref<'undefined' | 'Shift'>('undefined');
const accept = ref<'*' | 'circle'>('*');
const selected = shallowRef<Key[]>([]);

const area = useTemplateRef<HTMLElement>('area');
// Read when a press starts a band: getters (and a ref for `accept`, whose functions are rules).
const { isSelecting, style } = makeSelectionArea(area, {
  strategy,
  modifier: () => (modifier.value === 'Shift' ? { keys: ['Shift'], method: 'every' } : undefined),
  accept: computed(() => accept.value),
  onSelected: (ids) => (selected.value = ids),
});

const { selection } = useDnD();

const styleText = computed(() => {
  const { left, top, width, height } = style.value;
  return isSelecting.value ? `{ left: '${left}', top: '${top}', width: '${width}', height: '${height}', … }` : `{ display: 'none' }`;
});
</script>

<template>
  <div class="demo">
    <div class="options-panel" role="group" aria-label="makeSelectionArea options">
      <OptionRow v-model="strategy" name="strategy" :options="['toggle', 'select']" />
      <OptionRow v-model="modifier" name="modifier" :options="['undefined', 'Shift']" />
      <OptionRow v-model="accept" name="accept" :options="['*', 'circle']" />
    </div>

    <!-- The band is absolutely positioned in the area: it needs a non-static position. -->
    <div ref="area" class="area" :class="{ selecting: isSelecting }">
      <ul ref="list" class="shapes">
        <ShapeTile v-for="shape in items" :key="shape.id" :shape="shape" />
      </ul>
      <div v-if="isSelecting" class="band" :style="style" />
    </div>

    <dl class="readout">
      <dt>isSelecting</dt>
      <dd :class="{ live: isSelecting }">{{ isSelecting }}</dd>
      <dt>style</dt>
      <dd :class="{ live: isSelecting }">{{ styleText }}</dd>
      <dt>onSelected</dt>
      <dd>
        [{{ selected.map((id) => `'${id}'`).join(', ') }}]
        <button v-if="selection.ids.size" type="button" class="clear" @click="selection.clear()">clear</button>
      </dd>
    </dl>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  grid-template-columns: auto auto;
  align-items: start;
  justify-content: center;
  gap: 14px 16px;
}

.options-panel {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  gap: 8px 12px;
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

.area {
  position: relative;
  padding: 16px;
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent);
  cursor: crosshair;
}

.shapes {
  display: grid;
  grid-template-columns: repeat(4, 40px);
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.band {
  border: 1px solid #42b883;
  border-radius: 3px;
  background: color-mix(in srgb, #42b883 14%, transparent);
}

.readout {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: auto 1fr;
  gap: 3px 12px;
  margin: 0;
  padding: 0 4px;
  font: 11px/1.6 ui-monospace, Menlo, Consolas, monospace;
}

dt {
  opacity: 0.5;
}

dd {
  margin: 0;
  overflow-wrap: anywhere;
}

/* Two lines kept for a long list of ids. */
dd:last-child {
  min-height: 3.2em;
}

dd.live {
  color: #42b883;
}

.clear {
  margin-left: 6px;
  padding: 0 6px;
  border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
  border-radius: 5px;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.clear:focus-visible {
  outline: 2px solid #42b883;
}

@media (max-width: 520px) {
  .demo {
    grid-template-columns: minmax(0, auto);
  }
}
</style>
