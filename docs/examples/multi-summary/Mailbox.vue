<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeDroppable, makeSortableList, snapCenterToCursor, useDnD, type DnDEvent } from '@vue-dnd-kit/core';
import MailRow from './MailRow.vue';
import MailOverlay from './MailOverlay.vue';

const mails = ref([
  { id: 'm1', from: 'Maya Chen', subject: 'Design review at 3' },
  { id: 'm2', from: 'Airline', subject: 'Your boarding pass' },
  { id: 'm3', from: 'Leo Park', subject: 'The build is green' },
  { id: 'm4', from: 'Hotel Aurora', subject: 'Booking confirmed' },
  { id: 'm5', from: 'Nora Kim', subject: 'Slides for the demo' },
]);
const done = ref({ archive: 0, trash: 0 });

const list = useTemplateRef<HTMLElement>('list');
// Every drag of the list shows MailOverlay: one summary for one or many mails. The box is
// centered on the pointer (`snapCenterToCursor`), and the summary hangs off its middle.
const { items } = makeSortableList(list, { items: mails, overlay: MailOverlay, modifiers: [snapCenterToCursor] });

const { selection } = useDnD();
selection.set(['m2', 'm4']);

// The zones take the mails out of the inbox: `source.remove()` drops them from the list.
const into = (zone: 'archive' | 'trash') => (event: DnDEvent) => {
  done.value[zone] += event.active.ids.length;
  event.source?.remove();
  selection.clear();
};
const archive = useTemplateRef<HTMLElement>('archive');
const trash = useTemplateRef<HTMLElement>('trash');
const { isOver: overArchive } = makeDroppable(archive, { id: 'Archive', onDrop: into('archive') });
const { isOver: overTrash } = makeDroppable(trash, { id: 'Trash', onDrop: into('trash') });
</script>

<template>
  <div class="mailbox">
    <div class="zones">
      <div ref="archive" class="zone" :class="{ over: overArchive }">
        Archive <span>{{ done.archive }}</span>
      </div>
      <div ref="trash" class="zone danger" :class="{ over: overTrash }">
        Trash <span>{{ done.trash }}</span>
      </div>
    </div>
    <ul ref="list" class="mails">
      <MailRow v-for="mail in items" :key="mail.id" :mail="mail" />
    </ul>
    <p v-if="!mails.length" class="empty">Inbox zero</p>
  </div>
</template>

<style scoped>
.mailbox {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: min(100%, 380px);
  margin: 0 auto;
}

.zones {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.zone {
  --tone: #42b883;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border: 1.5px dashed color-mix(in srgb, currentColor 18%, transparent);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  transition:
    border-color 0.15s,
    background-color 0.15s;
}

.zone.danger {
  --tone: #ef4444;
}

.zone.over {
  border-color: var(--tone);
  background: color-mix(in srgb, var(--tone) 10%, transparent);
}

.zone span {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.6;
}

.mails {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 4px;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 12px;
  list-style: none;
}

.empty {
  margin: 0;
  font-size: 12px;
  text-align: center;
  opacity: 0.5;
}
</style>
