/**
 * Live overrides of option values (`DevtoolsOverrides`), for the devtools' editing. An
 * override is read where the library reads the option, for as long as it is set:
 * - the provider's props: an accessor on the props object (the raw one under Vue's
 *   proxies); the parent's updates are kept underneath;
 * - lists, trees and plain drop targets: an accessor on the options object they were made
 *   with (their entry's `options`), which the library reads as ever (`toValue`, `unref`);
 * - draggables and sortable items: the getters of their entry (`isDisabled`, …).
 *
 * The overrides are a reactive map the accessors read: what read an option re-reads it
 * when its override changes. What read it before its first override is told once where it
 * can be: the props are written back through Vue's proxy, a ref is triggered. Entries
 * registered while overrides are set get them too (virtual lists remount their items).
 * Once no override is left, every object is as it was.
 */

import { isRef, shallowReactive, toRaw, toValue, triggerRef, unref } from 'vue';
import type { DnDManager, DraggableEntry } from '../core/manager';
import type { ListEntry } from '../sortable/entry';
import type { DevtoolsOverrides, OptionOverride, OverrideTarget } from './types';

type Getter = 'isDisabled' | 'getKeyboard' | 'getActivation';

/** Options of draggables: the entry getter that reads each, and what it makes of the value. */
const GETTERS: Record<string, [Getter, (value: unknown) => unknown]> = {
  disabled: ['isDisabled', (value) => !!value],
  keyboard: ['getKeyboard', (value) => value],
  activation: ['getActivation', (value) => value],
};

/** Options of plain drop targets (a list's drop target has the list's). */
const DROPPABLE = new Set(['disabled', 'priority', 'accept', 'acceptMode']);

/** Options the library reads with `unref`: a function is a value (an animation, an accept rule), not a getter. */
const UNREF = new Set(['animation', 'accept', 'overlay']);

/** `kind:id|option`, numbers and strings apart. */
const idOf = (target: OverrideTarget, option: string) =>
  `${target.kind === 'provider' ? target.kind : `${target.kind}:${typeof target.id}:${target.id}`}|${option}`;

const sameTarget = (a: OverrideTarget, b: OverrideTarget) =>
  a.kind === b.kind && (a.kind === 'provider' || a.id === (b as { id: unknown }).id);

