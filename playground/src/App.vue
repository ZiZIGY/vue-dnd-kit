<script setup lang="ts">
  import { ref } from 'vue';
  import { TransitionGroup } from 'vue';
  import { DnDProvider } from '../../packages/core/src/external/index';
  import type { IDragEvent } from '../../packages/core/src/external/types';
  import Draggable from './components/Draggable.vue';
  import Overlay from './components/Overlay.vue';
  import Droppable from './components/Droppable.vue';

  interface Item {
    id: string;
    label: string;
  }

  // ── Section 1: Sort & Transfer ────────────────────────────────────────────────
  const sortA = ref<Item[]>([
    { id: 's-a1', label: 'A1' },
    { id: 's-a2', label: 'A2' },
    { id: 's-a3', label: 'A3' },
  ]);
  const sortB = ref<Item[]>([
    { id: 's-b1', label: 'B1' },
    { id: 's-b2', label: 'B2' },
  ]);

  // ── Section 2: Swap ───────────────────────────────────────────────────────────
  const swapA = ref<Item[]>([
    { id: 'sw-a1', label: 'X1' },
    { id: 'sw-a2', label: 'X2' },
    { id: 'sw-a3', label: 'X3' },
  ]);
  const swapB = ref<Item[]>([
    { id: 'sw-b1', label: 'Y1' },
    { id: 'sw-b2', label: 'Y2' },
  ]);

  // ── Section 3: Copy (Ctrl) or Sort ────────────────────────────────────────────
  const copyA = ref<Item[]>([
    { id: 'c-a1', label: 'P1' },
    { id: 'c-a2', label: 'P2' },
    { id: 'c-a3', label: 'P3' },
  ]);
  const copyB = ref<Item[]>([
    { id: 'c-b1', label: 'Q1' },
    { id: 'c-b2', label: 'Q2' },
  ]);

  // ─────────────────────────────────────────────────────────────────────────────
  // SECTION 1 — Sort / Transfer
  //
  // Pattern:
  //   hoveredDraggable → suggestSort inserts before/after that element's list
  //   no hoveredDraggable → suggestSort appends to zone start/end
  //
  // Source identity:  e.draggables[0].items  (before modification)
  // Target identity:  e.hoveredDraggable?.items ?? e.dropZone?.items
  // ─────────────────────────────────────────────────────────────────────────────
  function handleSort(e: IDragEvent) {
    const r = e.helpers.suggestSort('vertical');
    if (!r) return;

    // Identify source ref by array identity (O(1), no search)
    const srcItems = e.draggables[0]?.items;
    if (srcItems === sortA.value) sortA.value = r.sourceItems as Item[];
    else if (srcItems === sortB.value) sortB.value = r.sourceItems as Item[];

    if (!r.sameList) {
      // Target: hoveredDraggable.items when hovering, dropZone.items otherwise
      const tgtItems = e.hoveredDraggable?.items ?? e.dropZone?.items;
      if (tgtItems === sortA.value) sortA.value = r.targetItems as Item[];
      else if (tgtItems === sortB.value) sortB.value = r.targetItems as Item[];
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SECTION 2 — Swap
  //
  // Pattern:
  //   hoveredDraggable → swap dragged item(s) with hovered element
  //   no hoveredDraggable → no-op (swap requires a target element)
  //
  // Single drag: true positional swap (A↔B).
  // Multi drag: group exchange — dragged group ↔ hovered item.
  // Target always resolves from hoveredDraggable.items (not dropZone.items).
  // ─────────────────────────────────────────────────────────────────────────────
  function handleSwap(e: IDragEvent) {
    if (!e.hoveredDraggable) return;

    const r = e.helpers.suggestSwap();
    if (!r) return;

    const srcItems = e.draggables[0]?.items;
    if (srcItems === swapA.value) swapA.value = r.sourceItems as Item[];
    else if (srcItems === swapB.value) swapB.value = r.sourceItems as Item[];

    if (!r.sameList) {
      // hoveredDraggable.items is always the swap target
      const tgtItems = e.hoveredDraggable.items;
      if (tgtItems === swapA.value) swapA.value = r.targetItems as Item[];
      else if (tgtItems === swapB.value) swapB.value = r.targetItems as Item[];
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SECTION 3 — Copy (Alt held) or Sort
  //
  // Pattern:
  //   hoveredDraggable + Alt → copy into hoveredDraggable.items at that position
  //   hoveredDraggable       → sort / transfer (insert before/after)
  //   no hoveredDraggable + Alt → copy to zone edge
  //   no hoveredDraggable       → sort / transfer to zone edge
  // ─────────────────────────────────────────────────────────────────────────────
  function handleCopyOrSort(e: IDragEvent) {
    const isAlt = e.provider.keyboard.keys.pressedKeys.value.has('AltLeft');

    if (isAlt) {
      // ── Copy: source unchanged, target gets shallow copies ─────────────────
      const r = e.helpers.suggestCopy('vertical');
      if (!r) return;

      const tgtItems = e.hoveredDraggable?.items ?? e.dropZone?.items;
      if (tgtItems === copyA.value) copyA.value = r.targetItems as Item[];
      else if (tgtItems === copyB.value) copyB.value = r.targetItems as Item[];
    } else {
      // ── Sort / Transfer ────────────────────────────────────────────────────
      const r = e.helpers.suggestSort('vertical');
      if (!r) return;

      const srcItems = e.draggables[0]?.items;
      if (srcItems === copyA.value) copyA.value = r.sourceItems as Item[];
      else if (srcItems === copyB.value) copyB.value = r.sourceItems as Item[];

      if (!r.sameList) {
        const tgtItems = e.hoveredDraggable?.items ?? e.dropZone?.items;
        if (tgtItems === copyA.value) copyA.value = r.targetItems as Item[];
        else if (tgtItems === copyB.value) copyB.value = r.targetItems as Item[];
      }
    }
  }
</script>

<template>
  <DnDProvider overlay-to="body">
    <div class="playground">
      <h1>Vue DnD Kit — Playground</h1>

      <!-- ── Section 1: Sort & Transfer ────────────────────────────────────── -->
      <section>
        <h2>Sort & Transfer <code>suggestSort()</code></h2>
        <p>Drag within a list to reorder. Drag across lists to transfer.</p>
        <div class="zones">
          <Droppable
            :items="sortA"
            @drop="handleSort"
          >
            <TransitionGroup
              name="list"
              tag="div"
              class="zone-list"
            >
              <Draggable
                v-for="(item, index) in sortA"
                :key="item.id"
                :index="index"
                :items="sortA"
                class="card"
              >
                {{ item.label }}
              </Draggable>
            </TransitionGroup>
          </Droppable>

          <Droppable
            :items="sortB"
            @drop="handleSort"
          >
            <TransitionGroup
              name="list"
              tag="div"
              class="zone-list"
            >
              <Draggable
                v-for="(item, index) in sortB"
                :key="item.id"
                :index="index"
                :items="sortB"
                class="card card--green"
              >
                {{ item.label }}
              </Draggable>
            </TransitionGroup>
          </Droppable>
        </div>
      </section>

      <!-- ── Section 2: Swap ────────────────────────────────────────────────── -->
      <section>
        <h2>Swap <code>suggestSwap()</code></h2>
        <p
          >Hover over an element to swap positions. Dropping on empty zone does
          nothing.</p
        >
        <div class="zones">
          <Droppable
            :items="swapA"
            @drop="handleSwap"
          >
            <TransitionGroup
              name="list"
              tag="div"
              class="zone-list"
            >
              <Draggable
                v-for="(item, index) in swapA"
                :key="item.id"
                :index="index"
                :items="swapA"
                class="card card--purple"
              >
                {{ item.label }}
              </Draggable>
            </TransitionGroup>
          </Droppable>

          <Droppable
            :items="swapB"
            @drop="handleSwap"
          >
            <TransitionGroup
              name="list"
              tag="div"
              class="zone-list"
            >
              <Draggable
                v-for="(item, index) in swapB"
                :key="item.id"
                :index="index"
                :items="swapB"
                class="card card--purple"
              >
                {{ item.label }}
              </Draggable>
            </TransitionGroup>
          </Droppable>
        </div>
      </section>

      <!-- ── Section 3: Copy or Sort ───────────────────────────────────────── -->
      <section>
        <h2
          >Copy / Sort <code>suggestCopy()</code> +
          <code>suggestSort()</code></h2
        >
        <p
          >Hold <kbd>Ctrl</kbd> while dropping to copy. Release to
          sort/transfer.</p
        >
        <div class="zones">
          <Droppable
            :items="copyA"
            @drop="handleCopyOrSort"
          >
            <TransitionGroup
              name="list"
              tag="div"
              class="zone-list"
            >
              <Draggable
                v-for="(item, index) in copyA"
                :key="item.id"
                :index="index"
                :items="copyA"
                class="card card--orange"
              >
                {{ item.label }}
              </Draggable>
            </TransitionGroup>
          </Droppable>

          <Droppable
            :items="copyB"
            @drop="handleCopyOrSort"
          >
            <TransitionGroup
              name="list"
              tag="div"
              class="zone-list"
            >
              <Draggable
                v-for="(item, index) in copyB"
                :key="item.id"
                :index="index"
                :items="copyB"
                class="card card--orange"
              >
                {{ item.label }}
              </Draggable>
            </TransitionGroup>
          </Droppable>
        </div>
      </section>
    </div>

    <template #overlay>
      <Overlay />
    </template>
  </DnDProvider>
</template>

<style>
  body {
    background: #f0f0f0;
    height: 200svh;
  }
  .playground {
    padding: 2rem;
    max-width: 60rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }
  h1 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  h2 {
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }
  p {
    color: #666;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }
  code {
    background: #eee;
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-size: 0.85em;
  }
  kbd {
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0.1em 0.4em;
    font-size: 0.85em;
  }
  .zones {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }
  .zones .droppable {
    min-width: 180px;
    flex: 1;
  }
  .zone-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-height: 60px;
  }
  .card {
    padding: 0.75rem 1rem;
    background: #3b82f6;
    color: #fff;
    border-radius: 8px;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .card--green {
    background: #22c55e;
  }
  .card--purple {
    background: #a855f7;
  }
  .card--orange {
    background: #f97316;
  }
  .list-move,
  .list-enter-active,
  .list-leave-active {
    transition: transform 0.2s ease, opacity 0.2s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(-6px);
  }
  .list-leave-active {
    position: absolute;
  }
</style>
