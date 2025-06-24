import { DnDOperations, IDnDPayload, IDnDStore } from '@vue-dnd-kit/core';
import { IHTMLBuilderDraggable, IHTMLBuilderElement } from './types';
import { toRaw, shallowRef } from 'vue';
import { createGlobalState } from '@vueuse/core';

export const handleDropArea = (
  store: IDnDStore,
  payload: IDnDPayload,
  components?: IHTMLBuilderElement[]
) => {
  const [item] = payload.items;

  const itemData = item.data as IHTMLBuilderDraggable;
  const hovered = store.hovered.element.value;

  if (item.data?.type === 'created') {
    if (hovered) {
      const hoveredElement = store.elementsMap.value.get(hovered);

      if (hoveredElement) {
        hoveredElement.data?.source?.splice(
          hoveredElement.data?.index ?? 0,
          0,
          {
            id: crypto.randomUUID(),
            ...structuredClone(toRaw(itemData)),
          }
        );
      }
    } else {
      components?.push({
        id: crypto.randomUUID(),
        ...structuredClone(toRaw(itemData)),
      });
    }
  } else {
    if (store.keyboard.ctrl.value) {
      DnDOperations.applySwap(store);
    } else DnDOperations.applyTransfer(store);
  }
};

export const createHTMLBuilderElement = (
  template: IHTMLBuilderDraggable
): IHTMLBuilderElement => {
  const { type, ...element } = structuredClone(toRaw(template));

  return {
    id: crypto.randomUUID(),
    ...element,
  };
};

export const useHTMLBuilderStore = createGlobalState(() => {
  const activeElement = shallowRef<IHTMLBuilderElement | null>(null);
  const autoFocus = shallowRef<boolean>(true);

  return {
    activeElement,
    autoFocus,
  };
});
