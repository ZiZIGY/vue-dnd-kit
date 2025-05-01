import { CustomInspectorState } from '@vue/devtools-api';
import { useDnDStore } from '@vue-dnd-kit/core';

export const createStore = (
  store: ReturnType<typeof useDnDStore>
): CustomInspectorState => ({
  state: [
    {
      key: 'isDragging',
      value: store.isDragging.value,
      objectType: 'computed',
    },
    {
      key: 'elementsMap',
      value: store.elementsMap.value,
      objectType: 'ref',
    },
    {
      key: 'zonesMap',
      value: store.zonesMap.value,
      objectType: 'ref',
    },
    {
      key: 'visibleElements',
      value: store.visibleElements.value,
      objectType: 'ref',
    },
    {
      key: 'activeContainer',
      value: {
        component: store.activeContainer.component.value,
        ref: store.activeContainer.ref.value,
        animating: {
          appear: store.activeContainer.animating.appear.value,
          enter: store.activeContainer.animating.enter.value,
          leave: store.activeContainer.animating.leave.value,
        },
        options: store.activeContainer.options.value,
      },
    },
    {
      key: 'visibleZones',
      value: store.visibleZones.value,
      objectType: 'ref',
    },
    {
      key: 'draggingElements',
      value: store.draggingElements.value,
      objectType: 'ref',
    },
    {
      key: 'pointerPosition',
      value: {
        start: store.pointerPosition.start.value,
        current: store.pointerPosition.current.value,
        offset: {
          percent: store.pointerPosition.offset.percent.value,
          pixel: store.pointerPosition.offset.pixel.value,
        },
      },
    },

    {
      key: 'selectedElements',
      value: store.selectedElements.value,
      objectType: 'ref',
    },
    {
      key: 'keyboard',
      editable: true,
      value: {
        w: store.keyboard.w.value,
        s: store.keyboard.s.value,
        a: store.keyboard.a.value,
        d: store.keyboard.d.value,
      },
    },
    {
      key: 'hovered',
      value: {
        zone: store.hovered.zone.value,
        element: store.hovered.element.value,
      },
    },
  ],
});
