import { IUseDragOptions } from "../types";

/**
 * Hook for managing draggable elements and their interactions.
 * Provides methods for registering, unregistering elements,
 * checking if an element is being dragged, and determining if it can be dropped.
 *
 * @param options - Optional configuration object for element management
 * @returns Object containing element management state and methods
 */
export declare const useElementManager: (options?: IUseDragOptions) => {
    elementRef: import('vue').Ref<HTMLElement | null, HTMLElement | null>;
    registerElement: () => void;
    unregisterElement: () => void;
    isDragging: import('vue').ComputedRef<boolean>;
    isOvered: import('vue').ComputedRef<boolean>;
    isAllowed: import('vue').ComputedRef<boolean>;
};
