import type { Component, ComputedRef, Ref, ShallowRef } from 'vue';

/** Main drag and drop state store */
export interface IDnDStore {
  /** Flag indicating if dragging is in progress */
  isDragging: Ref<boolean>;
  /** Active container where dragging occurs */
  activeContainer: IActiveContainer;
  /** Array of all drag elements */
  elements: Ref<IDragElement[]>;
  /** Array of currently selected elements */
  selectedElements: Ref<IDragElement[]>;
  /** Array of elements being dragged */
  draggingElements: Ref<IDraggingElement[]>;
  /** Array of drop zones */
  zones: Ref<IDropZone[]>;
  /** Currently hovered elements */
  hovered: {
    /** Currently hovered drop zone */
    zone: Ref<IDropZone | null>;
    /** Currently hovered drag element */
    element: Ref<IDragElement | null>;
  };
  /** Pointer position information */
  pointerPosition: IPointerPosition;
}

/** Active container information */
export interface IActiveContainer {
  /** Vue component reference */
  component: Ref<Component | null>;
  /** HTML element reference */
  ref: Ref<HTMLElement | null>;
}

/** Pointer position tracking */
export interface IPointerPosition {
  /** Initial pointer position when drag starts */
  start: Ref<IPoint | null>;
  /** Current pointer position */
  current: Ref<IPoint | null>;
  /** Offset from start position */
  offset: {
    /** Offset in percentage */
    percent: Ref<IPoint | null>;
    /** Offset in pixels */
    pixel: Ref<IPoint | null>;
  };
}

/** Draggable element configuration */
export interface IDragElement {
  /** DOM node reference */
  node: HTMLElement | Element | null;
  /** Groups this element belongs to */
  groups: string[];
  /** Custom layer component for dragging */
  layer: Component | null;
  /** Default layer component */
  defaultLayer: Component | null;
  /** Visibility state of the element */
  isVisible?: any;
  /** Custom data associated with element */
  data: any;
  /** Event handlers */
  events: {
    /** Called when element is hovered */
    onHover?: (store: IDnDStore) => void;
    /** Called when hover ends */
    onLeave?: (store: IDnDStore) => void;
    /** Called when drag ends */
    onEnd?: (store: IDnDStore) => void;
  };
}

/** Element being dragged */
export interface IDraggingElement extends IDragElement {
  /** Original HTML content */
  initialHTML: string;
  /** Original element dimensions */
  initialRect?: DOMRect;
}

/** Drop zone configuration */
export interface IDropZone {
  /** DOM node reference */
  node: HTMLElement | Element | null;
  /** Groups this zone accepts */
  groups: string[];
  /** Custom data associated with zone */
  data: any;
  /** Event handlers */
  events: {
    /** Called when element hovers over zone */
    onHover?: (store: IDnDStore) => void;
    /** Called when element leaves zone */
    onLeave?: (store: IDnDStore) => void;
    /** Called when element is dropped in zone */
    onDrop?: (store: IDnDStore) => void;
  };
}

/** 2D point coordinates */
export interface IPoint {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/** Drop zone options */
export interface IUseDropOptions {
  /** Accepted groups */
  groups?: string[];
  /** Event handlers */
  events?: {
    /** Called on drop */
    onDrop?: (store: IDnDStore) => void;
    /** Called when element hovers */
    onHover?: (store: IDnDStore) => void;
    /** Called when element leaves */
    onLeave?: (store: IDnDStore) => void;
  };
  /** Custom data */
  data?: any;
}

/** Drag element options */
export interface IUseDragOptions {
  /** Groups this element belongs to */
  groups?: string[];
  /** Event handlers */
  events?: {
    /** Called when drag ends */
    onEnd?: (store: IDnDStore) => void;
    /** Called when drag starts */
    onStart?: (store: IDnDStore) => void;
    /** Called during drag */
    onMove?: (store: IDnDStore) => void;
    /** Called when hovering over element */
    onHover?: (store: IDnDStore) => void;
    /** Called when leaving element */
    onLeave?: (store: IDnDStore) => void;
  };
  /** Custom data */
  data?: any;
  /** Custom layer component */
  layer?: Component | null;
  /** Container component */
  container?: Component;
}

/** Element bounding box dimensions */
export interface IBoundingBox {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
  /** Width */
  width: number;
  /** Height */
  height: number;
  /** Bottom edge position */
  bottom: number;
  /** Left edge position */
  left: number;
  /** Right edge position */
  right: number;
  /** Top edge position */
  top: number;
}
