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
  events?: IDraggableEvents;
  modifier?: IModifierOptions;
  render?: Component;
  dragHandle?: string | Ref<string>;
  activation?: IDragActivationOptions;
  placementMargins?: IPlacementMargins;
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
    if (!node)
      return {
        bottom: false,
        left: false,
        right: false,
        top: false,
        center: false,
      };
    return provider.hovered.draggable.get(node);
  });

  onMounted(() => {
    container = getNode(ref);
    if (!container) return;

    container.addEventListener('dragstart', preventEvent);
    container.addEventListener('drag', preventEvent);
    container.addEventListener('dragend', preventEvent);

    container.setAttribute(DnDAttributes.DRAGGABLE, '');

    provider.lib.draggableObserver.observe(container);

    provider.entities.draggableMap.set(container, {
      render: options.render,
      disabled: (options.disabled as boolean) ?? false,
      groups: (options.groups as string[]) ?? [],
      modifier: options.modifier as IModifier,
      events: options.events,
      payload: finalPayload,
      dragHandle: options.dragHandle as string,
      activation: options.activation as IDragActivation,
      placementMargins: options.placementMargins,
    });
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
