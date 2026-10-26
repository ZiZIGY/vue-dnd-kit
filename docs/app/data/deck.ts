/** The cards of the hero deck: one per thing the library does. */
export interface DeckCard {
  id: string;
  kind: 'sortable' | 'kanban' | 'tree' | 'multi' | 'animate' | 'keyboard' | 'virtual';
  /** `accent`: the green card; `ink`: dark in both themes; `plain`: follows the theme. */
  tone: 'accent' | 'ink' | 'plain';
}

export const DECK: DeckCard[] = [
  { id: 'kanban', kind: 'kanban', tone: 'plain' },
  { id: 'tree', kind: 'tree', tone: 'ink' },
  { id: 'multi', kind: 'multi', tone: 'plain' },
  { id: 'sortable', kind: 'sortable', tone: 'accent' },
  { id: 'animate', kind: 'animate', tone: 'plain' },
  { id: 'keyboard', kind: 'keyboard', tone: 'ink' },
  { id: 'virtual', kind: 'virtual', tone: 'plain' },
];
