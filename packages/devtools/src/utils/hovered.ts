import { CustomInspectorState } from '@vue/devtools-api';
import { useDnDStore } from '@vue-dnd-kit/core';

export const createHovered = (
  store: ReturnType<typeof useDnDStore>
): CustomInspectorState => ({
  state: [
    {
      key: 'element',
      value: store.hovered.element.value,
    },
    {
      key: 'zone',
      value: store.hovered.zone.value,
    },
  ],
});
