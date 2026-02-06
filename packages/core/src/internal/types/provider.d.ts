import type { IDnDProviderExternal } from "../../external";

export interface IDnDProviderInternal extends IDnDProviderExternal {
  lib: {
    draggableObserver: IIntersectionObserverWrapper;
    droppableObserver: IIntersectionObserverWrapper;
    selectableAreaObserver: IIntersectionObserverWrapper;
  };
}

export interface IIntersectionObserverWrapper {
  observe: (element: HTMLElement) => void;
  unobserve: (element: HTMLElement) => void;
  disconnect: () => void;
}