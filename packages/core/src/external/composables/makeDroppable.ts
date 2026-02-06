import type { IBaseOptions, IDroppableEvents, TDnDNodeRef } from '../types';
import { onBeforeUnmount, onMounted } from 'vue';

import { DnDAttributes } from '../../internal/utils/namespaces';
import { getNode } from '../../internal/utils/dom';
import { useDnDProviderInternal } from '../../internal/composables/useDnDProviderInternal';

interface IMakeDroppableOptions extends IBaseOptions {
  events?: IDroppableEvents;
}

export function makeDroppable(ref: TDnDNodeRef, options: IMakeDroppableOptions = {}): void {
  const provider = useDnDProviderInternal();
  let container: HTMLElement | null = null;

  onMounted(() => {
    container = getNode(ref);
    if (!container) return;

    container.setAttribute(DnDAttributes.DROPPABLE, '');
    provider.lib.droppableObserver.observe(container);

    provider.entities.droppableMap.set(container, {
      disabled: (options.disabled as boolean) ?? false,
      groups: (options.groups as string[]) ?? [],
      events: options.events,
    });
  });

  onBeforeUnmount(() => {
    if (!container) return;

    provider.lib.droppableObserver.unobserve(container);
    provider.entities.visibleDroppableSet.delete(container);
    provider.entities.droppableMap.delete(container);
  });
}
