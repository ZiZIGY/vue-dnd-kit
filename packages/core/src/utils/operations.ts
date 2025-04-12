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
      store.draggingElements.value.forEach((element) =>
        DnDOperations.move(
          element.data?.source,
          element.data?.index,
          hoveredElement.data?.source,
          hoveredElement.data?.index
        )
      );
    } else {
      store.draggingElements.value.forEach((element) =>
        DnDOperations.move(
          element.data?.source,
          element.data?.index,
          hoveredZone?.data?.source,
          hoveredZone?.data?.source.length
        )
      );
    }
  };

  static applyCopy = (store: IDnDStore) => {
    const hoveredElement = store.hovered.element.value;
    const hoveredZone = store.hovered.zone.value;

    if (hoveredElement) {
      store.draggingElements.value.forEach((element) =>
        DnDOperations.copy(
          element.data?.source,
          element.data?.index,
          hoveredElement.data?.source,
          hoveredElement.data?.index
        )
      );
    } else {
      store.draggingElements.value.forEach((element) =>
        DnDOperations.copy(
          element.data?.source,
          element.data?.index,
          hoveredZone?.data?.source,
          hoveredZone?.data?.source.length
        )
      );
    }
  };
  static applySwap = (store: IDnDStore) => {
    const hoveredElement = store.hovered.element.value;
    const hoveredZone = store.hovered.zone.value;
    if (hoveredElement && store.draggingElements.value.length === 1) {
      const element = store.draggingElements.value[0];
      DnDOperations.swap(
        element.data?.source,
        element.data?.index,
        hoveredElement.data?.source,
        hoveredElement.data?.index
      );
    } else {
      store.draggingElements.value.forEach((element) =>
        DnDOperations.move(
          element.data?.source,
          element.data?.index,
          hoveredZone?.data?.source,
          hoveredZone?.data?.source.length
        )
      );
    }
  };
  static applyRemove = (store: IDnDStore) => {
    store.draggingElements.value.forEach((element) => {
      if (element.data?.source && element.data?.index !== undefined) {
        DnDOperations.remove(element.data.source, element.data.index);
      }
    });
  };
  static applyInsert = (store: IDnDStore, items: any[]) => {
    const hoveredElement = store.hovered.element.value;
    const hoveredZone = store.hovered.zone.value;
    if (hoveredElement && items.length > 0) {
      items.forEach((item) => {
        DnDOperations.insert(
          hoveredElement.data?.source,
          hoveredElement.data?.index,
          item
        );
      });
    } else {
      items.forEach((item) => {
        DnDOperations.insert(
          hoveredZone?.data?.source,
          hoveredZone?.data?.source.length,
          item
        );
      });
    }
  };
}
