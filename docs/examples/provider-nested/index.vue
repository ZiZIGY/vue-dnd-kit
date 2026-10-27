<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import Shelf from './Shelf.vue';
import EventLog from './EventLog.vue';

const reading = ref([
  { id: 'dune', title: 'Dune', hue: 32 },
  { id: 'emma', title: 'Emma', hue: 330 },
  { id: 'ulysses', title: 'Ulysses', hue: 210 },
]);
const wishlist = ref([
  { id: 'beloved', title: 'Beloved', hue: 140 },
  { id: 'solaris', title: 'Solaris', hue: 260 },
]);

const separate = ref(false);
</script>

<template>
  <DnDProvider>
    <div class="demo">
      <div class="modes" role="radiogroup" aria-label="Wishlist">
        <label :class="{ on: !separate }"><input v-model="separate" type="radio" :value="false" />one provider</label>
        <label :class="{ on: separate }"><input v-model="separate" type="radio" :value="true" />wishlist in its own</label>
      </div>
      <div class="columns">
        <div class="column">
          <Shelf id="reading" v-model="reading" title="Reading" />
          <EventLog title="outer monitor" />
        </div>
        <!-- A provider inside a provider: its items belong to it, and drags never cross. -->
        <DnDProvider v-if="separate">
          <div class="column island">
            <span class="tag">&lt;DnDProvider&gt;</span>
            <Shelf id="wishlist" v-model="wishlist" title="Wishlist" />
            <EventLog title="inner monitor" />
          </div>
        </DnDProvider>
        <div v-else class="column">
          <Shelf id="wishlist" v-model="wishlist" title="Wishlist" />
        </div>
      </div>
    </div>
  </DnDProvider>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.modes {
  display: inline-flex;
  padding: 3px;
  border-radius: 9px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

.modes label {
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 12px;
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

.columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 230px));
  gap: 16px;
  max-width: 100%;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.island {
  position: relative;
  margin: -10px;
  padding: 10px;
  border: 1.5px dashed color-mix(in srgb, #42b883 60%, transparent);
  border-radius: 16px;
}

.tag {
  position: absolute;
  top: -9px;
  right: 14px;
  padding: 0 6px;
  background: Canvas;
  font: 10px/18px ui-monospace, Menlo, Consolas, monospace;
  color: #42b883;
}
</style>
