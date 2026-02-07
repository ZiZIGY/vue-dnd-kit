import { computed,  onBeforeUnmount, onMounted, type Ref } from 'vue';
import { getNode } from '../../internal/utils/dom';
import { DnDAttributes } from '../../internal/utils/namespaces';

import type {
  IBaseOptions,
  IModifier,
  ISelectableAreaEvents,
  TDnDNodeRef,
  TModifierKeys,
  TModifierMethod,
} from '../types';
import { getBoundedSelectionArea } from '../../internal/utils/selection';
import { useDnDProviderInternal } from '../../internal/composables/useDnDProviderInternal';

interface ISelectableAreaOptions extends IBaseOptions {
  modifier?: {
    keys: TModifierKeys | Ref<TModifierKeys>;
    method: TModifierMethod | Ref<TModifierMethod>;
  };
  events?: ISelectableAreaEvents;
}

export const makeSelectableArea = (
  nodeRef: TDnDNodeRef,
  options?: ISelectableAreaOptions
) => {
  const provider = useDnDProviderInternal()

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
      events: options?.events,
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
