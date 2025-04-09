import { Ref } from 'vue';

export declare const usePointer: (elementRef: Ref<HTMLElement | null>) => {
    onPointerStart: (event: PointerEvent) => void;
    onPointerMove: (event: PointerEvent | WheelEvent) => void;
    onPointerEnd: () => void;
};
