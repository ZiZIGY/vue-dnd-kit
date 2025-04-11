import type { Component, ComputedRef, Ref, ShallowRef } from 'vue';

export interface IActiveContainer {
  component: Ref<Component | null>;
  ref: Ref<HTMLElement | null>;
}

export interface IPointerPosition {
  start: Ref<IPoint | null>;
  current: Ref<IPoint | null>;
  offset: {
    percent: Ref<IPoint | null>;
    pixel: Ref<IPoint | null>;
  };
}

export interface IDragElement {
  node: HTMLElement | Element | null;
  groups: string[];
  layer: Component | null;
  defaultLayer: Component | null;
  data: any;
  events: {
    onHover?: (store: IDnDStore) => void;
    onLeave?: (store: IDnDStore) => void;
    onEnd?: (store: IDnDStore) => void;
  };
}

export interface IDraggingElement extends IDragElement {
  initialHTML: string;
  initialRect?: DOMRect;
}

export interface IDropZone {
  node: HTMLElement | Element | null;
  groups: string[];
  data: any;
  events: {
    onHover?: (store: IDnDStore) => void;
    onLeave?: (store: IDnDStore) => void;
    onDrop?: (store: IDnDStore) => void;
  };
}

export interface IPoint {
  x: number;
  y: number;
}

export interface IUseDropOptions {
  groups?: string[];
  events?: {
    onDrop?: (store: IDnDStore) => void;
    onHover?: (store: IDnDStore) => void;
    onLeave?: (store: IDnDStore) => void;
  };
  data?: any;
}
export interface IUseDragOptions extends IUseSensorOptions {
  groups?: string[];
  events?: {
    onEnd?: (store: IDnDStore) => void;
    onStart?: (store: IDnDStore) => void;
    onMove?: (store: IDnDStore) => void;
    onHover?: (store: IDnDStore) => void;
    onLeave?: (store: IDnDStore) => void;
  };
  keyboard?: {
    moveStep?: number;
  };
  data?: any;
  layer?: Component | null;
  container?: Component;
}

export type ISensor = (
  store: IDnDStore
) => HTMLElement | HTMLElement[] | Element | Element[] | null;

export interface IBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  bottom: number;
  left: number;
  right: number;
  top: number;
}

export interface IUseSensorOptions {
  sensor?: {
    throttle?: number;
    setup?: ISensor;
  };
}

interface ICollisionDetectionResult {
  element: IDragElement | null;
  zone: IDropZone | null;
}
