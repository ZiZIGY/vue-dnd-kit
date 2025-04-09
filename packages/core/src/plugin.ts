import { createVNode, render } from 'vue';

import type { App } from 'vue';
import DragOverlay from './components/DragOverlay.vue';

export const VueDndKitPlugin = {
  install(app: App) {
    app.component('DragOverlay', DragOverlay);
    const originalMount = app.mount;
    app.mount = function (rootContainer) {
      const instance = originalMount.call(this, rootContainer);

      const rootEl =
        typeof rootContainer === 'string'
          ? document.querySelector(rootContainer)
          : rootContainer;

      if (rootEl && rootEl instanceof Element) {
        if (!rootEl.querySelector('#vue-dnd-kit-overlay')) {
          const overlayContainer = document.createElement('div');

          overlayContainer.id = 'vue-dnd-kit-overlay';
          overlayContainer.style.pointerEvents = 'none';

          rootEl.appendChild(overlayContainer);
          const vnode = createVNode(DragOverlay);
          render(vnode, overlayContainer);
          app.__VUE_DND_KIT_OVERLAY__ = {
            container: overlayContainer,
            vnode,
          };
        }
      }

      return instance;
    };

    // Модифицируем метод unmount для очистки
    const originalUnmount = app.unmount;
    app.unmount = function () {
      if (app.__VUE_DND_KIT_OVERLAY__) {
        render(null, app.__VUE_DND_KIT_OVERLAY__.container);
        delete app.__VUE_DND_KIT_OVERLAY__;
      }
      return originalUnmount.call(this);
    };
  },
};

declare module '@vue/runtime-core' {
  export interface App {
    __VUE_DND_KIT_OVERLAY__?: {
      container: HTMLElement;
      vnode: any;
    };
  }
}
