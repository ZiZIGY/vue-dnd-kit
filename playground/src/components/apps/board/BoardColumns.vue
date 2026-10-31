<script setup lang="ts">
  import { computed, provide, ref, shallowRef, useTemplateRef } from 'vue';
  import { makeDroppable, makeSortableList, useDnD, type SortableDropEvent } from '@vue-dnd-kit/core';
  import BoardColumnView from './BoardColumn.vue';
  import ConfirmDialog from './ConfirmDialog.vue';
  import {
    BOARD,
    cardCount,
    createBoard,
    describeBoard,
    type BoardCard,
    type BoardColumn,
    type ConfirmAnswer,
  } from './board';

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
    resolve(answer: ConfirmAnswer): void;
  }
  const request = shallowRef<Request | null>(null);
  const answer = (value: ConfirmAnswer) => {
    const current = request.value;
    request.value = null;
    current?.resolve(value);
  };

  let created = 0;
  provide(BOARD, {
    confirmMove: (event, column) =>
      new Promise<ConfirmAnswer>((resolve) => {
        request.value = {
          title: `Move to ${column.title}?`,
          message: `${subject(event.items)} will be marked as finished.`,
          confirmLabel: `Move to ${column.title}`,
          resolve: (value) => {
            if (value === 'reject') log(`Kept ${subject(event.items)} out of ${column.title}`);
            resolve(value);
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
    color: var(--ui-text-muted);
  }

  .tb-selection button {
    margin-left: 6px;
    padding: 2px 10px;
    border: 1px solid var(--ui-border-accented);
    border-radius: var(--ui-radius-sm);
    background: var(--ui-bg);
    color: var(--ui-text);
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
    border: 2px dashed var(--ui-border-strong);
    border-radius: var(--ui-radius-lg);
    color: var(--ui-text-dimmed);
    transition:
      background 120ms,
      border-color 120ms,
      color 120ms;
  }

  .tb-trash.armed {
    border-color: color-mix(in srgb, var(--ui-danger) 70%, transparent);
    color: var(--ui-danger);
  }

  .tb-trash.over {
    background: var(--ui-danger-soft);
    border-style: solid;
  }

  /* The board: a stage of its own, dotted like the docs' paper. */
  .tb-board {
    display: flex;
    align-items: stretch;
    gap: 12px;
    width: max-content;
    margin: 0;
    padding: 12px;
    list-style: none;
    background-color: var(--ui-bg-muted);
    background-image: radial-gradient(color-mix(in srgb, var(--ui-text-dimmed) 45%, transparent) 1px, transparent 1.4px);
    background-size: 22px 22px;
    border-radius: var(--ui-radius-lg);
    box-shadow: inset 0 0 0 1px var(--ui-border);
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
    color: var(--ui-text-muted);
  }
</style>
