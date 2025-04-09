import { App } from 'vue';

export declare const VueDndKitPlugin: {
    install(app: App): void;
};
declare module '@vue/runtime-core' {
    interface App {
        __VUE_DND_KIT_OVERLAY__?: {
            container: HTMLElement;
            vnode: any;
        };
    }
}
