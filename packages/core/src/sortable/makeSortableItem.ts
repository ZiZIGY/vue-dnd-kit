import { computed, inject, onScopeDispose, watch, watchEffect } from 'vue';
import type { MaybeElementRef, SortableItemOptions, SortableItemReturn } from '../types';
import { createDraggable } from '../core/makeDraggable';
import { toElement } from '../utils/dom';
import { read } from '../utils/read';
import { SORTABLE_CONTEXT } from './makeSortableList';

/**
 * Makes an element an item of the closest sortable list. Must be called in a
 * component rendered inside the component that called `makeSortableList`.
 */
export function makeSortableItem<TData = unknown>(
  target: MaybeElementRef,
  options: SortableItemOptions<TData>,
): SortableItemReturn {
  const context = inject(SORTABLE_CONTEXT, null);
  if (!context) {
    throw new Error(
      '[vue-dnd-kit] makeSortableItem() must be used inside a component rendered by a list that called makeSortableList().',
    );
  }
  const { group, list } = context;
  const manager = group.manager;
  const key = computed(() => read(options.id));
  const getElement = () => toElement(target);

  const draggable = createDraggable(
    target,
    {
      id: key,
      handle: options.handle,
      disabled: () => !!read(options.disabled) || list.isDisabled(),
      type: () => read(options.type) ?? group.name,
      data: options.data,
      activation: options.activation,
    },
    {
      getItem: () => group.lookup(key.value),
      getContainer: () => list.getElement(),
      roleDescription: 'sortable',
    },
  );

  let unregister = group.registerItem(key.value, getElement);
  watch(key, (next) => {
    unregister();
    unregister = group.registerItem(next, getElement);
  });
  onScopeDispose(() => unregister());

  // Stays true through the drop animation, until the overlay has landed.
  const isPlaceholder = computed(() => manager.active.value?.id === key.value);

  watchEffect(
    () => {
      const element = getElement();
      if (!element) return;
      if (isPlaceholder.value) element.setAttribute('data-dnd-placeholder', '');
      else element.removeAttribute('data-dnd-placeholder');
    },
    { flush: 'post' },
  );

  return {
    isDragging: draggable.isDragging,
    isPlaceholder,
    selected: draggable.selected,
    // Indicator mode lands with the remaining sortable modules (rfcs/0001-v3.md §15, B3).
    indicator: computed(() => null),
    index: computed(() => group.indexOf(list, key.value)),
  };
}
