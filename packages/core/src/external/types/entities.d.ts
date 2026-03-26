import type {
  ComponentPublicInstance,
  ComputedRef,
  Ref,
  ShallowRef,
} from 'vue';
import type { IPlacement, IPlacementMargins } from './placement';
import type { IDragEvent } from './provider';
import type { IHoveredDraggableContext } from './operations';

export type TDnDNode = HTMLElement | ComponentPublicInstance | null;
export type TDnDNodeRef = Readonly<Ref<TDnDNode>>;
export type TDragAxis = 'x' | 'y' | 'both';
/** Factory registered on a draggable: returns [index, items] */
export type TDraggablePayload<T = any> = () => [number, T[]];

/** Factory registered on a droppable zone: returns items array */
export type TDroppablePayload<T = any> = () => T[];

// ─── Public event types ────────────────────────────────────────────────────────

/** One dragged item — always carries its source array and position */
export interface IDragItem<T = unknown> {
  /** Index of this item in `items` */
  index: number;
  /** The actual object: `items[index]` */
  item: T;
  /** Source array (same reference as passed to the draggable payload factory) */
  items: T[];
  /** Custom data from the `data` option (reactive, always up-to-date) */
  data?: unknown;
}

/** Drop zone context — present in onEnter / onDrop / onLeave */
export interface IDropZoneContext<T = unknown> {
  items: T[];
  /** Cursor position relative to the zone boundary */
  placement: IPlacement | undefined;
  /** Custom data from the `data` option (reactive, always up-to-date) */
  data?: unknown;
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
  /** Snapshot of selectedSet taken at the start of a rubber-band selection session.
   *  Elements in this set are preserved when the new rect doesn't cover them. */
  selectionBase: Set<HTMLElement>;

  modifiersDraggableSet: ComputedRef<Set<HTMLElement>>;
  modifiersSelectableAreaSet: ComputedRef<Set<HTMLElement>>;

  allowedDroppableSet: ComputedRef<Set<HTMLElement>>;
  allowedDraggableSet: ComputedRef<Set<HTMLElement>>;

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

export interface IDropValidateEvent {
  /** Items whose groups are compatible with the zone's groups */
  validItems: IDragItem[];
  /** Items whose groups do NOT match the zone's groups */
  invalidItems: IDragItem[];
  dropZone: IDropZoneContext | undefined;
  hoveredDraggable?: IHoveredDraggableContext;
}

export interface IDroppableEvents {
  onEnter?: (event: IDragEvent) => void;
  /**
   * Called before `onDrop` when `groupMatch: 'some'` and some dragged items
   * don't match the zone's groups. Receives valid/invalid item split.
   *
   * Return:
   * - `void` — drop only `validItems` (default)
   * - `false` — decline this drop (drag stays active)
   * - `IDragItem[]` — drop exactly these items
   * - `Promise<...>` — async (state becomes 'pending' while waiting)
   */
  onValidate?: (
    event: IDropValidateEvent
  ) => void | false | IDragItem[] | Promise<void | false | IDragItem[]>;
  onDrop?: (event: IDragEvent) => void | boolean | Promise<void | boolean>;
  onLeave?: (event: IDragEvent) => void;
}

export interface IDragActivationOptions {
  distance?:
    | {
        x?: number | Ref<number>;
        y?: number | Ref<number>;
        condition?: TCondition | Ref<TCondition>;
      }
    | number
    | Ref<number>;
  delay?: number | Ref<number>;
}

export interface IDragActivation {
  distance?:
    | {
        x?: number;
        y?: number;
        condition?: TCondition;
      }
    | number;
  delay?: number;
  condition?: TCondition;
}

export type TCondition = 'any' | 'both';

export interface IDraggableEntity extends IBaseEntity {
  /** Stable id for this draggable — survives element remount during virtualization */
  id?: string;
  render?: Component;
  events?: IDraggableEvents;
  payload?: TDraggablePayload;
  data?: () => unknown;
  modifier?: IModifier;
  dragHandle?: string;
  activation?: IDragActivation;
  /** Margins for center zone. When pointer in center and element is also droppable, zone mode is used. */
  placementMargins?: IPlacementMargins;
  hoveredPlacement?: IPlacement;
}

export interface IDraggingEntity extends IDraggableEntity {
  initialHTML: string;
  initialRect: DOMRect;
  initialOuterHTML: string;
}

export interface IDroppableEntity extends IBaseEntity {
  /** 'every' — all dragged items must match zone groups (default).
   *  'some'  — zone is accessible if at least one item matches. */
  groupMatch?: TModifierMethod;
  events?: IDroppableEvents;
  payload?: TDroppablePayload;
  data?: () => unknown;
  hoveredPlacement: IPlacement | undefined;
}
