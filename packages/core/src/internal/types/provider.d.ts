import type { Ref } from "vue";
import type { IDnDProviderExternal } from "../../external";
import type { IIntersectionObserverWrapper } from "./observer";

export interface IDnDProviderInternal extends IDnDProviderExternal {
  lib: {
    draggableObserver: IIntersectionObserverWrapper;
    droppableObserver: IIntersectionObserverWrapper;
    selectableAreaObserver: IIntersectionObserverWrapper;
    overlaySizeObserver: { disconnect: () => void };
  };
}