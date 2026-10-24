import { computed, onScopeDispose, watch, watchEffect } from 'vue';
import type { DraggableOptions, DraggableReturn, Key, MaybeElementRef } from '../types';
import type { DraggableEntry } from './manager';
import { useDnDContext } from './context';
import { normalizeTypes } from './accept';
import { createId, isNativelyFocusable, toElement } from '../utils/dom';
import { read } from '../utils/read';

/** Hooks used by the sortable layer on top of a plain draggable. */
export interface DraggableInternals {
  getItem?: () => unknown;
  getContainer?: () => HTMLElement | null;
}

const preventNativeDrag = (event: Event) => event.preventDefault();

// ─── Attributes ────────────────────────────────────────────────────────────────
// The library only ever touches attributes it added itself: anything already on the
// element belongs to the user and is never overwritten (rfcs/0001-v3.md §10).

/** Attribute name → the value the library set, per element. */
const ownedAttributes = new WeakMap<Element, Map<string, string>>();

/** True when the attribute is (still) the library's: absent, or exactly what it set. */
const ownsAttribute = (element: Element, name: string): boolean => {
  const current = element.getAttribute(name);
  if (current === null) return true;
  const ours = ownedAttributes.get(element)?.get(name);
  if (ours === current) return true;
  // Set by the user from the start, or changed by them (e.g. a binding) since.
  ownedAttributes.get(element)?.delete(name);
  return false;
};

const setOwnAttribute = (element: Element, name: string, value: string) => {
  if (!ownsAttribute(element, name)) return;
  let owned = ownedAttributes.get(element);
  if (!owned) ownedAttributes.set(element, (owned = new Map()));
  owned.set(name, value);
  if (element.getAttribute(name) !== value) element.setAttribute(name, value);
};

const removeOwnAttribute = (element: Element, name: string) => {
  const owned = ownedAttributes.get(element);
  if (!owned?.has(name)) return;
  if (ownsAttribute(element, name)) element.removeAttribute(name);
  owned.delete(name);
};

const releaseAttributes = (element: Element) => {
  const owned = ownedAttributes.get(element);
  if (!owned) return;
  for (const name of [...owned.keys()]) removeOwnAttribute(element, name);
  ownedAttributes.delete(element);
};

const hasButtonRole = (element: Element) =>
  (element.getAttribute('role') ?? (element.tagName === 'BUTTON' ? 'button' : null)) === 'button';

const applyStaticAttributes = (element: HTMLElement, instructionsId: string, roleDescription: string) => {
  if (!isNativelyFocusable(element)) setOwnAttribute(element, 'tabindex', '0');
  // A native <button> already has the role.
  if (element.tagName !== 'BUTTON') setOwnAttribute(element, 'role', 'button');
  setOwnAttribute(element, 'aria-roledescription', roleDescription);
  if (instructionsId) setOwnAttribute(element, 'aria-describedby', instructionsId);
};

export function createDraggable<TData>(
  target: MaybeElementRef,
  options: DraggableOptions<TData>,
  internals: DraggableInternals & { roleDescription?: string } = {},
): DraggableReturn {
  const manager = useDnDContext();
  const fallbackId = createId('draggable');
  const id = computed<Key>(() => read(options.id) ?? fallbackId);

  const getElement = () => toElement(target);
  /** Handle element; a selector resolves to the first match inside the draggable. */
  const getHandleElement = (): HTMLElement | null => {
    const handle = options.handle;
    if (handle == null) return null;
    if (typeof handle === 'string') return getElement()?.querySelector<HTMLElement>(handle) ?? null;
    return toElement(handle);
  };

  const entry: DraggableEntry = {
    id: id.value,
    overlay: options.overlay !== false,
    activation: options.activation,
    canDrag: options.canDrag,
    getElement,
    getHandle: () => (typeof options.handle === 'string' ? options.handle : getHandleElement()),
    getFocusTarget: () => getHandleElement() ?? getElement(),
    getData: () => read(options.data),
    getTypes: () => normalizeTypes(read(options.type)),
    isDisabled: () => !!read(options.disabled),
    getItem: internals.getItem,
    getContainer: internals.getContainer,
  };

  let unregister = manager.registerDraggable(entry);
  watch(id, (next) => {
    unregister();
    entry.id = next;
    unregister = manager.registerDraggable(entry);
  });

  let bound: { element: HTMLElement; id: Key } | null = null;
  const unbind = () => {
    if (!bound) return;
    manager.unbindDraggableElement(bound.element, bound.id);
    bound.element.removeEventListener('dragstart', preventNativeDrag);
    bound = null;
  };

  watch(
    [getElement, id],
    ([element, currentId]) => {
      unbind();
      if (!element) return;
      manager.bindDraggableElement(element, currentId);
      element.addEventListener('dragstart', preventNativeDrag);
      bound = { element, id: currentId };
    },
    { immediate: true, flush: 'post' },
  );

  // Attributes go on the focus target (the handle when there is one). One effect, so
  // moving them to a new target and updating the dynamic ones can't race.
  let attributeTarget: HTMLElement | null = null;
  if (options.attributes !== false) {
    const roleDescription = internals.roleDescription ?? 'draggable';
    watchEffect(
      () => {
        const element = getHandleElement() ?? getElement();
        if (element !== attributeTarget) {
          if (attributeTarget) releaseAttributes(attributeTarget);
          attributeTarget = element;
        }
        if (!element) return;
        applyStaticAttributes(element, manager.instructionsId, roleDescription);
        setOwnAttribute(element, 'aria-disabled', String(entry.isDisabled()));
        // `aria-pressed` only means something on a button, and only while dragging.
        if (manager.active.value?.id === id.value && hasButtonRole(element)) {
          setOwnAttribute(element, 'aria-pressed', 'true');
        } else {
          removeOwnAttribute(element, 'aria-pressed');
        }
      },
      { flush: 'post' },
    );
  }

  // The selection is keyed by id, so it survives unmounts (virtual lists).
  onScopeDispose(() => {
    unbind();
    unregister();
    if (attributeTarget) releaseAttributes(attributeTarget);
    attributeTarget = null;
  });

  const isDragging = computed(() => manager.active.value?.ids.includes(id.value) ?? false);
  const transform = computed(() =>
    !entry.overlay && manager.active.value?.id === id.value ? manager.transform.value : null,
  );
  const selected = computed({
    get: () => manager.selection.has(id.value),
    set: (value) => {
      if (value) manager.selection.add(id.value);
      else manager.selection.delete(id.value);
    },
  });

  return { id, isDragging, transform, selected };
}

/** Makes an element draggable. Free drag by default; sortable lists build on top of it. */
export function makeDraggable<TData = unknown>(
  target: MaybeElementRef,
  options: DraggableOptions<TData> = {},
): DraggableReturn {
  return createDraggable(target, options);
}
