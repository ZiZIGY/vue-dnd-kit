import { onBeforeUnmount, onMounted } from 'vue';

import type { IUseDropOptions } from '../types';
import { useZoneManager } from '../managers/useZoneManager';

/**
 * Hook for creating drop zones that can accept dragged elements.
 * Manages drop zone registration and interaction states.
 *
 * @param options - Configuration options for drop zone
 * @param options.groups - Groups that this zone accepts. Elements can only be
 *                        dropped if they share at least one group with the zone
 * @param options.events - Event handlers for drop zone lifecycle
 * @param options.events.onDrop - Called when compatible element is dropped
 * @param options.events.onHover - Called when compatible element hovers
 * @param options.events.onLeave - Called when element leaves zone
 * @param options.data - Custom data accessible in event handlers
 *
 * @returns Object containing:
 * - elementRef: Reference to be bound to drop zone element
 * - isOvered: Whether zone is currently being hovered by dragged element
 * - isAllowed: Whether currently dragged element can be dropped (groups match)
 *
 * @example
 * ```vue
 * <template>
 *   <div
 *     ref="elementRef"
 *     :class="{
 *       'drop-zone': true,
 *       'zone-hovered': isOvered,
 *       'drop-allowed': isAllowed && isOvered,
 *       'drop-forbidden': !isAllowed && isOvered
 *     }"
 *   >
 *     <slot />
 *   </div>
 * </template>
 *
 * <script setup lang="ts">
 * const { elementRef, isOvered, isAllowed } = useDrop({
 *   // Зона принимает только элементы из группы 'items'
 *   groups: ['items'],
 *   events: {
 *     onDrop: (store) => {
 *       const droppedElements = store.draggingElements.value;
 *       console.log('Elements dropped!', droppedElements);
 *     },
 *     onHover: (store) => {
 *       // Подсветка зоны при наведении совместимого элемента
 *       if (isAllowed.value) {
 *         console.log('Compatible element hovering!');
 *       }
 *     },
 *     onLeave: () => {
 *       console.log('Element left drop zone');
 *     }
 *   },
 *   // Пользовательские данные доступны в обработчиках
 *   data: {
 *     zoneId: 'main-drop-zone',
 *     acceptLimit: 5
 *   }
 * });
 * </script>
 *
 * <style scoped>
 * .drop-zone {
 *   border: 2px dashed #ccc;
 *   padding: 20px;
 *   transition: all 0.3s;
 * }
 *
 * .zone-hovered {
 *   background: #f0f0f0;
 * }
 *
 * .drop-allowed {
 *   border-color: #4CAF50;
 *   background: #E8F5E9;
 * }
 *
 * .drop-forbidden {
 *   border-color: #F44336;
 *   background: #FFEBEE;
 * }
 * </style>
 * ```
 */
export const useDroppable = (options?: IUseDropOptions) => {
  const { elementRef, registerZone, unregisterZone, isOvered, isAllowed } =
    useZoneManager(options);

  // Register/unregister drop zone with store
  onMounted(registerZone);
  onBeforeUnmount(unregisterZone);

  return { elementRef, isOvered, isAllowed };
};
