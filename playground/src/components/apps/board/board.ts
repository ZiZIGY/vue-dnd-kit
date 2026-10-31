import type { InjectionKey } from 'vue';
import type { SortableDropEvent } from '@vue-dnd-kit/core';

export type CardLabel = 'bug' | 'feature' | 'design' | 'chore';

export interface BoardCard {
  id: string;
  title: string;
  label: CardLabel;
}

export interface BoardColumn {
  id: string;
  title: string;
  /** Work-in-progress limit: the column refuses cards beyond it (`group.put`). */
  limit?: number;
  /** Moving cards in asks for a confirmation first (async `onBeforeDrop`). */
  confirm?: boolean;
  cards: BoardCard[];
}

const card = (id: string, title: string, label: CardLabel): BoardCard => ({ id, title, label });

export const createBoard = (): BoardColumn[] => [
  {
    id: 'backlog',
    title: 'Backlog',
    cards: [card('c1', 'Research competitors', 'chore'), card('c2', 'Draft pricing page', 'feature')],
  },
  {
    id: 'todo',
    title: 'To do',
    cards: [
      card('c3', 'Set up CI pipeline', 'chore'),
      card('c4', 'Onboarding emails', 'feature'),
      card('c5', 'Fix login redirect', 'bug'),
    ],
  },
  {
    id: 'doing',
    title: 'In progress',
    limit: 3,
    cards: [card('c6', 'Dark mode', 'design'), card('c7', 'Export to CSV', 'feature')],
  },
  {
    id: 'review',
    title: 'Review',
    limit: 2,
    cards: [card('c8', 'Billing webhooks', 'feature'), card('c9', 'Mobile navigation', 'design')],
  },
  { id: 'done', title: 'Done', confirm: true, cards: [card('c10', 'Landing page copy', 'chore')] },
];

/** `column:card,card | …` — what the e2e specs compare against. */
export const describeBoard = (columns: readonly BoardColumn[]): string =>
  columns.map((column) => `${column.id}:${column.cards.map((item) => item.id).join(',')}`).join(' | ');

export type ConfirmAnswer = 'accept' | 'reject' | 'continue';

/** Board-wide services the columns use. */
export interface BoardContext {
  /**
   * Asks the user about moving the cards into `column`: `'accept'`, `'reject'`, or
   * `'continue'` to keep dragging them (the drop doesn't happen, the drag goes on).
   */
  confirmMove(event: SortableDropEvent<BoardCard>, column: BoardColumn): Promise<ConfirmAnswer>;
  recordMove(event: SortableDropEvent<BoardCard>, column: BoardColumn): void;
  addCard(column: BoardColumn, title: string): void;
}

export const BOARD: InjectionKey<BoardContext> = Symbol('board');

export const cardCount = (count: number): string => (count === 1 ? '1 card' : `${count} cards`);
