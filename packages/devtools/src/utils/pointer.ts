import type { CustomInspectorState } from '@vue/devtools-api';
import { useDnDStore } from '@vue-dnd-kit/core';

export const createPointer = (
  store: ReturnType<typeof useDnDStore>
): CustomInspectorState => ({
  state: [
    {
      key: 'current',
      value: store.pointerPosition.current.value,
      objectType: 'ref',
    },
    {
      key: 'start',
      value: store.pointerPosition.start.value,
      objectType: 'ref',
    },
    {
      key: 'offset',
      value: {
        percent: store.pointerPosition.offset.percent.value,
        pixel: store.pointerPosition.offset.pixel.value,
      },
    },
  ],
});
