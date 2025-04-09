import { IUseDragOptions } from "../types";

export declare const useDraggable: (options?: IUseDragOptions) => {
    pointerPosition: {
        current: import('vue').Ref<{
            x: number;
            y: number;
        } | null, import('../types').IPoint | {
            x: number;
            y: number;
        } | null>;
        start: import('vue').Ref<{
            x: number;
            y: number;
        } | null, import('../types').IPoint | {
            x: number;
            y: number;
        } | null>;
        offset: {
            percent: import('vue').Ref<{
                x: number;
                y: number;
            } | null, import('../types').IPoint | {
                x: number;
                y: number;
            } | null>;
            pixel: import('vue').Ref<{
                x: number;
                y: number;
            } | null, import('../types').IPoint | {
                x: number;
                y: number;
            } | null>;
        };
    };
    elementRef: import('vue').Ref<HTMLElement | null, HTMLElement | null>;
    isDragging: import('vue').ComputedRef<boolean>;
    isOvered: import('vue').ComputedRef<boolean>;
    isAllowed: import('vue').ComputedRef<boolean>;
    handleDragStart: (event: PointerEvent) => void;
};
