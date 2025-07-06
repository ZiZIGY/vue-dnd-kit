import {
  ComponentPublicInstance,
  Ref,
  Component,
  TransitionProps,
  ComputedRef,
} from 'vue';

export type TDnDNode = Readonly<
  Ref<HTMLElement | null | ComponentPublicInstance>
>;

export interface IBaseOptions {
  id?: string | number;
  disabled?: boolean | Ref<boolean>;
  groups?: string[] | Ref<string[]>;
  data?: any | Ref<any>;
}

export interface IDraggableOptions extends IBaseOptions {
  view?: Component | Ref<Component>;
  overlay?: Component | Ref<Component>;
  events?: {
    onDragStart?: () => void;
    onDragEnd?: () => void;
    onDragMove?: () => void;
  };
}

export interface IDroppable {
  node: HTMLElement;
  disabled?: boolean;
  groups?: string[];
  dependencies?: [any[]];
}

export interface IDraggable {
  id?: string | number;
  node: HTMLElement;
  disabled?: boolean;
  groups?: string[];
  dependencies?: [any[], number];
  view?: Component;
  overlay?: Component;
  events?: {
    onDragStart?: () => void;
    onDragEnd?: () => void;
    onDragMove?: () => void;
  };
}

export interface IDragging extends IDraggable {}

// export interface DraggableOptions extends BaseDnDOptions {
//   index?: number;
//   handle?: boolean | string;
//   preview?: string | HTMLElement;
// }

// // Специфичные опции для зон сброса
// export interface DroppableOptions extends BaseDnDOptions {
//   accept?: string[];
//   maxItems?: number;
//   validator?: (dragItem: any, dropZone: any) => boolean;
// }

// // Специфичные опции для групп
// export interface GroupOptions extends BaseDnDOptions {
//   name: string;
//   sortable?: boolean;
//   nestable?: boolean;
// }

export interface IPointerPosition {
  current: [number, number];
  start: [number, number];
  end: [number, number];
  offset: [number, number];
  offsetPixel: [number, number];
}

export interface IOverlay {
  component: Component | null;
  ref: HTMLElement | null;
  options: TransitionProps | null;
  animating: {
    enter: boolean;
    leave: boolean;
    appear: boolean;
  };
}

export interface IDnDContext {
  // Maps
  elementsMap: Map<HTMLElement, IDraggable>;
  droppableMap: Map<HTMLElement, IDroppable>;
  draggingMap: Map<HTMLElement, IDragging>;
  selectedSet: Set<HTMLElement>;

  // State
  isDragging: ComputedRef<boolean>;
  overlay: IOverlay;
  pointerPosition: IPointerPosition;

  // Visibility tracking
  visibleZones: Set<HTMLElement | Element>;
  visibleElements: Set<HTMLElement | Element>;
  isSelecting: Ref<boolean>;

  // Methods
  observeElement: (
    action: 'add' | 'remove',
    element: HTMLElement | Element
  ) => void;
  observeZone: (
    action: 'add' | 'remove',
    element: HTMLElement | Element
  ) => void;
}
