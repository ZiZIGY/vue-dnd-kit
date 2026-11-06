<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';
import Shelf from './Shelf.vue';

const reading = ref([
  { id: 'dune', title: 'Dune', hue: 32 },
  { id: 'emma', title: 'Emma', hue: 330 },
  { id: 'ulysses', title: 'Ulysses', hue: 210 },
]);
const wishlist = ref([
  { id: 'beloved', title: 'Beloved', hue: 140 },
  { id: 'solaris', title: 'Solaris', hue: 260 },
  { id: 'walden', title: 'Walden', hue: 90 },
]);

const dnd = useDnD();
/** Where the detached shelf renders: the popup's mount point, or nowhere (it stays here). */
const mount = shallowRef<HTMLElement | null>(null);
let popup: Window | null = null;
let release: (() => void) | null = null;

const attach = () => {
  release?.();
  release = null;
  mount.value = null;
  popup = null;
};

const detach = () => {
  popup = window.open('', 'wishlist', 'popup,width=360,height=420');
  if (!popup) return;
  const doc = popup.document;
  doc.title = 'Wishlist';
  // A popup has no styles of its own: it gets the page's, as they are now.
  for (const node of document.querySelectorAll('style, link[rel="stylesheet"]')) {
    doc.head.appendChild(node.cloneNode(true));
  }
  doc.body.innerHTML = '';
  doc.body.style.margin = '16px';
  const target = doc.createElement('div');
  doc.body.appendChild(target);
  // The shelf moves there with a teleport, without being mounted again: the provider has
  // to be told about the window.
  release = dnd.addWindow(popup);
  popup.addEventListener('pagehide', attach);
  mount.value = target;
};

const bringBack = () => {
  const opened = popup;
  attach();
  opened?.close();
};

onBeforeUnmount(bringBack);
</script>

<template>
  <div class="library">
    <Shelf id="reading" v-model="reading" title="Reading" />
    <div class="slot">
      <Teleport :to="mount" :disabled="!mount">
        <Shelf id="wishlist" v-model="wishlist" title="Wishlist" />
      </Teleport>
      <p v-if="mount" class="away">The wishlist is in its own window. Sort it there.</p>
      <button type="button" @click="mount ? bringBack() : detach()">
        {{ mount ? 'Bring it back' : 'Open in a window' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.library {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 220px));
  justify-content: center;
  gap: 16px;
}

.slot {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.away {
  min-height: 148px;
  margin: 0;
  padding: 14px;
  border: 1px dashed color-mix(in srgb, currentColor 20%, transparent);
  border-radius: 12px;
  font-size: 13px;
  opacity: 0.7;
}

button {
  align-self: center;
  padding: 6px 14px;
  border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
  border-radius: 8px;
  background: Canvas;
  color: inherit;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

button:hover {
  border-color: color-mix(in srgb, #42b883 60%, transparent);
}
</style>
