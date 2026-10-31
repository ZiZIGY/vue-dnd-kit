<script setup lang="ts">
  import { computed, inject, nextTick, shallowRef, toRef, useTemplateRef } from 'vue';
  import { makeSortableItem, makeSortableList } from '@vue-dnd-kit/core';
  import BoardCardView from './BoardCard.vue';
  import { BOARD, type BoardColumn } from './board';

  const props = defineProps<{ column: BoardColumn }>();
  const board = inject(BOARD)!;

  const el = useTemplateRef<HTMLElement>('el');
  const handle = useTemplateRef<HTMLElement>('handle');
  const list = useTemplateRef<HTMLElement>('list');

  // The column is an item of the columns list, dragged by its header...
  makeSortableItem(el, { id: () => props.column.id, handle, type: 'column', data: () => props.column });

  // ...and holds the card list. Cards from other columns only come in while the WIP
  // limit allows: `put` sees every card of a multi-drag at once.
  const fits = (incoming: number) =>
    props.column.limit == null || props.column.cards.length + incoming <= props.column.limit;
  const { items, isOver, isAccepting } = makeSortableList(list, {
    id: props.column.id,
    items: toRef(props.column, 'cards'),
    group: { name: 'board-cards', put: ({ keys }) => fits(keys.length) },
    // Only cards coming from another column need a confirmation.
    onBeforeDrop: (event) => (props.column.confirm && !event.sameList ? board.confirmMove(event, props.column) : 'accept'),
    onDrop: (event) => board.recordMove(event, props.column),
  });

  const atLimit = computed(() => props.column.limit != null && props.column.cards.length >= props.column.limit);
  const refusing = computed(() => isOver.value && !isAccepting.value);

  // ─── Add a card ─────────────────────────────────────────────────────────────
  const adding = shallowRef(false);
  const draft = shallowRef('');
  const input = useTemplateRef<HTMLTextAreaElement>('input');

  const open = async () => {
    adding.value = true;
    await nextTick();
    input.value?.focus();
  };
  const close = () => {
    adding.value = false;
    draft.value = '';
  };
  const submit = () => {
    const title = draft.value.trim();
    if (!title) return close();
    board.addCard(props.column, title);
    draft.value = '';
    input.value?.focus();
  };
</script>

<template>
  <li
    ref="el"
    class="tb-column"
    :class="{ refusing }"
    :data-id="column.id"
    :data-testid="`column-${column.id}`"
  >
    <header
      ref="handle"
      class="tb-column-header"
      :data-testid="`header-${column.id}`"
      :aria-label="`${column.title} column`"
    >
      <span class="tb-grip">⋮⋮</span>
      <h3>{{ column.title }}</h3>
      <span
        class="tb-count"
        :class="{ full: atLimit }"
        :data-testid="`count-${column.id}`"
        >{{ column.cards.length }}<template v-if="column.limit != null"> / {{ column.limit }}</template></span
      >
    </header>
    <ul
      ref="list"
      class="tb-cards"
      :data-testid="`cards-${column.id}`"
      :data-accepting="isAccepting || undefined"
      :data-refusing="refusing || undefined"
    >
      <BoardCardView
        v-for="card in items"
        :key="card.id"
        :card="card"
      />
      <li
        v-if="refusing"
        class="tb-limit"
        :data-testid="`limit-${column.id}`"
      >
        WIP limit of {{ column.limit }} reached
      </li>
    </ul>
    <form
      v-if="adding"
      class="tb-add-form"
      @submit.prevent="submit"
    >
      <textarea
        ref="input"
        v-model="draft"
        rows="2"
        placeholder="Card title…"
        :data-testid="`new-title-${column.id}`"
        @keydown.enter.exact.prevent="submit"
        @keydown.esc="close"
      />
      <div class="tb-add-actions">
        <button
          type="submit"
          :data-testid="`save-${column.id}`"
        >
          Add card
        </button>
        <button
          type="button"
          class="tb-link"
          @click="close"
        >
          Cancel
        </button>
      </div>
    </form>
    <button
      v-else
      type="button"
      class="tb-add"
      :data-testid="`add-${column.id}`"
      @click="open"
    >
      + Add a card
    </button>
  </li>
</template>

<style scoped>
  .tb-column {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 208px;
    min-height: 280px;
    padding: 8px;
    background: var(--ui-bg-elevated);
    border-radius: var(--ui-radius-lg);
    box-shadow: inset 0 0 0 1px var(--ui-border);
    list-style: none;
  }

  .tb-column.refusing {
    background: var(--ui-danger-soft);
    box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--ui-danger) 55%, transparent);
  }

  .tb-column-header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 6px;
    border-radius: var(--ui-radius);
    cursor: grab;
  }

  .tb-column-header:focus-visible {
    outline: 2px solid var(--ui-focus);
  }

  .tb-grip {
    color: var(--ui-text-dimmed);
    font-size: 12px;
    letter-spacing: -2px;
  }

  h3 {
    flex: 1;
    margin: 0;
    font-size: 14px;
  }

  .tb-count {
    padding: 1px 8px;
    border-radius: var(--ui-radius-sm);
    background: color-mix(in srgb, var(--ui-text) 9%, transparent);
    color: var(--ui-text-muted);
    font-family: var(--font-mono);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }

  .tb-count.full {
    background: color-mix(in srgb, var(--ui-danger) 16%, transparent);
    color: var(--ui-danger);
  }

  /* The whole column body takes cards, including the space below the last one. */
  .tb-cards {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 48px;
    margin: 0;
    padding: 0;
    list-style: none;
    border-radius: var(--ui-radius);
  }

  .tb-cards[data-accepting] {
    background: color-mix(in srgb, var(--ui-primary) 7%, transparent);
  }

  .tb-limit {
    padding: 8px;
    border: 1px dashed color-mix(in srgb, var(--ui-danger) 70%, transparent);
    border-radius: var(--ui-radius);
    color: var(--ui-danger);
    font-size: 12px;
    text-align: center;
  }

  .tb-add {
    padding: 6px 8px;
    border: 0;
    border-radius: var(--ui-radius);
    background: none;
    color: var(--ui-text-muted);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }

  .tb-add:hover {
    background: var(--ui-bg-accented);
    color: var(--ui-text);
  }

  .tb-add-form textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid var(--ui-border-strong);
    border-radius: var(--ui-radius);
    background: var(--ui-bg);
    color: var(--ui-text);
    font: inherit;
    resize: none;
  }

  .tb-add-form textarea:focus {
    border-color: var(--ui-primary);
    outline: none;
  }

  .tb-add-actions {
    display: flex;
    gap: 8px;
    margin-top: 4px;
  }

  .tb-add-actions button {
    padding: 6px 10px;
    border: 0;
    border-radius: var(--ui-radius-sm);
    background: var(--ui-primary);
    color: var(--ui-on-primary);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }

  .tb-add-actions .tb-link {
    background: none;
    color: var(--ui-text-muted);
    font-weight: 400;
  }
</style>
