import { onBeforeUnmount, onMounted } from 'vue';

import type { IUseDropOptions } from '../types';
import { useZoneManager } from '../managers/useZoneManager';

export const useDroppable = (options?: IUseDropOptions) => {
  const {
    elementRef,
    registerZone,
    unregisterZone,
    isOvered,
    isAllowed,
    isLazyAllowed,
  } = useZoneManager(options);

  // Register/unregister drop zone with store
  onMounted(registerZone);
  onBeforeUnmount(unregisterZone);

  return { elementRef, isOvered, isAllowed, isLazyAllowed };
};
