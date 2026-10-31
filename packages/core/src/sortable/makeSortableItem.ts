import { computed, inject, onScopeDispose, watch, watchEffect } from 'vue';
import type { Key, MaybeElementRef, SortableItemOptions, SortableItemReturn } from '../types';
import { createDraggable } from '../core/makeDraggable';
import { toElement } from '../utils/dom';
import { read } from '../utils/read';
import { SORTABLE_CONTEXT } from './makeSortableList';

/**
 * Makes an element an item of the closest sortable list. Must be called in a
 * component rendered inside the component that called `makeSortableList`.
 * Identify the item with `id` or `item` (keyed by the list's `getKey`).
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
  const { group, list, getKey } = context;
  if (options.id == null && options.item == null) {
    throw new Error(
      '[vue-dnd-kit] makeSortableItem() needs `id` or `item`. Sortable keys must come from your data: ' +
        'an automatic id would change when the component is recreated (moved to another list, recycled ' +
        'by a virtual list), and the drag would lose the item.',
    );
  }
  const manager = group.manager;
  const key = computed<Key>(() => (options.id != null ? read(options.id) : getKey(read(options.item))));
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
      canDrag: options.canDrag,
      attributes: options.attributes,
      overlay: options.overlay,
      dropAnimation: options.dropAnimation,
      modifiers: () => read(options.modifiers) ?? context.getModifiers?.(),
      axis: () => read(options.axis) ?? context.getAxis?.(),
    },
    {
      getItem: () => group.lookup(key.value),
      getContainer: () => list.getElement(),
      getOverlay: context.getOverlay,
      getDropAnimation: context.getDropAnimation,
      roleDescription: 'sortable',
    },
  );

  let unregister = group.registerItem(key.value, getElement);
  watch(key, (next) => {
    unregister();
    unregister = group.registerItem(next, getElement);
  });
  onScopeDispose(() => unregister());

  // The slot: the active item, or its copy / the item made for an external draggable;
  // in a `'group'` multi-drag also the slots of the items travelling with it. Stays
  // true through the drop animation, until the overlay has landed. A copied item stays
  // as it is: while its copy has no slot (over its palette, over an indicator list),
  // nothing is.
  const isPlaceholder = computed(() => {
    const active = manager.active.value;
    if (!active) return false;
    const slot = manager.landingKey.value ?? (manager.mode.value === 'copy' ? null : active.id);
    return slot === key.value || manager.landings.value.has(key.value);
  });
  // Multi-drag `'gaps'`: the other dragged items stay in place until the drop. Copied
  // items don't leave at all, so they aren't marked (the default style dims the mark).
  const isLeftBehind = computed(
    () => draggable.isDragging.value && !isPlaceholder.value && manager.mode.value !== 'copy',
  );

  watchEffect(
    () => {
      const element = getElement();
      if (!element) return;
      element.toggleAttribute('data-dnd-placeholder', isPlaceholder.value);
      element.toggleAttribute('data-dnd-dragging', isLeftBehind.value);
    },
    { flush: 'post' },
  );

  const indicator = computed(() => {
    const value = group.indicator.value;
    return value && value.list === list.id && value.key === key.value ? value : null;
  });

  return {
    isDragging: draggable.isDragging,
    isPlaceholder,
    selected: draggable.selected,
    indicator,
    index: computed(() => group.indexOf(list, key.value)),
  };
}
