import { computed, ref } from 'vue';

import type { IUseDropOptions } from '../types';
import { useDnDStore } from '../composables/useDnDStore';

export const useZoneManager = (options?: IUseDropOptions) => {
  const { zonesMap, hovered, draggingElements, isDragging } = useDnDStore();

  const elementRef = ref<HTMLElement | null>(null);

  const isOvered = computed<boolean>(() => {
    return hovered.zone.value?.node === elementRef.value;
  });

  const isAllowed = computed<boolean>(() => {
    if (!elementRef.value || !isDragging.value) return false;

    const currentZone = zonesMap.value.get(elementRef.value);
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

    zonesMap.value.set(elementRef.value, {
      node: elementRef.value,
      groups: options?.groups ?? [],
      events: options?.events ?? {},
      data: options?.data ?? undefined,
    });

    elementRef.value.setAttribute('data-dnd-droppable', 'true');
  };

  const unregisterZone = () => {
    if (!elementRef.value) return;

    zonesMap.value.delete(elementRef.value);
  };

  return { elementRef, registerZone, unregisterZone, isOvered, isAllowed };
};
