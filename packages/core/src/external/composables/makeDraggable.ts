import type {
  IBaseOptions,
  IDragActivation,
  IDragActivationOptions,
  IDraggableEvents,
  IModifier,
  IModifierOptions,
  IPlacement,
  IPlacementMargins,
  TDnDNodeRef,
  TDraggablePayload,
} from '../types';
import {
  computed,
  onBeforeUnmount,
  onMounted,
  type Component,
  type ComputedRef,
  type Ref,
  type WritableComputedRef,
} from 'vue';

import { DnDAttributes } from '../../internal/utils/namespaces';
import { getNode, preventEvent } from '../../internal/utils/dom';
import { useDnDProviderInternal } from '../../internal/composables/useDnDProviderInternal';

interface IMakeDraggableOptions extends IBaseOptions {
  /** Stable id for this draggable. Required for correct behavior inside virtual lists
   *  where items unmount and remount as the user scrolls. If omitted, a random id is
   *  generated automatically — sufficient for non-virtual usage. */
  id?: string;
  events?: IDraggableEvents;
  modifier?: IModifierOptions;
  render?: Component;
  dragHandle?: string | Ref<string>;
  activation?: IDragActivationOptions;
  placementMargins?: IPlacementMargins;
  data?: () => unknown;
}

interface IMakeDraggableReturnType {
  selected: WritableComputedRef<boolean>;
  isDragging: ComputedRef<boolean>;
  isAllowed: ComputedRef<boolean>;
  isDragOver: ComputedRef<IPlacement | undefined>;
}

export function makeDraggable(
  ref: TDnDNodeRef,
  payload?: TDraggablePayload
): IMakeDraggableReturnType;
export function makeDraggable(
  ref: TDnDNodeRef,
  options: IMakeDraggableOptions,
  payload?: TDraggablePayload
): IMakeDraggableReturnType;
export function makeDraggable(
  ref: TDnDNodeRef,
  optionsOrPayload?: IMakeDraggableOptions | TDraggablePayload,
  payload?: TDraggablePayload
): IMakeDraggableReturnType {
  const provider = useDnDProviderInternal();

  let options: IMakeDraggableOptions;
  let finalPayload: TDraggablePayload | undefined;
  let container: HTMLElement | null;

  if (typeof optionsOrPayload === 'function') {
    options = {};
    finalPayload = optionsOrPayload;
  } else {
    options = optionsOrPayload ?? {};
    finalPayload = payload;
  }

  // Stable id: user-provided for virtual lists, otherwise auto-generated once per instance
  const id = options.id ?? Math.random().toString(36).slice(2);

  const selected = computed({
    get() {
      const node = getNode(ref);
      if (!node) return false;
      return provider.entities.selectedSet.has(node);
    },
    set(value) {
      const node = getNode(ref);
      if (!node) return;
      provider.entities.selectedSet[value ? 'add' : 'delete'](node);
    },
  });

  const isDragging = computed(() => {
    const node = getNode(ref);
    if (!node) return false;
    return provider.entities.draggingMap.has(node);
  });

  const isAllowed = computed(() => {
    const container = getNode(ref);
    if (!container) return false;
    return provider.entities.allowedDraggableSet.has(container);
  });

  const isDragOver = computed(() => {
    const node = getNode(ref);
    if (!node) return undefined;
    return provider.entities.draggableMap.get(node)?.hoveredPlacement;
  });

  onMounted(() => {
    container = getNode(ref);
    if (!container) return;

    container.addEventListener('dragstart', preventEvent);
    container.addEventListener('drag', preventEvent);
    container.addEventListener('dragend', preventEvent);

    container.setAttribute(DnDAttributes.DRAGGABLE, id);

    provider.lib.draggableObserver.observe(container);

    provider.entities.draggableMap.set(container, {
      id,
      render: options.render,
      disabled: (options.disabled as boolean) ?? false,
      groups: (options.groups as string[]) ?? [],
      modifier: options.modifier as IModifier,
      events: options.events,
      payload: finalPayload,
      data: options.data,
      dragHandle: options.dragHandle as string,
      activation: options.activation as IDragActivation,
      placementMargins: options.placementMargins,
      hoveredPlacement: undefined,
    });

    // Virtual list remount: if an element with the same id is still in draggingMap
    // (scrolled out while being dragged), remap the entry to the new element so
    // isDragging stays correct and the item is not treated as a hover target
    if (id) {
      for (const [oldEl, draggingEntity] of provider.entities.draggingMap) {
        if (draggingEntity.id === id && oldEl !== container) {
          provider.entities.draggingMap.delete(oldEl);
          provider.entities.draggingMap.set(container, draggingEntity);
          break;
        }
      }
    }
  });

  onBeforeUnmount(() => {
    if (!container) return;

    provider.lib.draggableObserver.unobserve(container);
    provider.entities.visibleDraggableSet.delete(container);
    provider.entities.draggableMap.delete(container);
    provider.entities.modifiersDraggableSet.delete(container);
  });

  return {
    selected,
    isDragging,
    isAllowed,
    isDragOver,
  };
}
