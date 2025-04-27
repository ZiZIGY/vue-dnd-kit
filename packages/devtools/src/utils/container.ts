import { CustomInspectorState } from '@vue/devtools-api';
import { useDnDStore } from '@vue-dnd-kit/core';

export const createContainer = (
  store: ReturnType<typeof useDnDStore>
): CustomInspectorState => ({
  state: [
    {
      key: 'component',
      value: store.activeContainer.component.value,
      objectType: 'ref',
    },
    {
      key: 'ref',
      value: store.activeContainer.ref.value,
      objectType: 'ref',
    },
  ],
});
