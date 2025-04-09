import { Ref } from 'vue';

/**
 * Hook for managing element selection in drag and drop interface
 * @param elementRef - Reference to the HTML element that can be selected
 * @returns Object containing selection state and handlers
 */
export declare const useSelection: (elementRef: Ref<HTMLElement | null>) => {
    handleUnselect: () => void;
    handleSelect: () => void;
    handleToggleSelect: () => void;
    isSelected: import('vue').ComputedRef<boolean>;
    isParentOfSelected: import('vue').ComputedRef<boolean>;
};
