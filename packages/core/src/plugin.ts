import { createVNode, render } from 'vue';

import type { App } from 'vue';
import DragOverlay from './components/DragOverlay.vue';
import { IPluginOptions } from './types';
import { useDnDStore } from './composables/useDnDStore';

export const VueDndKitPlugin = {
  install(app: App, options?: IPluginOptions) {
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

          // Передаем опции напрямую в компонент
          const vnode = createVNode(DragOverlay, {
            styles: options?.defaultOverlay?.styles,
          });
          render(vnode, overlayContainer);

          app.__VUE_DND_KIT_OVERLAY__ = {
            container: overlayContainer,
            vnode,
            options: options?.defaultOverlay || {},
          };

          const store = useDnDStore();
          app.__VUE_DND_KIT_STORE__ = store;
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
      options: IPluginOptions['defaultOverlay'];
    };
    __VUE_DND_KIT_STORE__?: ReturnType<typeof useDnDStore>;
  }
}
