<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { makeDroppable, makeSortableList, useDnD, useDnDMonitor } from '@vue-dnd-kit/core';
import Tile from './Tile.vue';
import { fromOutside, seed, type Card } from './cards';

const cards = ref<Card[]>(seed());
const notice = ref('');

const grid = useTemplateRef<HTMLElement>('grid');
// Images, links and text from other apps come in with `createItem` (asked while they are
// held, then at the drop with the data). Cards of this page in another window come in
// as themselves: same group.
const { items, isOver, isAccepting } = makeSortableList(grid, {
  items: cards,
  group: 'moodboard',
  strategy: 'grid',
  label: 'Moodboard',
  external: { files: 'image/*', links: true, text: true },
  createItem: fromOutside,
  onDrop: (e) => {
    if (e.external && !e.external.group) notice.value = `Added ${e.items.length === 1 ? 'a card' : `${e.items.length} cards`} from outside the page`;
    else if (e.external?.group) notice.value = 'Moved in from the other window';
  },
});

// A card dragged out: what the place it went to did with it.
useDnDMonitor({
  onDragEnd: (event) => {
    if (event.droppedOutside === 'move') notice.value = 'Moved out: to the other window';
    else if (event.droppedOutside) notice.value = 'Copied to another app';
  },
});

// Something from outside the page that the board takes is held over it.
const { active } = useDnD();
const taking = computed(() => isOver.value && isAccepting.value && !!active.value?.external);

const trash = useTemplateRef<HTMLElement>('trash');
const { isOver: overTrash } = makeDroppable(trash, {
  label: 'Trash',
  accept: 'moodboard',
  onDrop: (e) => e.source?.remove(),
});

const openWindow = () => window.open(location.href, 'moodboard', 'popup,width=760,height=640');
</script>

<template>
  <div class="board" :class="{ taking }">
    <header>
      <div>
        <h4>Moodboard</h4>
        <p>Drop images, links or text from other apps. Drag a card out to another app, or to this page in a second window.</p>
      </div>
      <button type="button" class="open" @click="openWindow">Open a second window</button>
    </header>
    <ul ref="grid" class="grid">
      <Tile v-for="card in items" :key="card.id" :card="card" />
    </ul>
    <footer>
      <span class="notice" aria-live="polite">{{ notice }}</span>
      <div ref="trash" class="trash" :class="{ over: overTrash }">Trash</div>
    </footer>
  </div>
</template>

<style scoped>
.board {
  box-sizing: border-box;
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 14px;
  border: 1.5px dashed transparent;
  border-radius: 18px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  transition: border-color 0.15s;
}

/* Something from outside the page that it takes is held over it. */
.board.taking {
  border-color: #42b883;
}

header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

h4 {
  margin: 0 0 4px;
  font-size: 15px;
}

header p {
  margin: 0;
  font-size: 12px;
  opacity: 0.65;
}

.open {
  flex: none;
  height: 30px;
  padding: 0 12px;
  border: 1px solid color-mix(in srgb, currentColor 16%, transparent);
  border-radius: 8px;
  background: Canvas;
  color: inherit;
  font: 500 12px/1 system-ui, sans-serif;
  cursor: pointer;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  grid-auto-rows: 120px;
  gap: 10px;
  min-height: 120px;
  margin: 0;
  padding: 0;
  list-style: none;
}

footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
}

.notice {
  font-size: 12px;
  opacity: 0.7;
}

.trash {
  padding: 8px 16px;
  border: 1.5px dashed color-mix(in srgb, currentColor 22%, transparent);
  border-radius: 10px;
  font-size: 12px;
  opacity: 0.7;
}

.trash.over {
  border-color: #ef4444;
  color: #ef4444;
  opacity: 1;
}
</style>
