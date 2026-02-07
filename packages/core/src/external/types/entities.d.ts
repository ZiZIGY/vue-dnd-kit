import type { ComponentPublicInstance, ComputedRef, Ref } from 'vue';
import type { IPlacementMargins } from './placement';

export type TDnDNode = HTMLElement | ComponentPublicInstance | null;
export type TDnDNodeRef = Readonly<Ref<TDnDNode>>;
export type TDragAxis = 'x' | 'y' | 'both';
export type TDraggablePayload<T = any, D = any> = () => [number, T[], D?];

/** Resolved payload from TDraggablePayload (index + items + optional dropData) */
export interface IDragPayload<T = unknown, D = unknown> {
  index: number;
  items: T[];
  dropData?: D;
}

/** Event object passed to drag/drop handlers */
export interface IDragEvent<T = unknown, D = unknown> {
  payload: IDragPayload<T, D> | undefined;
}

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

export interface ISelectableAreaEvents {
  /** Called when selection ends (pointer up) with selected elements */
  onSelected?: (selected: HTMLElement[]) => void;
}

export interface ISelectableAreaEntity extends IBaseEntity {
  modifier: IModifier;
  events?: ISelectableAreaEvents;
}

export interface IConstraintsAreaEntity {
  axis?: TDragAxis;
  restrictToArea?: boolean;
}

export interface IDraggableEvents {
  /** Dragged element(s) — identifies which element is being dragged */
  onSelfDragStart?: (event: IDragEvent) => void;
  onSelfDragMove?: (event: IDragEvent) => void;
  onSelfDragEnd?: (event: IDragEvent) => void;
  onSelfDragCancel?: (event: IDragEvent) => void;

  /** Element under cursor during drag — when another element is dragged over this one */
  onDragStart?: (event: IDragEvent) => void;
  onDragMove?: (event: IDragEvent) => void;
  onDragEnd?: (event: IDragEvent) => void;
  onDragCancel?: (event: IDragEvent) => void;

  /** Alias / shortcut: cursor enters this draggable during drag */
  onHover?: (event: IDragEvent) => void;
  /** Cursor leaves this draggable during drag */
  onLeave?: (event: IDragEvent) => void;
}

export interface IDroppableEvents {
  onEnter?: (event: IDragEvent) => void;
  onDrop?: (event: IDragEvent) => void | Promise<void>;
  onLeave?: (event: IDragEvent) => void;
}

export interface IDragActivationOptions {
  distance?: {
    x?: number | Ref<number>;
    y?: number | Ref<number>;
    condition?: TCondition | Ref<TCondition>;
  } | number | Ref<number>;
  delay?: number | Ref<number>;
}

export interface IDragActivation {
  distance?: {
    x?: number;
    y?: number;
    condition?: TCondition;
  } | number;
  delay?: number;
  condition?: TCondition;
}

export type TCondition = 'any' | 'both'

export interface IDraggableEntity extends IBaseEntity {
  render?: Component;
  events?: IDraggableEvents;
  payload?: TDraggablePayload;
  modifier?: IModifier;
  dragHandle?: string;
  activation?: IDragActivation;
  /** Margins for center zone. When pointer in center and element is also droppable, zone mode is used. */
  placementMargins?: IPlacementMargins;
}

export interface IDraggingEntity extends IDraggableEntity {
  initialHTML: string;
  initialRect: DOMRect;
}

export interface IDroppableEntity extends IBaseEntity {
  events?: IDroppableEvents;
}
