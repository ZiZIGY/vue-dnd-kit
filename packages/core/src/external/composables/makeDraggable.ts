import type {
  IBaseOptions,
  IDragActivation,
  IDragActivationOptions,
  IDraggableEvents,
  IModifier,
  IModifierOptions,
  TDnDNodeRef,
  TDraggablePayload,
  TModifierMethod,
} from '../types';
import {
  computed,
  onBeforeUnmount,
  onMounted,
  type Component,
  type ComputedRef,
  type Ref,
  type ShallowRef,
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
}

interface IMakeDraggableReturnType {
  distanceProgress: ComputedRef<number>;
  delayProgress: ShallowRef<number>;
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
  
  const provider = useDnDProviderInternal()
  
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
    distanceProgress: provider.distanceProgress,
    delayProgress: provider.delayProgress,
  };
}
