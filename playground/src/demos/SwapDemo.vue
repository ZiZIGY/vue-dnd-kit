<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { DnDProvider, type DragItem, type SortableDropEvent, type SortablePutContext } from '@vue-dnd-kit/core';
  import DemoList from '../components/DemoList.vue';
  import OverlayCard from '../components/OverlayCard.vue';
  import { describeLists, makeTasks } from '../data';
  import type { Task } from '../types';

  const list = reactive({ id: 'swap-list', title: 'Swap list', tasks: makeTasks('s', 6) });
  const grid = reactive({ id: 'swap-grid', title: 'Swap grid', tasks: makeTasks('w', 8) });
  // Two swap lists of one group exchange items. Each refuses the other's last item, which
  // therefore never swaps across: the partner enters the dragged item's list, so put
  // rules count in both directions.
  const left = reactive({
    id: 'swap-left',
    title: 'Left',
    tasks: [...makeTasks('l', 3), { id: 'l4', title: 'L4 stays left', type: 'left-only' }],
  });
  const right = reactive({
    id: 'swap-right',
    title: 'Right',
    tasks: [...makeTasks('r', 3), { id: 'r4', title: 'R4 stays right', type: 'right-only' }],
  });
  const refuse =
    (type: string) =>
    ({ types }: SortablePutContext) =>
      !types.includes(type);

  const reject = ref(false);
  const last = ref('');
  const record = ({ mode, keys, from, to, partner }: SortableDropEvent<Task>) => {
    const spot = (at: { list: unknown; index: number }) => `${String(at.list)}@${at.index}`;
    last.value = `${mode} ${keys.join(',')} ${spot(from)}>${spot(to)}`;
    if (partner) last.value += ` | ${partner.key} ${spot(partner.from)}>${spot(partner.to)}`;
  };
  const pair = (refused: string) => ({
    behavior: 'swap' as const,
    group: { name: 'swap-pair', put: refuse(refused) },
    onBeforeDrop: () => !reject.value,
    onDrop: record,
  });

  const titles = (items: DragItem[]) => items.map((entry) => (entry.item as Task | undefined)?.title ?? String(entry.id));
</script>

<template>
  <!-- A provider of its own, to show the overlay slot with `mode`. -->
  <DnDProvider>
    <div class="demo-row">
      <section>
        <h2>Swap list</h2>
        <DemoList
          :list="list"
          :options="{ behavior: 'swap', onDrop: record }"
          selectable
        />
      </section>
      <section>
        <h2>Swap grid</h2>
        <DemoList
          class="grid"
          :list="grid"
          :options="{ behavior: 'swap', strategy: 'grid' }"
        />
      </section>
    </div>
    <h2>Between two lists</h2>
    <p>
      Both lists swap and share a group: hovering an item of the other list exchanges the two, moving off it reverts.
      L4 and R4 stay on their side: each list's <code>group.put</code> refuses the other one's.
      <label>
        <input
          v-model="reject"
          type="checkbox"
          data-testid="reject-swaps"
        />
        Reject drops
      </label>
    </p>
    <div class="demo-row">
      <DemoList
        :list="left"
        :options="pair('right-only')"
        selectable
      />
      <DemoList
        :list="right"
        :options="pair('left-only')"
      />
    </div>
    <pre data-testid="swap-event">{{ last }}</pre>
    <pre data-testid="state">{{ describeLists([list, grid, left, right]) }}</pre>
    <template #overlay="{ items, mode, accepted }">
      <OverlayCard
        :titles="titles(items)"
        :mode="mode"
        :accepted="accepted"
      />
    </template>
  </DnDProvider>
</template>
