import { computed, ref } from 'vue';

import type { IUseDropOptions } from '../types';
import { useDnDStore } from '../composables/useDnDStore';

export const useZoneManager = (options?: IUseDropOptions) => {
  const { zones, hovered, draggingElements, isDragging } = useDnDStore();

  const elementRef = ref<HTMLElement | null>(null);

  const isOvered = computed<boolean>(() => {
    return hovered.zone.value?.node === elementRef.value;
  });

  const isAllowed = computed<boolean>(() => {
    if (!elementRef.value || !isDragging.value) return false;

    const currentZone = zones.value.find(
      (zone) => zone.node === elementRef.value
    );
    if (!currentZone?.groups.length) return true;

    return !draggingElements.value.some((element) => {
      if (!element.groups.length) return false;
      return !element.groups.some((group) =>
        currentZone.groups.includes(group)
      );
    });
  });

  const registerZone = () => {
    if (!elementRef.value) throw new Error('elementRef is not set');

    zones.value.push({
      node: elementRef.value,
      groups: options?.groups ?? [],
      events: options?.events ?? {},
      data: options?.data ?? undefined,
    });

    elementRef.value.setAttribute('data-dnd-droppable', 'true');
  };

  const unregisterZone = () => {
    if (!elementRef.value) throw new Error('elementRef is not set');

    const index = zones.value.findIndex(
      (zone) => zone.node === elementRef.value
    );

    if (index !== -1) zones.value.splice(index, 1);
  };

  return { elementRef, registerZone, unregisterZone, isOvered, isAllowed };
};
