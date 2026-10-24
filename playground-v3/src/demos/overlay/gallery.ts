import type { DragItem } from '@vue-dnd-kit/core';

export type CardKind = 'note' | 'photo' | 'task' | 'link';

export interface Card {
  id: string;
  kind: CardKind;
  title: string;
  /** Tint of notes and photos. */
  hue?: number;
}

export interface CardColumn {
  id: string;
  title: string;
  cards: Card[];
}

export const ICONS: Record<CardKind, string> = { note: '✎', photo: '▣', task: '☐', link: '↗' };

/** The card a dragged item carries: sortable items expose their item object. */
export const cardOf = (entry: DragItem | undefined): Card | undefined => entry?.item as Card | undefined;

/** `id:key,key | id:key` — what specs compare against. */
export const describeColumns = (columns: CardColumn[]): string =>
  columns.map((column) => `${column.id}:${column.cards.map((card) => card.id).join(',')}`).join(' | ');

let uid = 0;
/** A copy with a fresh id (Alt-copy, `pull: 'clone'`). */
export const cloneCard = (card: Card): Card => ({ ...card, id: `${card.id}-copy${++uid}` });

export const cards = (prefix: string, kinds: CardKind[], titles: string[] = []): Card[] =>
  kinds.map((kind, index) => ({
    id: `${prefix}${index + 1}`,
    kind,
    title: titles[index] ?? `${kind[0]!.toUpperCase()}${kind.slice(1)} ${prefix.toUpperCase()}${index + 1}`,
    hue: (index * 67 + prefix.charCodeAt(0) * 13) % 360,
  }));
