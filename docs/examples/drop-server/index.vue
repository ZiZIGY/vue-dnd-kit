<script setup lang="ts">
import { DnDProvider, DragPreview } from '@vue-dnd-kit/core';
import Column from './Column.vue';
import { mode, requests, saving, type ServerMode } from './server';

const MODES: ServerMode[] = ['reliable', 'flaky', 'down'];
</script>

<template>
  <DnDProvider>
    <div class="demo">
      <fieldset class="modes">
        <legend>server</legend>
        <label v-for="value in MODES" :key="value" :class="{ on: mode === value }">
          <input v-model="mode" type="radio" :value="value" />
          {{ value }}
        </label>
      </fieldset>
      <div class="board">
        <Column id="backlog" title="Backlog" />
        <Column id="sprint" title="Sprint" />
      </div>
      <ol class="requests" aria-label="Requests">
        <li v-for="request in requests" :key="request.id" :class="`status-${request.status}`">
          {{ request.text }} <span>{{ request.status === 'pending' ? '…' : request.status }}</span>
        </li>
        <li v-if="!requests.length" class="empty">No requests yet</li>
      </ol>
    </div>

    <!-- The overlay of every drag: the card's copy, and a badge while the server answers. -->
    <template #overlay="{ active }">
      <div class="carried">
        <DragPreview :id="active.id" />
        <span v-if="saving" class="saving">Saving…</span>
      </div>
    </template>
  </DnDProvider>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.modes {
  display: inline-flex;
  margin: 0;
  padding: 3px;
  border: 0;
  border-radius: 9px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

legend {
  float: left;
  align-self: center;
  padding: 0 8px 0 6px;
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}

.modes label {
  padding: 5px 10px;
  border-radius: 6px;
  font: 12px/1.2 ui-monospace, Menlo, Consolas, monospace;
  cursor: pointer;
}

.modes label.on {
  background: Canvas;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
  font-weight: 600;
}

.modes label:has(input:focus-visible) {
  outline: 2px solid #42b883;
}

.modes input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.board {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 220px));
  gap: 14px;
  justify-content: center;
  width: 100%;
}

.requests {
  width: min(100%, 454px);
  min-height: 60px;
  margin: 0;
  padding: 8px 12px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 5%, transparent);
  font: 11px/1.6 ui-monospace, Menlo, Consolas, monospace;
  list-style: none;
  white-space: pre;
  overflow-x: auto;
}

.requests li + li {
  opacity: 0.55;
}

.requests .status-200 span {
  color: #42b883;
}

.requests .status-503 span {
  color: #e5484d;
}

.requests li.empty {
  color: inherit;
  opacity: 0.45;
}

.carried {
  position: relative;
  width: 100%;
  height: 100%;
}

.saving {
  position: absolute;
  top: 50%;
  right: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  translate: 0 -50%;
  padding: 4px 8px;
  border-radius: 99px;
  background: #42b883;
  color: #fff;
  font: 600 11px/1 system-ui, sans-serif;
}

.saving::before {
  content: '';
  width: 9px;
  height: 9px;
  border: 2px solid rgb(255 255 255 / 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    rotate: 1turn;
  }
}
</style>
