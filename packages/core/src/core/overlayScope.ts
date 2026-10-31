/**
 * What a box of the overlay shows, for the content the library renders in it (the
 * default clone, the multi-drag column, `DragPreview`). The overlay has a box for the
 * drag and one per landing flight: each provides its own, so a landing box keeps showing
 * its drag while the next drag shows another.
 */

import { inject, type InjectionKey } from 'vue';
import type { Active, Key, Size } from '../types';
import type { DnDManager, Flight, OverlayColumn, PreviewSource } from './manager';
import { useManager } from './context';

export interface OverlayScope {
  readonly active: Active | null;
  readonly column: OverlayColumn | null;
  /** Ids with a clone, in drop order. */
  readonly previewIds: readonly Key[];
  /** The box's size while dragging (`overlayFit: 'slot'`). */
  readonly fitSize: Size | null;
  getPreview(id: Key): PreviewSource | undefined;
  /** Clones of the other dragged items in the box: each lands on its own slot. */
  readonly items: Map<Key, HTMLElement>;
}

export const OVERLAY_SCOPE: InjectionKey<() => OverlayScope> = Symbol('vue-dnd-kit overlay scope');

/** The running drag's box: read live from the manager. */
export const dragScope = (manager: DnDManager): OverlayScope => ({
  get active() {
    return manager.active.value;
  },
  get column() {
    return manager.overlayColumn.value;
  },
  get previewIds() {
    return manager.previewIds;
  },
  get fitSize() {
    return manager.fitSize.value;
  },
  getPreview: (id) => manager.getPreview(id),
  get items() {
    return manager.overlayItems;
  },
});

/** A landing box: what its drag left. */
export const flightScope = (flight: Flight): OverlayScope => ({
  active: flight.active,
  column: flight.column,
  previewIds: flight.previewIds,
  fitSize: flight.fitSize,
  getPreview: (id) => flight.previews.get(id),
  items: flight.items,
});

/** The scope of the box this component renders in; the drag's outside the overlay. */
export const useOverlayScope = (): (() => OverlayScope) => {
  const provided = inject(OVERLAY_SCOPE, null);
  if (provided) return provided;
  const scope = dragScope(useManager());
  return () => scope;
};
