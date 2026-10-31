<script setup lang="ts">
  import { computed, ref, shallowRef, useTemplateRef } from 'vue';
  import {
    makeSelectionArea,
    makeSortableList,
    useDnD,
    type Key,
    type SelectionAreaOptions,
  } from '@vue-dnd-kit/core';
  import SelectableCard from '../components/SelectableCard.vue';
  import NestedSelectionArea from '../components/NestedSelectionArea.vue';

  const cards = ref(
    Array.from({ length: 24 }, (_, index) => ({ id: `c${index + 1}`, title: `Card ${index + 1}` })),
  );

  const strategy = shallowRef<'toggle' | 'select'>('toggle');
  const modifier = shallowRef<'none' | 'Shift'>('none');
  const lastSelected = shallowRef<Key[] | null>(null);
  const { selection, status } = useDnD();

  // The selected cards are also sortable items: dragging one of them drags them all.
  const listRef = useTemplateRef<HTMLElement>('list');
  const { items } = makeSortableList(listRef, { items: cards, id: 'cards', strategy: 'grid' });

  // Getters let the toolbar change the options of the live area.
  const options: SelectionAreaOptions = {
    get strategy() {
      return strategy.value;
    },
    get modifier() {
      return modifier.value === 'none' ? undefined : { keys: [modifier.value], method: 'every' as const };
    },
    onSelected: (ids) => (lastSelected.value = ids),
  };
  const areaRef = useTemplateRef<HTMLElement>('area');
  const { isSelecting, style } = makeSelectionArea(areaRef, options);

  const selectedCards = computed(() =>
    cards.value.filter((card) => selection.has(card.id)).map((card) => card.id),
  );
  // Stable output for the e2e: ids in natural order (c2 before c10).
  const sorted = (ids: Iterable<Key>) =>
    [...ids].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true })).join(',');
</script>

<template>
  <section>
    <h2>Selection</h2>
    <div class="toolbar">
      <label>
        Strategy
        <select
          v-model="strategy"
          data-testid="strategy"
        >
          <option value="toggle">toggle</option>
          <option value="select">select</option>
        </select>
      </label>
      <label>
        Modifier
        <select
          v-model="modifier"
          data-testid="modifier"
        >
          <option value="none">none</option>
          <option value="Shift">Shift</option>
        </select>
      </label>
      <button
        type="button"
        data-testid="clear"
        @click="selection.clear()"
      >
        Clear
      </button>
      <span data-testid="status">{{ status }}</span>
    </div>
    <div
      ref="area"
      class="selection-area"
      data-testid="area"
    >
      <ul
        ref="list"
        class="card-grid"
        data-testid="grid"
      >
        <SelectableCard
          v-for="card in items"
          :key="card.id"
          :card="card"
        />
      </ul>
      <NestedSelectionArea />
      <div
        v-if="isSelecting"
        class="selection-band"
        data-testid="band"
        :style="style"
      />
    </div>
    <pre data-testid="selected">{{ selectedCards.join(',') }}</pre>
    <pre data-testid="all-selected">{{ sorted(selection.ids) }}</pre>
    <pre data-testid="on-selected">{{ lastSelected ? sorted(lastSelected) : '' }}</pre>
    <pre data-testid="order">{{ cards.map((card) => card.id).join(',') }}</pre>
    <!-- Makes the page scrollable for the page-scroll test. -->
    <div class="page-spacer" />
  </section>
</template>
