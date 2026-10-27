import type { AcceptRule } from '@vue-dnd-kit/core';

export interface Waste {
  id: string;
  name: string;
  emoji: string;
  /** The draggable's `type`: what a bin's `accept` checks. */
  type: string;
  compostable?: boolean;
}

export interface Bin {
  id: string;
  name: string;
  color: string;
  accept: AcceptRule;
  /** The rule as code, shown on the bin. */
  rule: string;
}

export const WASTE: Waste[] = [
  { id: 'bottle', name: 'Bottle', emoji: '🍾', type: 'glass' },
  { id: 'news', name: 'Newspaper', emoji: '📰', type: 'paper' },
  { id: 'box', name: 'Box', emoji: '📦', type: 'cardboard' },
  { id: 'can', name: 'Can', emoji: '🥫', type: 'metal' },
  { id: 'cup', name: 'Cup', emoji: '🥤', type: 'plastic' },
  { id: 'peel', name: 'Peel', emoji: '🍌', type: 'food', compostable: true },
  { id: 'leaves', name: 'Leaves', emoji: '🍂', type: 'garden', compostable: true },
  { id: 'battery', name: 'Battery', emoji: '🔋', type: 'battery' },
];

export const BINS: Bin[] = [
  { id: 'glass', name: 'Glass', color: '#14b8a6', accept: 'glass', rule: "'glass'" },
  { id: 'paper', name: 'Paper', color: '#3b82f6', accept: ['paper', 'cardboard'], rule: "['paper', 'cardboard']" },
  { id: 'packaging', name: 'Packaging', color: '#eab308', accept: ['plastic', 'metal'], rule: "['plastic', 'metal']" },
  {
    id: 'compost',
    name: 'Compost',
    color: '#c2410c',
    // A function decides on anything about the drag: here the items' data, not their type.
    accept: ({ items }) => items.every((item) => (item.data as Waste).compostable),
    rule: '({ items }) => …compostable',
  },
];
