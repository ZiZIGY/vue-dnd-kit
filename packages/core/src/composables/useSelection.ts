import { computed, type Ref } from 'vue';
import { useDnDStore } from './useDnDStore';
import { isDescendant } from '../utils/dom';

export const useSelection = (elementRef: Ref<HTMLElement | null>) => {
  const { selectedElements, elementsMap } = useDnDStore();

  const isSelected = computed<boolean>(() =>
    elementRef.value ? selectedElements.value.has(elementRef.value) : false
  );

  const isParentOfSelected = computed(() => {
    if (!elementRef.value) return false;

    for (const node of selectedElements.value) {
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

    for (const node of selectedElements.value) {
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
    selectedElements.value.delete(elementRef.value);
  };

  const handleSelect = () => {
    if (!elementRef.value) return;
    const element = elementsMap.value.get(elementRef.value);
    if (!element) return;

    if (isParentOfSelected.value) {
      // Удаляем все дочерние выбранные элементы
      for (const node of selectedElements.value) {
        if (
          node &&
          isDescendant(node as HTMLElement, elementRef.value as HTMLElement)
        ) {
          selectedElements.value.delete(node);
        }
      }
    }

    if (hasSelectedParent.value) {
      // Удаляем все родительские выбранные элементы
      for (const node of selectedElements.value) {
        if (
          node &&
          isDescendant(elementRef.value as HTMLElement, node as HTMLElement)
        ) {
          selectedElements.value.delete(node);
        }
      }
    }

    selectedElements.value.add(elementRef.value);
  };

  const handleToggleSelect = () => {
    if (!elementRef.value) return;

    selectedElements.value.has(elementRef.value)
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
