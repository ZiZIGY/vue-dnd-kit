<script setup lang="ts">
  /**
   * Driving a drag: choose an item (in the map, the tree, or on the page), push the
   * joystick and it is picked up and steered as a pointer drag (lists sort under it,
   * containers auto-scroll at their edges); drop or cancel. Items of lists also move by
   * buttons, as keyboard drags. Below, what the overlay shows.
   */
  import { computed } from 'vue';
  import type { MoveTo } from '../../src/protocol';
  import { send, store } from '../utils/connection';
  import { cancel, chosen, drop, grab, running, togglePick, vector } from '../utils/drive';
  import DragPreview from './DragPreview.vue';
  import Joystick from './Joystick.vue';

  const provider = computed(() => store.providers.find((entry) => entry.id === chosen.value?.provider) ?? null);
  const item = computed(() => provider.value?.draggables.find((entry) => entry.id === chosen.value?.id) ?? null);
  /** The other lists of the item's group: where it can move to. */
  const lists = computed(() => {
    const own = provider.value?.lists.find((list) => list.id === item.value?.list);
    return own?.kind === 'list' ? (provider.value?.lists.filter((list) => list.kind === 'list' && list.group === own.group) ?? []) : [];
  });

  const move = (to: MoveTo) => {
    if (chosen.value) send({ type: 'move', provider: chosen.value.provider, id: chosen.value.id, to });
  };

  /** To the end of the list picked in the select (its value is the list's id as text). */
  const moveTo = (event: Event) => {
    const select = event.target as HTMLSelectElement;
    const list = lists.value.find((entry) => String(entry.id) === select.value);
    select.value = '';
    if (list) move({ list: list.id });
  };

  const status = computed(() => {
    const session = running.value;
    if (!session) return null;
    const over = session.over ? `over ${String(session.over.id)} (${session.over.accepted ? 'accepts' : 'refuses'})` : 'over nothing';
    return `${session.status} ${session.active ? String(session.active.id) : ''} · ${over}`;
  });
</script>

<template>
  <div class="panel">
    <div class="target">
      <template v-if="item">
        <span class="mute">Item</span>
        <strong class="mono" data-testid="chosen-item">{{ String(item.id) }}</strong>
        <span v-if="item.list != null" class="chip">in {{ String(item.list) }}</span>
        <span v-if="item.disabled" class="chip">disabled</span>
      </template>
      <span v-else class="mute">Choose an item: click it in the map or the tree, or pick it on the page.</span>
    </div>

    <div class="pad">
      <Joystick v-model="vector" :disabled="!item && !running" />
      <div class="buttons">
        <button class="btn" :disabled="!item || !!running" title="Pick the item up (G)" data-testid="grab" @click="grab">Grab</button>
        <button class="btn primary" :disabled="!running" title="Drop (Space, Enter)" data-testid="drop" @click="drop">Drop</button>
        <button class="btn" :disabled="!running" title="Cancel (Esc)" data-testid="cancel" @click="cancel">Cancel</button>
        <button class="btn" :class="{ on: store.picking }" title="Pick an item on the page (P)" data-testid="pick" @click="togglePick">
          {{ store.picking ? 'Picking…' : 'Pick on page' }}
        </button>
      </div>
    </div>
    <p class="status mono" data-testid="drag-status">{{ status ?? 'No drag' }}</p>

    <template v-if="item && item.list != null && lists.length">
      <div class="section-title">Move (a keyboard drag)</div>
      <div class="moves">
        <button class="btn" title="Up one place" @click="move('up')">↑</button>
        <button class="btn" title="Down one place" @click="move('down')">↓</button>
        <button class="btn" title="To the start" @click="move('start')">⤒</button>
        <button class="btn" title="To the end" @click="move('end')">⤓</button>
        <select v-if="lists.length > 1" title="To the end of another list" @change="moveTo">
          <option value="">to list…</option>
          <option v-for="list in lists.filter((entry) => entry.id !== item?.list)" :key="String(list.id)" :value="String(list.id)">
            {{ String(list.id) }}
          </option>
        </select>
      </div>
    </template>

    <div class="section-title">Overlay</div>
    <DragPreview />

    <div class="section-title">Keys</div>
    <p class="keys mute">
      <kbd>←↑→↓</kbd>/<kbd>WASD</kbd> steer (<kbd>Shift</kbd> fast) · <kbd>Space</kbd> drop · <kbd>Esc</kbd> cancel ·
      <kbd>G</kbd> grab · <kbd>P</kbd> pick on page
    </p>
  </div>
</template>

<style scoped>
  .panel {
    padding: 8px 10px;
    overflow: auto;
    height: 100%;
  }

  .target {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    min-height: 20px;
  }

  .pad {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
  }

  .buttons {
    display: grid;
    gap: 4px;
  }

  .status {
    margin: 6px 0 0;
    color: var(--text-soft);
  }

  .moves {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }

  .keys {
    margin: 0;
    line-height: 1.9;
  }
</style>
