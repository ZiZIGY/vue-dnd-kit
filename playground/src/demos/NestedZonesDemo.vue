<script setup lang="ts">
  import { computed, provide, reactive, shallowRef } from 'vue';
  import { useDnD, useDnDMonitor } from '@vue-dnd-kit/core';
  import NestedZone from '../components/NestedZone.vue';
  import NestedPiece from '../components/NestedPiece.vue';
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
      <NestedPiece
        v-for="piece in inTray"
        :key="piece.id"
        :piece="piece"
      />
    </div>
    <div class="nested-layout">
      <NestedZone
        id="outer"
        label="Board: accepts anything"
      >
        <div class="nz-zone-row">
          <NestedZone
            id="red"
            label="Red only"
            accept="red"
          />
          <NestedZone
            id="inner"
            label="Inner"
          >
            <NestedZone
              id="deep"
              label="Deep"
            />
          </NestedZone>
        </div>
        <NestedZone
          id="catch"
          label="Priority 1: beats its child"
          :priority="1"
        >
          <NestedZone
            id="shadowed"
            label="Child, priority 0"
          />
        </NestedZone>
      </NestedZone>
      <div>
        <h3>Scrollable shelf</h3>
        <div
          class="shelf"
          data-testid="shelf"
        >
          <NestedZone
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
    color: var(--ui-text-muted);
  }

  .tray {
    display: flex;
    gap: 12px;
    min-height: 52px;
    padding: 8px;
    margin-bottom: 16px;
    background: var(--ui-bg-muted);
    border-radius: var(--ui-radius-lg);
    box-shadow: inset 0 0 0 1px var(--ui-border);
    width: 520px;
  }

  /* Game pieces: their hue is what they are. */
  .nz-piece {
    width: 48px;
    height: 32px;
    display: grid;
    place-items: center;
    border-radius: var(--ui-radius);
    color: #fff;
    font-family: var(--font-mono);
    font-weight: 600;
    cursor: grab;
    user-select: none;
  }

  .nz-piece.red {
    background: #dc2626;
  }

  .nz-piece.blue {
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

  .nz-zone {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 8px 12px 12px;
    min-height: 72px;
    background: color-mix(in srgb, var(--ui-bg) 60%, transparent);
    border: 2px dashed var(--ui-border-strong);
    border-radius: var(--ui-radius-lg);
  }

  .nz-zone[data-over='accepted'] {
    border-color: var(--ui-primary);
    background: var(--ui-primary-soft);
  }

  .nz-zone[data-over='rejected'] {
    border-color: var(--ui-danger);
    background: var(--ui-danger-soft);
  }

  .nz-zone-label {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--ui-text-muted);
  }

  .nz-zone-pieces {
    display: flex;
    gap: 8px;
  }

  .nz-zone-row {
    display: flex;
    gap: 24px;
  }

  .nz-zone-row > .nz-zone {
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
    background: var(--ui-bg-muted);
    border-radius: var(--ui-radius-lg);
    box-shadow: inset 0 0 0 1px var(--ui-border);
  }

  .shelf > .nz-zone {
    flex: none;
    height: 80px;
    min-height: 0;
  }
</style>
