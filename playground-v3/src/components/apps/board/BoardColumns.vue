<script setup lang="ts">
  import { computed, provide, ref, shallowRef, useTemplateRef } from 'vue';
  import { makeDroppable, makeSortableList, useDnD, type SortableDropEvent } from '@vue-dnd-kit/core';
  import BoardColumnView from './BoardColumn.vue';
  import ConfirmDialog from './ConfirmDialog.vue';
  import { BOARD, cardCount, createBoard, describeBoard, type BoardCard, type BoardColumn } from './board';

  const columns = ref<BoardColumn[]>(createBoard());
  const { selection, active } = useDnD();

  // ─── Columns ──────────────────────────────────────────────────────────────────
  const el = useTemplateRef<HTMLElement>('el');
  const { items } = makeSortableList(el, {
    id: 'columns',
    items: columns,
    group: 'board-columns',
    strategy: 'horizontal',
  });

  // ─── Activity ─────────────────────────────────────────────────────────────────
  const activity = ref<string[]>([]);
  const log = (text: string) => activity.value.unshift(text);
  const subject = (cards: readonly BoardCard[]) => (cards.length === 1 ? `“${cards[0]!.title}”` : cardCount(cards.length));

  // ─── Confirmation before cards enter a column (async onBeforeDrop) ────────────
  interface Request {
    title: string;
    message: string;
    confirmLabel: string;
    resolve(ok: boolean): void;
  }
  const request = shallowRef<Request | null>(null);
  const answer = (ok: boolean) => {
    const current = request.value;
    request.value = null;
    current?.resolve(ok);
  };

  let created = 0;
  provide(BOARD, {
    confirmMove: (event, column) =>
      new Promise<boolean>((resolve) => {
        request.value = {
          title: `Move to ${column.title}?`,
          message: `${subject(event.items)} will be marked as finished.`,
          confirmLabel: `Move to ${column.title}`,
          resolve: (ok) => {
            if (!ok) log(`Kept ${subject(event.items)} out of ${column.title}`);
            resolve(ok);
          },
        };
      }),
    recordMove: (event: SortableDropEvent<BoardCard>, column) => {
      if (!event.sameList) log(`Moved ${subject(event.items)} to ${column.title}`);
    },
    addCard: (column, title) => {
      column.cards.push({ id: `n${++created}`, title, label: 'feature' });
      log(`Added “${title}” to ${column.title}`);
    },
  });

  // ─── Trash ────────────────────────────────────────────────────────────────────
  const trash = useTemplateRef<HTMLElement>('trash');
  const { isOver: overTrash, isAccepting: trashAccepting } = makeDroppable(trash, {
    id: 'trash',
    accept: 'card',
    onDrop: (event) => {
      const cards = event.active.items.map((entry) => entry.item as BoardCard);
      // Removes the cards from the columns they came from.
      event.source?.remove();
      selection.delete(...event.active.ids);
      log(`Deleted ${subject(cards)}`);
    },
  });

  const draggingCards = computed(() => active.value?.type.includes('card') ?? false);
  const selectedCount = computed(() => selection.ids.size);
</script>

<template>
  <div class="tb-toolbar">
    <span
      class="tb-selection"
      data-testid="selection"
    >
      <template v-if="selectedCount">
        {{ cardCount(selectedCount) }} selected
        <button
          type="button"
          data-testid="clear-selection"
          @click="selection.clear()"
        >
          Clear
        </button>
      </template>
      <template v-else>Ctrl/Cmd+click cards to select several</template>
    </span>
    <div
      ref="trash"
      class="tb-trash"
      :class="{ armed: draggingCards && trashAccepting, over: overTrash }"
      data-testid="trash"
      :data-over="overTrash || undefined"
    >
      <span aria-hidden="true">🗑</span> Drop here to delete
    </div>
  </div>
  <ul
    ref="el"
    class="tb-board"
    data-testid="board"
  >
    <BoardColumnView
      v-for="column in items"
      :key="column.id"
      :column="column"
    />
  </ul>
  <div class="tb-footer">
    <section>
      <h4>Activity</h4>
      <ol
        class="tb-activity"
        data-testid="activity"
      >
        <li
          v-for="(entry, index) in activity"
          :key="activity.length - index"
        >
          {{ entry }}
        </li>
      </ol>
    </section>
    <pre data-testid="board-state">{{ describeBoard(columns) }}</pre>
  </div>
  <Teleport to="body">
    <ConfirmDialog
      v-if="request"
      :title="request.title"
      :message="request.message"
      :confirm-label="request.confirmLabel"
      @answer="answer"
    />
  </Teleport>
</template>

<style scoped>
  .tb-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 12px;
  }

  .tb-selection {
    color: #475569;
  }

  .tb-selection button {
    margin-left: 6px;
    padding: 2px 10px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    background: #fff;
    font: inherit;
    cursor: pointer;
  }

  .tb-trash {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 220px;
    height: 56px;
    border: 2px dashed #cbd5e1;
    border-radius: 10px;
    color: #94a3b8;
    transition:
      background 120ms,
      border-color 120ms,
      color 120ms;
  }

  .tb-trash.armed {
    border-color: #f87171;
    color: #dc2626;
  }

  .tb-trash.over {
    background: #fee2e2;
    border-style: solid;
  }

  .tb-board {
    display: flex;
    align-items: stretch;
    gap: 12px;
    width: max-content;
    margin: 0;
    padding: 12px;
    list-style: none;
    background: linear-gradient(135deg, #1e3a8a, #6d28d9);
    border-radius: 14px;
  }

  .tb-footer {
    display: flex;
    gap: 24px;
    align-items: flex-start;
    margin-top: 12px;
  }

  h4 {
    margin: 0 0 4px;
  }

  .tb-activity {
    min-width: 320px;
    max-height: 120px;
    overflow: auto;
    margin: 0;
    padding-left: 20px;
    color: #334155;
  }
</style>
