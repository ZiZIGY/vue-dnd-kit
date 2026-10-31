import type { InjectionKey } from 'vue';

export interface Piece {
  id: string;
  color: 'red' | 'blue';
}

/** Where each free piece currently lies: a zone id or `'tray'`. */
export interface ZoneStore {
  pieces: Piece[];
  location: Record<string, string>;
}

export const ZONE_STORE: InjectionKey<ZoneStore> = Symbol('zone-store');
