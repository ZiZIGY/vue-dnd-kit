import type { ComponentPublicInstance, Ref } from 'vue';

export type TDnDNode = HTMLElement | null | ComponentPublicInstance;
export type TDnDNodeRef = Readonly<Ref<TDnDNode>>;
export type TDragAxis = 'x' | 'y' | 'both';
export type TDraggablePayload = () => [number, any[], any?];
export type TDroppablePayload = () => [any[], any?];

export interface IDraggableEvents {
  onDragStart: () => void;
  onDragMove: () => void;
  onDragEnd: () => void;
}

export interface TDroppableEvents {
  onEnter: () => void;
  onDrop: () => void;
  onLeave: () => void;
}

export interface IBaseOptions {
  disabled?: boolean | Ref<boolean>;
  groups?: string[] | Ref<string[]>;
}

export interface IBaseEntity {
  disabled?: boolean;
  groups?: string[];
}

export interface IDraggableEntity extends IBaseEntity {
  events?: IDraggableEvents;
  payload?: TDraggablePayload;
}

export interface IDroppableEntity extends IBaseEntity {
  events?: TDroppableEvents;
  payload?: TDroppablePayload;
}

export interface ISelectableAreaEntity {
  modifierKey: 'ctrl' | 'shift' | 'alt' | 'meta';
  restrictToArea: boolean;
}

export interface IConstraintsAreaEntity {
  axis?: TDragAxis;
  restrictToArea?: boolean;
}

export interface IDnDProvider {
  entities: {
    draggableMap: Map<TDnDNode, IDraggableEntity>;
    droppableMap: Map<TDnDNode, IDroppable>;
    selectableAreaMap: Map<TDnDNode, ISelectableAreaEntity>;
    constraintsAreaMap: Map<TDnDNode, IConstraintsAreaEntity>;
  };
  events: {};
}
