import { inject, onBeforeUnmount, onMounted } from 'vue';

import type {
  IBaseOptions,
  IDnDProvider,
  IDraggableEvents,
  TDnDNodeRef,
  TDraggablePayload,
} from '../types';

interface IDraggableOptions extends IBaseOptions {
  events?: IDraggableEvents;
}

export const makeDraggable = (
  ref: TDnDNodeRef,
  options: IDraggableOptions,
  payload?: TDraggablePayload
) => {
  const provider = inject<IDnDProvider>('DnDProvider')!;

  onMounted(() => {
    provider.entities.draggableMap.set(ref.value, {
      disabled: (options.disabled as boolean) ?? false,
      events: options.events,
      groups: (options.groups as string[]) ?? [],
      payload,
    });
  });

  onBeforeUnmount(() => {
    provider.entities.draggableMap.delete(ref.value);
  });

  return {
    ...provider,
  };
};
