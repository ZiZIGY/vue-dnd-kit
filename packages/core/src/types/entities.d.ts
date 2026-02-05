import type { ComponentPublicInstance, ComputedRef, Ref } from 'vue';

export type TDnDNode = HTMLElement | ComponentPublicInstance | null;
export type TDnDNodeRef = Readonly<Ref<TDnDNode>>;
export type TDragAxis = 'x' | 'y' | 'both';
export type TDraggablePayload<T = any, D = any> = () => [number, T[], D?];

export interface IBaseOptions {
  disabled?: boolean | Ref<boolean>;
  groups?: string[] | Ref<string[]>;
}

export interface IBaseEntity {
  disabled?: boolean;
  groups?: string[];
}

export interface IEntities {
  draggableMap: Map<HTMLElement, IDraggableEntity>;
  droppableMap: Map<HTMLElement, IDroppableEntity>;

  selectingArea?: HTMLElement;
  initiatingDraggable?: HTMLElement;

  selectableAreaMap: Map<HTMLElement, ISelectableAreaEntity>;
  constraintsAreaMap: Map<HTMLElement, IConstraintsAreaEntity>;

  draggingMap: Map<HTMLElement, IDraggingEntity>;
  selectedSet: Set<HTMLElement>;

  modifiersDraggableSet: ComputedRef<Set<HTMLElement>>;
  modifiersSelectableAreaSet: ComputedRef<Set<HTMLElement>>;

  visibleDraggableSet: Set<HTMLElement>;
  visibleDroppableSet: Set<HTMLElement>;
  visibleSelectableAreaSet: Set<HTMLElement>;
}

export type TModifierMethod = 'every' | 'some';
export type TModifierKeys = string[];

export interface IModifier {
  keys: TModifierKeys;
  method: TModifierMethod;
}

export interface IModifierOptions {
  keys: TModifierKeys | Ref<TModifierKeys>;
  method: TModifierMethod | Ref<TModifierMethod>;
}

export interface ISelectableAreaEntity extends IBaseEntity {
  modifier: IModifier;
}

export interface IConstraintsAreaEntity {
  axis?: TDragAxis;
  restrictToArea?: boolean;
}

export interface IDraggableEvents {
  onSelfDragStart?: () => void;
  onSelfDragMove?: () => void;
  onSelfDragEnd?: () => void;
  onSelfDragCancel?: () => void;
  
  onDragStart?: () => void;
  onDragMove?: () => void;
  onDragEnd?: () => void;
  onDragCancel?: () => void;
}

export interface IDroppableEvents {
  onEnter?: () => void;
  onDrop?: () => void;
  onLeave?: () => void;
}

export interface IDragActivation {
  distance?: {
    x?: number;
    y?: number;
    condition?: 'any' | 'both';
  } | number;
  delay?: number;
}

export interface IDraggableEntity extends IBaseEntity {
  render?: Component;
  events?: IDraggableEvents;
  payload?: TDraggablePayload;
  modifier?: IModifier;
  dragHandle?: string;
  activation?: IDragActivation;
}

export interface IDraggingEntity extends IDraggableEntity {
  initialHTML: string;
  initialRect: DOMRect;
}

export interface IDroppableEntity extends IBaseEntity {
  events?: IDroppableEvents;
}
