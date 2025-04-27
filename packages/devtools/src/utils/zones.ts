import { CustomInspectorState } from '@vue/devtools-api';
import { useDnDStore } from '@vue-dnd-kit/core';

export const createZones = (
  store: ReturnType<typeof useDnDStore>
): CustomInspectorState => ({
  state: [
    {
      key: 'zonesMap',
      value: store.zonesMap.value,
      objectType: 'ref',
    },
    {
      key: 'visibleZones',
      value: store.visibleZones.value,
      objectType: 'ref',
    },
  ],
});
