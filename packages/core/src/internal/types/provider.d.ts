import type { Ref } from 'vue';
import type { IDnDProviderExternal } from '../../external';
import type { IAutoScrollOptions } from '../../external/types/placement';
import type { IIntersectionObserverWrapper } from './observer';

export interface IKeyboardKeys {
  pressedKeys: Ref<Set<string>>;
  forDrag: string[];
  forCancel: string[];
  forDrop: string[];
  forMove: string[];
  forMoveFaster: string[];
}

export interface IKeyboardState {
  keys: IKeyboardKeys;
  step: number;
  moveFaster: number;
}

export interface IDnDProviderInternal extends IDnDProviderExternal {
  keyboard: IKeyboardState;
  lib: {
    draggableObserver: IIntersectionObserverWrapper;
    droppableObserver: IIntersectionObserverWrapper;
    selectableAreaObserver: IIntersectionObserverWrapper;
    overlaySizeObserver: { disconnect: () => void };
  };
}
