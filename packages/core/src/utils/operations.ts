import { IDnDStore } from '../types';

export class DnDOperations {
  static remove = (source?: any[], index?: number) => {
    if (!source || index === undefined) return;
    const [item] = source.splice(index, 1);
    return item;
  };
  static insert = (target?: any[], index?: number, item?: any) => {
    if (!target || index === undefined) return;
    target.splice(index, 0, item);
  };
  static move = (
    source?: any[],
    sourceIndex?: number,
    target?: any[],
    targetIndex?: number
  ) => {
    if (
      !source ||
      !target ||
      sourceIndex === undefined ||
      targetIndex === undefined
    )
      return;
    const item = DnDOperations.remove(source, sourceIndex);
    DnDOperations.insert(target, targetIndex, item);
  };
  static swap = (
    source?: any[],
    sourceIndex?: number,
    target?: any[],
    targetIndex?: number
  ) => {
    if (
      !source ||
      !target ||
      sourceIndex === undefined ||
      targetIndex === undefined
    )
      return;

    const sourceItem = source[sourceIndex];
    const targetItem = target[targetIndex];

    source[sourceIndex] = targetItem;
    target[targetIndex] = sourceItem;
  };
  static copy = (
    source?: any[],
    index?: number,
    target?: any[],
    targetIndex?: number
  ) => {
    if (!source || index === undefined || !target || targetIndex === undefined)
      return;
    const item = source[index];
    DnDOperations.insert(target, targetIndex, item);
  };
  static applyTransfer = (store: IDnDStore) => {
    const hoveredElement = store.hovered.element.value;
    const hoveredZone = store.hovered.zone.value;

    if (hoveredElement) {
      const targetSource =
        store.elementsMap.value.get(hoveredElement)?.data?.source;
      const targetIndex =
        store.elementsMap.value.get(hoveredElement)?.data?.index;

      const firstElement = store.draggingElements.value.values().next().value;
      const firstIndex = firstElement?.data?.index;

      const sortDirection =
        firstIndex !== undefined &&
        targetIndex !== undefined &&
        firstIndex > targetIndex
          ? 1
          : -1;

      const sortedElements = Array.from(
        store.draggingElements.value.values()
      ).sort(
        (a, b) => sortDirection * ((a.data?.index || 0) - (b.data?.index || 0))
      );

      sortedElements.forEach((element) =>
        DnDOperations.move(
          element.data?.source,
          element.data?.index,
          targetSource,
          targetIndex
        )
      );
    } else if (hoveredZone) {
      const targetSource = store.zonesMap.value.get(hoveredZone)?.data?.source;
      const targetIndex = targetSource?.length;

      const sortedElements = Array.from(
        store.draggingElements.value.values()
      ).sort((a, b) => (b.data?.index || 0) - (a.data?.index || 0));

      sortedElements.forEach((element) =>
        DnDOperations.move(
          element.data?.source,
          element.data?.index,
          targetSource,
          targetIndex
        )
      );
    }
  };

  static applyCopy = (store: IDnDStore) => {
    const hoveredElement = store.hovered.element.value;
    const hoveredZone = store.hovered.zone.value;

    if (hoveredElement) {
      const targetSource =
        store.elementsMap.value.get(hoveredElement)?.data?.source;
      const targetIndex =
        store.elementsMap.value.get(hoveredElement)?.data?.index;

      const firstElement = store.draggingElements.value.values().next().value;
      const firstIndex = firstElement?.data?.index;

      const sortDirection =
        firstIndex !== undefined &&
        targetIndex !== undefined &&
        firstIndex > targetIndex
          ? 1
          : -1;

      const sortedElements = Array.from(
        store.draggingElements.value.values()
      ).sort(
        (a, b) => sortDirection * ((a.data?.index || 0) - (b.data?.index || 0))
      );

      sortedElements.forEach((element) =>
        DnDOperations.copy(
          element.data?.source,
          element.data?.index,
          targetSource,
          targetIndex
        )
      );
    } else if (hoveredZone) {
      const targetSource = store.zonesMap.value.get(hoveredZone)?.data?.source;
      const targetIndex = targetSource?.length;

      const sortedElements = Array.from(
        store.draggingElements.value.values()
      ).sort((a, b) => (b.data?.index || 0) - (a.data?.index || 0));

      sortedElements.forEach((element) =>
        DnDOperations.copy(
          element.data?.source,
          element.data?.index,
          targetSource,
          targetIndex
        )
      );
    }
  };
  static applySwap = (store: IDnDStore) => {
    const hoveredElement = store.hovered.element.value;
    const hoveredZone = store.hovered.zone.value;

    if (hoveredElement && store.draggingElements.value.size === 1) {
      const element = store.draggingElements.value.values().next().value;
      DnDOperations.swap(
        element?.data?.source,
        element?.data?.index,
        store.elementsMap.value.get(hoveredElement)?.data?.source,
        store.elementsMap.value.get(hoveredElement)?.data?.index
      );
    } else if (hoveredZone) {
      const targetSource = store.zonesMap.value.get(hoveredZone)?.data?.source;
      const targetIndex = targetSource?.length;

      const sortedElements = Array.from(
        store.draggingElements.value.values()
      ).sort((a, b) => (b.data?.index || 0) - (a.data?.index || 0));

      sortedElements.forEach((element) =>
        DnDOperations.move(
          element.data?.source,
          element.data?.index,
          targetSource,
          targetIndex
        )
      );
    }
  };
  static applyRemove = (store: IDnDStore) => {
    const sortedElements = Array.from(
      store.draggingElements.value.values()
    ).sort((a, b) => (b.data?.index || 0) - (a.data?.index || 0));

    sortedElements.forEach((element) => {
      if (element.data?.source && element.data?.index !== undefined) {
        DnDOperations.remove(element.data.source, element.data.index);
      }
    });
  };
  static applyInsert = (store: IDnDStore, items: any[]) => {
    const hoveredElement = store.hovered.element.value;
    const hoveredZone = store.hovered.zone.value;

    if (hoveredElement && items.length > 0) {
      const targetSource =
        store.elementsMap.value.get(hoveredElement)?.data?.source;
      const targetIndex =
        store.elementsMap.value.get(hoveredElement)?.data?.index;

      items.forEach((item) => {
        DnDOperations.insert(targetSource, targetIndex, item);
      });
    } else if (hoveredZone) {
      const targetSource = store.zonesMap.value.get(hoveredZone)?.data?.source;
      const targetIndex = targetSource?.length;

      items.forEach((item) => {
        DnDOperations.insert(targetSource, targetIndex, item);
      });
    }
  };
}
