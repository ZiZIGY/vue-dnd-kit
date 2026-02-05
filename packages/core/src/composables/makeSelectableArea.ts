import { computed, inject, onBeforeUnmount, onMounted, onUnmounted, type Ref } from 'vue';
// import {
//   checkIsSelectableArea,
//   checkModifierKeys,
//   getBoundedSelectionArea,
// } from '../utils/selection';
import { getNode } from '../utils/dom';
import { DnDAttributes } from '../utils/namespaces';

import type {
  IBaseOptions,
  IDnDProvider,
  IModifier,
  TDnDNodeRef,
  TModifierKeys,
  TModifierMethod,
} from '../types';
import { getBoundedSelectionArea } from '../utils/selection';
import { useDnDProvider } from './useDnDProvider';

interface ISelectableAreaOptions extends IBaseOptions {
  modifier?: {
    keys: TModifierKeys | Ref<TModifierKeys>;
    method: TModifierMethod | Ref<TModifierMethod>;
  };
}

export const makeSelectableArea = (
  nodeRef: TDnDNodeRef,
  options?: ISelectableAreaOptions
) => {
  const provider = useDnDProvider()

  const isSelecting = computed(() => {
    return nodeRef.value === provider.entities.selectingArea;
  });

  let container: HTMLElement | null = null;

  onMounted(() => {
    container = getNode(nodeRef);
    if (!container) return;
    container.setAttribute(DnDAttributes.SELECT_AREA, '');

    provider.lib.selectableAreaObserver.observe(container);
    provider.entities.selectableAreaMap.set(container, {
      modifier: (options?.modifier as IModifier) ?? {
        keys: ['ControlLeft'],
        method: 'every',
      },
      disabled: (options?.disabled as boolean) ?? false,
      groups: (options?.groups as string[]) ?? [],
    });
  });

  onBeforeUnmount(() => {
    if (!container) return;

    provider.lib.selectableAreaObserver.unobserve(container);
    provider.entities.visibleSelectableAreaSet.delete(container);
    provider.entities.modifiersSelectableAreaSet.delete(container);
    provider.entities.selectableAreaMap.delete(container);
  });

  const style = computed(() => {
    provider.scrollPosition.x;
    provider.scrollPosition.y;

    const pointer = provider.pointer.value;
    if (!pointer || provider.state.value !== 'selecting' || !container) {
      return {};
    }

    return getBoundedSelectionArea(pointer.start, pointer.current, container);
  });

  return {
    isSelecting,
    style,
  };
};
