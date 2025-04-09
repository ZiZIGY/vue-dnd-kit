import { IUseSensorOptions } from "../types";
import { Ref } from 'vue';

export declare const useSensor: (elementRef: Ref<HTMLElement | null>, options?: IUseSensorOptions) => {
    activate: (event: PointerEvent) => void;
    track: (event: PointerEvent | WheelEvent) => void;
    deactivate: () => void;
};
