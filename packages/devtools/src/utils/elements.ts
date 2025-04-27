import { CustomInspectorState } from '@vue/devtools-api';
import { useDnDStore } from '@vue-dnd-kit/core';

export const createElements = (
  store: ReturnType<typeof useDnDStore>
): CustomInspectorState => ({
  state: [
    {
      key: 'elementsMap',
      value: store.elementsMap.value,
      objectType: 'ref',
    },
    {
      key: 'visibleElements',
      value: store.visibleElements.value,
      objectType: 'ref',
    },
    {
      key: 'selectedElements',
      value: store.selectedElements.value,
      objectType: 'ref',
    },
    {
      key: 'draggingElements',
      value: store.draggingElements.value,
      objectType: 'ref',
    },
  ],
});
