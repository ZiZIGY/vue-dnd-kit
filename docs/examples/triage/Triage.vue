<script setup lang="ts">
import { reactive, ref, useTemplateRef } from 'vue';
import { makeDroppable, makeSortableList, useDnD, type DnDEvent } from '@vue-dnd-kit/core';
import NoticeRow from './NoticeRow.vue';
import { NOTICES, type Notice } from './notices';

const notices = ref<Notice[]>([...NOTICES]);
const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: notices });

const bins = reactive({ done: [] as Notice[], deleted: [] as Notice[] });
/** The last triage, for Undo. */
const last = ref<{ bin: keyof typeof bins; moved: Notice[]; index: number } | null>(null);

// A drag that starts in a sortable list carries `e.source`: `remove()` takes the dragged
// items out of that list. The zone keeps them.
const triage = (bin: keyof typeof bins) => (e: DnDEvent) => {
  const moved = e.active.items.map((entry) => entry.item as Notice);
  last.value = { bin, moved, index: notices.value.findIndex((notice) => notice.id === moved[0]?.id) };
  bins[bin].push(...moved);
  e.source?.remove();
};

const doneZone = useTemplateRef<HTMLElement>('doneZone');
const trashZone = useTemplateRef<HTMLElement>('trashZone');
const { isOver: overDone } = makeDroppable(doneZone, { id: 'done', onDrop: triage('done') });
const { isOver: overTrash } = makeDroppable(trashZone, { id: 'trash', onDrop: triage('deleted') });

const undo = () => {
  if (!last.value) return;
  const { bin, moved, index } = last.value;
  bins[bin] = bins[bin].filter((notice) => !moved.some((item) => item.id === notice.id));
  notices.value.splice(index, 0, ...moved);
  last.value = null;
};

const { active } = useDnD();
</script>

<template>
  <div class="triage">
    <section class="feed">
      <header>
        <span>Notifications</span>
        <span class="count">{{ notices.length }}</span>
      </header>
      <ul ref="list" class="rows">
        <NoticeRow v-for="notice in items" :key="notice.id" :notice="notice" />
      </ul>
      <p v-if="!notices.length" class="empty">Inbox zero</p>
      <p class="toast" :class="{ shown: last }">
        <template v-if="last">
          Moved to {{ last.bin === 'done' ? 'Done' : 'Trash' }}
          <button type="button" @click="undo">Undo</button>
        </template>
      </p>
    </section>

    <div class="zones" :class="{ ready: active }">
      <div ref="doneZone" class="zone done" :class="{ over: overDone }">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        <strong>Done</strong>
        <small>{{ bins.done.length }}</small>
      </div>
      <div ref="trashZone" class="zone trash" :class="{ over: overTrash }">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v5M14 11v5" /></svg>
        <strong>Delete</strong>
        <small>{{ bins.deleted.length }}</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.triage {
  display: flex;
  gap: 16px;
  max-width: 520px;
  margin: 0 auto;
}

.feed {
  flex: 1;
  min-width: 0;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 2px 10px;
  font-size: 14px;
  font-weight: 700;
}

.count,
small {
  padding: 3px 7px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.empty {
  margin: 24px 0;
  font-size: 13px;
  text-align: center;
  opacity: 0.5;
}

.toast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  height: 36px;
  margin: 10px 0 0;
  padding: 0 6px 0 12px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 8%, Canvas);
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s;
}

.toast.shown {
  opacity: 1;
}

.toast button {
  padding: 5px 10px;
  border: 0;
  border-radius: 7px;
  background: none;
  color: #42b883;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.toast button:hover {
  background: color-mix(in srgb, #42b883 12%, transparent);
}

.zones {
  display: flex;
  flex: none;
  flex-direction: column;
  gap: 10px;
  width: 120px;
  padding-top: 30px;
}

.zone {
  --zone: #42b883;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  max-height: 140px;
  border: 1.5px dashed color-mix(in srgb, currentColor 14%, transparent);
  border-radius: 14px;
  font-size: 13px;
  transition:
    border-color 0.2s,
    background 0.2s,
    scale 0.2s;
}

.zone.trash {
  --zone: #f43f5e;
}

/* A drag is on: both zones take it. */
.ready .zone {
  border-color: color-mix(in srgb, var(--zone) 60%, transparent);
}

.zone.over {
  border-style: solid;
  border-color: var(--zone);
  background: color-mix(in srgb, var(--zone) 14%, Canvas);
  scale: 1.04;
}

svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: var(--zone);
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@media (max-width: 480px) {
  .zones {
    width: 88px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .zone {
    transition: none;
  }
}
</style>
