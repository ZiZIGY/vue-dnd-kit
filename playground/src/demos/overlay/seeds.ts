import type { DragItem } from '@vue-dnd-kit/core';

export interface Seed {
  id: string;
  title: string;
  icon: string;
  /** Beds of the tree hold plants. */
  children?: Seed[];
}

export interface SeedBed {
  id: string;
  title: string;
  seeds: Seed[];
}

export const seed = (id: string, title: string, icon = '🌰'): Seed => ({ id, title, icon });

/** The seed a dragged item carries: sortable items expose their item object. */
export const seedOf = (entry: DragItem | undefined): Seed | undefined => entry?.item as Seed | undefined;

/** `id:key,key | id:key` — what specs compare against. */
export const describeBeds = (beds: SeedBed[]): string =>
  beds.map((bed) => `${bed.id}:${bed.seeds.map((item) => item.id).join(',')}`).join(' | ');
