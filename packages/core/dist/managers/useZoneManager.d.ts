import { IUseDropOptions } from "../types";

export declare const useZoneManager: (options?: IUseDropOptions) => {
    elementRef: import('vue').Ref<HTMLElement | null, HTMLElement | null>;
    registerZone: () => void;
    unregisterZone: () => void;
    isOvered: import('vue').ComputedRef<boolean>;
    isAllowed: import('vue').ComputedRef<boolean>;
};
