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

const applyAttributes = (element: HTMLElement, instructionsId: string, roleDescription: string) => {
  if (!element.hasAttribute('tabindex') && !isNativelyFocusable(element)) {
    element.setAttribute('tabindex', '0');
  }
  if (!element.hasAttribute('role')) element.setAttribute('role', 'button');
  if (!element.hasAttribute('aria-roledescription')) {
    element.setAttribute('aria-roledescription', roleDescription);
  }
  if (instructionsId && !element.hasAttribute('aria-describedby')) {
    element.setAttribute('aria-describedby', instructionsId);
  }
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
  const getHandleElement = () =>
    options.handle == null || typeof options.handle === 'string' ? null : toElement(options.handle);

  const entry: DraggableEntry = {
    id: id.value,
    overlay: options.overlay !== false,
    activation: options.activation,
    canDrag: options.canDrag,
    keyboard: options.keyboard,
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
    [getElement, getHandleElement, id],
    ([element, handle, currentId]) => {
      unbind();
      if (!element) return;
      manager.bindDraggableElement(element, currentId);
      element.addEventListener('dragstart', preventNativeDrag);
      bound = { element, id: currentId };
      if (options.attributes !== false) {
        applyAttributes(handle ?? element, manager.instructionsId, internals.roleDescription ?? 'draggable');
      }
    },
    { immediate: true, flush: 'post' },
  );

  if (options.attributes !== false) {
    watchEffect(
      () => {
        const element = getHandleElement() ?? getElement();
        if (!element) return;
        element.setAttribute('aria-disabled', String(entry.isDisabled()));
        element.setAttribute('aria-pressed', String(manager.active.value?.id === id.value));
      },
      { flush: 'post' },
    );
  }

  // The selection is keyed by id, so it survives unmounts (virtual lists).
  onScopeDispose(() => {
    unbind();
    unregister();
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
