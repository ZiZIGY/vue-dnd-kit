/** `makeSelectionArea`. */

import type { ComputedRef, Ref } from 'vue';
import type { Key, MaybeReadonlyRef, MaybeReadonlyRefOrGetter } from './primitives';
import type { AcceptRule } from './drag';

// ─── Selection area ────────────────────────────────────────────────────────────

/**
 * - `'toggle'`: items the band crosses flip their state from before the band;
 * - `'select'`: only the items inside the band are selected.
 */
export type SelectionStrategy = 'toggle' | 'select';

/**
 * Keys (`KeyboardEvent.key` or `.code`) that must be held for a press to draw a band:
 * every one of them, or `'some'` of them.
 */
export interface SelectionModifier {
  keys: string[];
  method: 'every' | 'some';
}

/**
 * Options of `makeSelectionArea`. `modifier`, `strategy`, `accept` and `disabled` take a
 * value, a ref or a getter (`accept`: a value or a ref, a function is a rule) and are
 * read when a press starts a band; turning `disabled` on also cancels a running one.
 */
export interface SelectionAreaOptions {
  /** Defaults to the provider's selection. */
  selection?: Ref<Set<Key>>;
  modifier?: MaybeReadonlyRefOrGetter<SelectionModifier | undefined>;
  /** Default `'toggle'`. */
  strategy?: MaybeReadonlyRefOrGetter<SelectionStrategy | undefined>;
  /** Which draggables the band selects; the matcher of drop targets. */
  accept?: MaybeReadonlyRef<AcceptRule | undefined>;
  disabled?: MaybeReadonlyRefOrGetter<boolean>;
  onSelected?: (ids: Key[]) => void;
}

export interface SelectionAreaReturn {
  isSelecting: ComputedRef<boolean>;
  /** Style for the selection rectangle element (absolute, container-relative). */
  style: ComputedRef<Record<string, string>>;
}
