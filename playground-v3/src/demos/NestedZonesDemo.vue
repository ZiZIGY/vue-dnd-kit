<script setup lang="ts">
  import { computed, provide, reactive, shallowRef } from 'vue';
  import { useDnD, useDnDMonitor } from '@vue-dnd-kit/core';
  import DropZone from '../components/DropZone.vue';
  import FreePiece from '../components/FreePiece.vue';
  import { ZONE_STORE, type Piece, type ZoneStore } from '../components/zones';

  const pieces: Piece[] = [
    { id: 'r1', color: 'red' },
    { id: 'b1', color: 'blue' },
  ];
  const store: ZoneStore = reactive({
    pieces,
    location: Object.fromEntries(pieces.map((piece) => [piece.id, 'tray'])),
  });
  provide(ZONE_STORE, store);
  const inTray = computed(() => pieces.filter((piece) => store.location[piece.id] === 'tray'));

  // Readouts for e2e/targeting.spec.ts.
  const { over } = useDnD();
  const overText = computed(() =>
    over.value ? `${over.value.id}:${over.value.accepted ? 'accepted' : 'rejected'}` : '-',
  );
  const overTop = computed(() => (over.value ? String(Math.round(over.value.rect.top)) : '-'));
  const log = shallowRef('-');
  useDnDMonitor({
    onDragEnd: ({ active, over: target }) => (log.value = `drop ${active.id} -> ${target?.id ?? 'none'}`),
    onDragCancel: ({ active }) => (log.value = `cancel ${active.id}`),
  });
</script>

<template>
  <section class="nested-demo">
    <h2>Nested zones</h2>
    <p>
      The deepest zone under the pointer wins; a higher <code>priority</code> beats depth. Red pieces only fit
      the red zone; dropping elsewhere rejects with a return. In the gap between nested zones the last zone stays
      the target.
    </p>
    <div
      class="tray"
      data-testid="tray"
    >
      <FreePiece
        v-for="piece in inTray"
        :key="piece.id"
        :piece="piece"
      />
    </div>
    <div class="nested-layout">
      <DropZone
        id="outer"
        label="Board: accepts anything"
      >
        <div class="zone-row">
          <DropZone
            id="red"
            label="Red only"
            accept="red"
          />
          <DropZone
            id="inner"
            label="Inner"
          >
            <DropZone
              id="deep"
              label="Deep"
            />
          </DropZone>
        </div>
        <DropZone
          id="catch"
          label="Priority 1: beats its child"
          :priority="1"
        >
          <DropZone
            id="shadowed"
            label="Child, priority 0"
          />
        </DropZone>
      </DropZone>
      <div>
        <h3>Scrollable shelf</h3>
        <div
          class="shelf"
          data-testid="shelf"
        >
          <DropZone
            v-for="n in 8"
            :id="`slot-${n}`"
            :key="n"
            :label="`Slot ${n}`"
          />
        </div>
      </div>
    </div>
    <pre data-testid="over">{{ overText }}</pre>
    <pre data-testid="over-top">{{ overTop }}</pre>
    <pre data-testid="log">{{ log }}</pre>
  </section>
</template>

<style>
  .nested-demo p {
    max-width: 760px;
    color: #4b5563;
  }

  .tray {
    display: flex;
    gap: 12px;
    min-height: 52px;
    padding: 8px;
    margin-bottom: 16px;
    background: #e5e7eb;
    border-radius: 8px;
    width: 520px;
  }

  .piece {
    width: 48px;
    height: 32px;
    display: grid;
    place-items: center;
    border-radius: 6px;
    color: #fff;
    font-weight: 600;
    cursor: grab;
    user-select: none;
  }

  .piece.red {
    background: #dc2626;
  }

  .piece.blue {
    background: #2563eb;
  }

  .nested-layout {
    display: flex;
    gap: 32px;
    align-items: flex-start;
  }

  .nested-layout h3 {
    margin: 0 0 8px;
  }

  .zone {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 8px 12px 12px;
    min-height: 72px;
    background: rgb(255 255 255 / 0.6);
    border: 2px dashed #9ca3af;
    border-radius: 8px;
  }

  .zone[data-over='accepted'] {
    border-color: #16a34a;
    background: #dcfce7;
  }

  .zone[data-over='rejected'] {
    border-color: #dc2626;
    background: #fee2e2;
  }

  .zone-label {
    font-size: 12px;
    color: #4b5563;
  }

  .zone-pieces {
    display: flex;
    gap: 8px;
  }

  .zone-row {
    display: flex;
    gap: 24px;
  }

  .zone-row > .zone {
    flex: 1;
    min-height: 120px;
  }

  [data-testid='zone-outer'] {
    width: 520px;
    padding-top: 24px;
  }

  .shelf {
    width: 220px;
    height: 200px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: #e5e7eb;
    border-radius: 8px;
  }

  .shelf > .zone {
    flex: none;
    height: 80px;
    min-height: 0;
  }
</style>
