import { computed, type Ref } from 'vue';
import { useDnDStore } from './useDnDStore';
import { isDescendant } from '../utils/dom';

/**
 * Hook for managing element selection in drag and drop interface
 * @param elementRef - Reference to the HTML element that can be selected
 * @returns Object containing selection state and handlers
 */
export const useSelection = (elementRef: Ref<HTMLElement | null>) => {
  const { selectedElements, elements } = useDnDStore();

  /** Current element from the DnD store */
  const element = computed(() =>
    elements.value.find((element) => element.node === elementRef.value)
  );

  /** Whether the current element is selected */
  const isSelected = computed<boolean>(() =>
    selectedElements.value.some((element) => element.node === elementRef.value)
  );

  /** Whether the current element contains any selected elements */
  const isParentOfSelected = computed(() => {
    if (!elementRef.value) return false;
    return selectedElements.value.some(
      (selected) =>
        selected.node &&
        isDescendant(
          selected.node as HTMLElement,
          elementRef.value as HTMLElement
        )
    );
  });

  /** Whether the current element has a selected ancestor */
  const hasSelectedParent = computed(() => {
    if (!elementRef.value) return false;
    return selectedElements.value.some(
      (selected) =>
        selected.node &&
        isDescendant(
          elementRef.value as HTMLElement,
          selected.node as HTMLElement
        )
    );
  });

  /** Removes the current element from selection */
  const handleUnselect = () => {
    if (!element.value) return;

    selectedElements.value = selectedElements.value.filter(
      (element) => element.node !== elementRef.value
    );
  };

  /**
   * Adds the current element to selection.
   * If element contains selected elements, they will be unselected.
   * If element has selected parent, parent will be unselected.
   */
  const handleSelect = () => {
    if (!element.value) return;

    // If element contains selected elements, remove them and select the parent
    if (isParentOfSelected.value) {
      selectedElements.value = selectedElements.value.filter(
        (selected) =>
          selected.node &&
          !isDescendant(
            selected.node as HTMLElement,
            elementRef.value as HTMLElement
          )
      );
    }

    // If element has selected parent, remove parent from selection
    if (hasSelectedParent.value) {
      selectedElements.value = selectedElements.value.filter(
        (selected) =>
          selected.node &&
          !isDescendant(
            elementRef.value as HTMLElement,
            selected.node as HTMLElement
          )
      );
    }

    selectedElements.value.push(element.value);
  };

  /** Toggles selection state of the current element */
  const handleToggleSelect = () => {
    if (!element.value) return;

    selectedElements.value.some((element) => element.node === elementRef.value)
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
