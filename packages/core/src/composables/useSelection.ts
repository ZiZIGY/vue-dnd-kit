import { computed, type Ref } from 'vue';
import { useDnDStore } from './useDnDStore';
import { isDescendant } from '../utils/dom';

export const useSelection = (elementRef: Ref<HTMLElement | null>) => {
  const { selectedElementsMap, elementsMap } = useDnDStore();

  const isSelected = computed<boolean>(() =>
    elementRef.value ? selectedElementsMap.value.has(elementRef.value) : false
  );

  const isParentOfSelected = computed(() => {
    if (!elementRef.value) return false;

    for (const [node, _] of selectedElementsMap.value.entries()) {
      if (
        node &&
        isDescendant(node as HTMLElement, elementRef.value as HTMLElement)
      ) {
        return true;
      }
    }
    return false;
  });

  const hasSelectedParent = computed(() => {
    if (!elementRef.value) return false;

    for (const [node, _] of selectedElementsMap.value.entries()) {
      if (
        node &&
        isDescendant(elementRef.value as HTMLElement, node as HTMLElement)
      ) {
        return true;
      }
    }
    return false;
  });

  const handleUnselect = () => {
    if (!elementRef.value) return;
    selectedElementsMap.value.delete(elementRef.value);
  };

  const handleSelect = () => {
    if (!elementRef.value) return;
    const element = elementsMap.value.get(elementRef.value);
    if (!element) return;

    if (isParentOfSelected.value) {
      // Удаляем все дочерние выбранные элементы
      for (const [node, _] of [...selectedElementsMap.value.entries()]) {
        if (
          node &&
          isDescendant(node as HTMLElement, elementRef.value as HTMLElement)
        ) {
          selectedElementsMap.value.delete(node);
        }
      }
    }

    if (hasSelectedParent.value) {
      // Удаляем все родительские выбранные элементы
      for (const [node, _] of [...selectedElementsMap.value.entries()]) {
        if (
          node &&
          isDescendant(elementRef.value as HTMLElement, node as HTMLElement)
        ) {
          selectedElementsMap.value.delete(node);
        }
      }
    }

    selectedElementsMap.value.set(elementRef.value, element);
  };

  const handleToggleSelect = () => {
    if (!elementRef.value) return;

    selectedElementsMap.value.has(elementRef.value)
      ? handleUnselect()
      : handleSelect();
  };

  return {
    handleUnselect,
    handleSelect,
    handleToggleSelect,
    isSelected,
    isParentOfSelected,
  };
};
