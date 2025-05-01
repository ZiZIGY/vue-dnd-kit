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
    {
      key: 'animating',
      value: {
        appear: store.activeContainer.animating.appear.value,
        enter: store.activeContainer.animating.enter.value,
        leave: store.activeContainer.animating.leave.value,
      },
      objectType: 'ref',
    },
    {
      key: 'options',
      value: store.activeContainer.options.value,
      objectType: 'ref',
    },
  ],
});