/** The overrides of the provider of `manager`; `lists` are its sortable lists and trees, now. */
export function createOverrides(manager: DnDManager, lists: () => Iterable<ListEntry>): DevtoolsOverrides {
  /** Override id → override. */
  const overrides = shallowReactive(new Map<string, OptionOverride>());
  /** Options objects with accessors: option → the value underneath. */
  const underneath = new WeakMap<object, Map<string, () => unknown>>();
  /** Entries with wrapped getters: getter → the entry's own. */
  const originals = new WeakMap<DraggableEntry, Map<Getter, (() => unknown) | undefined>>();
  /** Undoes what the overrides changed, once none is left. */
  let undo: Array<() => void> = [];
  let patched = false;

  /** The options object of a target, for accessors: the raw props, a list's options, a plain drop target's. */
  const objectOf = (target: OverrideTarget): object | null => {
    if (target.kind === 'provider') return toRaw(manager.props);
    if (target.kind === 'list') {
      for (const list of lists()) if (list.id === target.id) return list.options ? toRaw(list.options) : null;
      return null;
    }
    const entry = target.kind === 'droppable' ? manager.getDroppable(target.id) : undefined;
    return entry && !entry.sortable && entry.options ? toRaw(entry.options) : null;
  };

  /** Puts an accessor for `option` on `object`, reading the override `id` over the value underneath. */
  const accessor = (object: object, option: string, id: string, props: boolean): boolean => {
    let installed = underneath.get(object);
    if (installed?.has(option)) return true;
    const own = Object.getOwnPropertyDescriptor(object, option);
    let value: unknown = own?.value;
    const read = own?.get ? () => own.get!.call(object) : () => value;
    try {
      Object.defineProperty(object, option, {
        configurable: true,
        enumerable: own?.enumerable ?? false,
        get: () => {
          const override = overrides.get(id);
          return override ? override.value : read();
        },
        set: (next: unknown) => {
          if (own?.set) own.set.call(object, next);
          else value = next;
        },
      });
    } catch {
      // Frozen, sealed or not configurable.
      return false;
    }
    if (!installed) underneath.set(object, (installed = new Map()));
    installed.set(option, read);
    undo.push(() => {
      installed.delete(option);
      if (!own) delete (object as Record<string, unknown>)[option];
      else Object.defineProperty(object, option, own.get || own.set ? own : { ...own, value: read() });
    });
    // What read it before: the props proxy triggers when the value written differs from
    // the one it reads (the override's); a ref is triggered.
    if (props) (shallowReactive(object) as Record<string, unknown>)[option] = read();
    else if (isRef(value)) triggerRef(value);
    return true;
  };

  /** Wraps the getter of `entry` that reads `option`, over the override `id`. */
  const wrap = (entry: DraggableEntry, option: string, id: string): boolean => {
    const getter = GETTERS[option];
    if (!getter) return false;
    const [name, normalize] = getter;
    let wrapped = originals.get(entry);
    if (wrapped?.has(name)) return true;
    const own = entry[name] as (() => unknown) | undefined;
    if (!wrapped) originals.set(entry, (wrapped = new Map()));
    wrapped.set(name, own);
    entry[name] = (() => {
      const override = overrides.get(id);
      return override ? normalize(override.value) : own?.call(entry);
    }) as never;
    undo.push(() => {
      wrapped.delete(name);
      if (own) entry[name] = own as never;
      else delete entry[name];
    });
    return true;
  };

  /** Puts an override in place on what its target is now: `false` when there is none. */
  const place = ({ target, option }: OptionOverride, id: string): boolean => {
    if (target.kind === 'draggable') {
      const entry = manager.getDraggable(target.id);
      return !!entry && wrap(entry, option, id);
    }
    if (target.kind === 'droppable' && !DROPPABLE.has(option)) return false;
    const object = objectOf(target);
    return !!object && accessor(object, option, id, target.kind === 'provider');
  };

  const apply = () => {
    for (const [id, override] of overrides) place(override, id);
  };

  /** Entries registered from now on get the overrides: a list registers its drop target right after itself. */
  const patch = () => {
    if (patched) return;
    patched = true;
    const { registerDraggable, registerDroppable } = manager;
    manager.registerDraggable = (entry) => {
      const unregister = registerDraggable(entry);
      apply();
      return unregister;
    };
    manager.registerDroppable = (entry) => {
      const unregister = registerDroppable(entry);
      apply();
      return unregister;
    };
    undo.push(() => {
      manager.registerDraggable = registerDraggable;
      manager.registerDroppable = registerDroppable;
      patched = false;
    });
  };

  const resetAll = () => {
    const done = undo;
    undo = [];
    // Objects first, then the overrides: what re-reads an option finds it as it was.
    for (let index = done.length - 1; index >= 0; index--) done[index]!();
    overrides.clear();
  };

  return {
    set(target, option, value) {
      const id = idOf(target, option);
      const previous = overrides.get(id);
      overrides.set(id, { target, option, value });
      if (place({ target, option, value }, id)) {
        if (target.kind !== 'provider') patch();
        return true;
      }
      if (previous) overrides.set(id, previous);
      else overrides.delete(id);
      return false;
    },
    reset(target, option) {
      if (!target) return resetAll();
      for (const [id, override] of [...overrides]) {
        if (sameTarget(override.target, target) && (option === undefined || override.option === option)) overrides.delete(id);
      }
      if (!overrides.size) resetAll();
    },
    read(target, option) {
      const overridden = overrides.has(idOf(target, option));
      if (target.kind === 'draggable') {
        const entry = manager.getDraggable(target.id);
        const name = GETTERS[option]?.[0];
        if (!entry || !name) return undefined;
        const own = originals.get(entry)?.has(name) ? originals.get(entry)!.get(name) : entry[name];
        return { value: entry[name]?.(), code: own?.call(entry), overridden };
      }
      if (target.kind === 'droppable' && !DROPPABLE.has(option)) return undefined;
      const object = objectOf(target) as Record<string, unknown> | null;
      if (!object) return undefined;
      const read = underneath.get(object)?.get(option);
      const value = object[option];
      return {
        value: target.kind === 'provider' ? value : UNREF.has(option) ? unref(value) : toValue(value),
        code: read ? read() : value,
        overridden,
      };
    },
    list: () => [...overrides.values()].map(({ target, option, value }) => ({ target, option, value })),
  };
}
