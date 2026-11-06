<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { useElementSize } from '@vueuse/core';
import { makeSortableList, useDnD } from '@vue-dnd-kit/core';
import Widget from './Widget.vue';
import { GAP, ROW, columnsFor, initialWidgets, type Size, type Widget as WidgetData } from './widgets';

const widgets = ref(initialWidgets());

// The grid follows its own width, not the window's: fewer columns when it is narrow, and the
// width of a column, which the corners snap to.
const grid = useTemplateRef<HTMLElement>('grid');
const { width } = useElementSize(grid);
const columns = computed(() => columnsFor(width.value));
const cell = computed(() => Math.max((width.value - GAP * (columns.value - 1)) / columns.value, 1));

const { active } = useDnD();
const { items } = makeSortableList(grid, {
  items: widgets,
  // Two dimensions, with widgets of different sizes.
  strategy: 'grid',
  label: 'Dashboard',
  // A corner being dragged isn't a widget: the grid takes no part in it, so its drop is no
  // refusal (a cancel), and the widget keeps its new size.
  disabled: () => !!active.value?.type.includes('resize'),
});

const spoken = ref('');
const resize = (widget: WidgetData, size: Size) => {
  widget.w = size.w;
  widget.h = size.h;
  spoken.value = `${widget.title}: ${size.w} by ${size.h}.`;
};
const reset = () => {
  widgets.value = initialWidgets();
  spoken.value = 'Layout reset.';
};
</script>

<template>
  <section class="dashboard">
    <header class="top">
      <strong>Overview</strong>
      <span class="columns">{{ columns }} columns</span>
      <button type="button" class="reset" @click="reset">Reset</button>
    </header>
    <div ref="grid" class="grid" :style="{ '--columns': columns, '--row': `${ROW}px`, '--gap': `${GAP}px` }">
      <Widget
        v-for="widget in items"
        :key="widget.id"
        :widget="widget"
        :columns="columns"
        :cell="cell"
        @resize="resize(widget, $event)"
      />
    </div>
    <p class="spoken" aria-live="polite">{{ spoken }}</p>
  </section>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
}

.top {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.columns {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}

.reset {
  margin-left: auto;
  padding: 5px 10px;
  border: 1px solid color-mix(in srgb, currentColor 15%, transparent);
  border-radius: 7px;
  background: none;
  color: inherit;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}

.reset:hover {
  background: color-mix(in srgb, currentColor 6%, transparent);
}

/* Rows are at least --row tall, and grow with their content. Holes are filled by later widgets. */
.grid {
  display: grid;
  grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
  grid-auto-rows: minmax(var(--row), auto);
  grid-auto-flow: dense;
  gap: var(--gap);
}

.spoken {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
