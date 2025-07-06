import type { App } from 'vue';
import { createVNode, render } from 'vue';
import { cleanupDnDProvider, createDnDProvider } from './provider/context';
import Overlay from './components/Overlay.vue';

// export interface IPluginOptions {
//   defaultOverlay?: {
//     styles?: Record<string, string>;
//   };
// }

export const VueDndKitPlugin = {
  install(app: App) {
    const dndProvider = createDnDProvider();

    app.__VUE_DND_KIT_STORE__ = dndProvider;
    app.component('VueDndKitOverlay', Overlay);

    const originalMount = app.mount;
    app.mount = function (rootContainer) {
      const instance = originalMount.call(this, rootContainer);

      const rootEl =
        typeof rootContainer === 'string'
          ? document.querySelector(rootContainer)
          : rootContainer;

      if (rootEl && rootEl instanceof Element) {
        if (!rootEl.querySelector('#dnd-kit-overlay')) {
          const overlayContainer = document.createElement('div');
          overlayContainer.id = 'dnd-kit-overlay';
          overlayContainer.style.pointerEvents = 'none';
          rootEl.appendChild(overlayContainer);

          const vnode = createVNode(Overlay, {});
          render(vnode, overlayContainer);

          app.__VUE_DND_KIT_OVERLAY__ = {
            container: overlayContainer,
            vnode,
          };
        }
      }

      return instance;
    };

    const originalUnmount = app.unmount;
    app.unmount = function () {
      if (app.__VUE_DND_KIT_OVERLAY__) {
        render(null, app.__VUE_DND_KIT_OVERLAY__.container);
        delete app.__VUE_DND_KIT_OVERLAY__;
      }

      cleanupDnDProvider();

      return originalUnmount.call(this);
    };
  },
};

declare module '@vue/runtime-core' {
  export interface App {
    __VUE_DND_KIT_STORE__?: ReturnType<typeof createDnDProvider>;
    __VUE_DND_KIT_OVERLAY__?: {
      container: HTMLElement;
      vnode: any;
    };
  }
}
