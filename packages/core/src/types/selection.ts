/** `makeSelectionArea`. */

import type { ComputedRef } from 'vue';
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
  /** The keys, as `KeyboardEvent.key` (`'Shift'`) or `.code` (`'KeyA'`). None: any press draws. */
  keys: string[];
  /** `'every'`: all of `keys` must be held; `'some'`: one of them is enough. */
  method: 'every' | 'some';
}

/**
 * Options of `makeSelectionArea`. The band selects into the provider's selection, the one
 * multi-drag and `selected` read (`useDnD().selection`). `modifier`, `strategy`, `accept`
 * and `disabled` take a value, a ref or a getter (`accept`: a value or a ref, a function
 * is a rule) and are read when a press starts a band; turning `disabled` on also cancels
 * a running one.
 */
export interface SelectionAreaOptions {
  /** Keys that must be held for a press to draw a band. Default: none, any press on the empty space draws. */
  modifier?: MaybeReadonlyRefOrGetter<SelectionModifier | undefined>;
  /** Default `'toggle'`. */
  strategy?: MaybeReadonlyRefOrGetter<SelectionStrategy | undefined>;
  /** Which draggables the band selects; the matcher of drop targets. */
  accept?: MaybeReadonlyRef<AcceptRule | undefined>;
  /** `true`: presses draw no band. */
  disabled?: MaybeReadonlyRefOrGetter<boolean>;
  /** The band ended: gets every id selected now. */
  onSelected?: (ids: Key[]) => void;
}

/** What `makeSelectionArea` returns. */
export interface SelectionAreaReturn {
  /** A band is being drawn: render it then. */
  isSelecting: ComputedRef<boolean>;
  /** Style for the selection rectangle element (absolute, container-relative). */
  style: ComputedRef<Record<string, string>>;
}
