/** `makeSortableTree`. */

import type { Component, ComputedRef } from 'vue';
import type { Key, MaybePromise, MaybeReadonlyRef, MaybeReadonlyRefOrGetter, Size } from './primitives';
import type { AcceptMode, Active, BeforeDropResult } from './drag';
import type { AutoAnimation, LayoutAnimation } from './animation';
import type { Modifier } from './collision';
import type { AutoScrollOptions } from './provider';
import type {
  DropOutside,
  SortableDropEvent,
  SortableGroupOptions,
  SortableIndicator,
  SortableItems,
  SortablePlaceholder,
} from './sortable';

// ─── Tree ──────────────────────────────────────────────────────────────────────

export type TreeNesting = 'offset' | 'hover' | 'both';

export interface FlatNode<T> {
  key: Key;
  item: T;
  depth: number;
  parentKey: Key | null;
  /** Index among siblings. */
  index: number;
  hasChildren: boolean;
  collapsed: boolean;
}

export interface TreeProjection {
  depth: number;
  parentKey: Key | null;
}

/**
 * Drop event of a tree. `index` is the position among the siblings under `parentKey`
 * (`from`: before the move; `to`: after it, with the node already removed from its
 * old place). `from.parentKey` is `null` for root nodes and for items from another list.
 * A multi-drag moves `keys` (each with its subtree) side by side: `from` is where the
 * node leading the drag was (the grabbed one, or the selected node it rides in), `to`
 * where the first of them lands. A copy (`mode: 'copy'`) leaves the nodes where they are
 * and inserts `items`, their copies; a plain draggable (`mode: 'insert'`) the node
 * `createItem` made.
 */
export interface SortableTreeDropEvent<T = unknown> extends SortableDropEvent<T> {
  from: { list: Key | null; index: number; parentKey: Key | null };
  to: { list: Key; index: number; parentKey: Key | null };
}

/**
 * Options of `makeSortableTree`. A multi-drag moves the selected nodes as one block, each
 * with its subtree, to one place and depth (in document order); a selected node inside
 * another selected one rides along in its subtree. That goes for the grabbed node too
 * (as in VS Code): it stays inside the selected node it is in, which moves with its
 * subtree, while the overlay stays on the grabbed row. `canNest` and `maxDepth` apply to
 * the whole block.
 *
 * The other options mean what they mean on `makeSortableList`. They take a value, a ref
 * or a getter (`overlay`, `animation`: a value or a ref) and are read when the tree needs
 * them, so a change applies to the next drag at the latest. Exceptions: `id` and `group`
 * are read once, when the tree is created; `items` is the model itself; functions
 * (`getKey`, `getChildren`, `setChildren`, `canNest`, `clone`, `createItem`, the
 * callbacks) are passed as they are.
 */
export interface SortableTreeOptions<T> {
  /**
   * The root nodes. A writable ref: on drop the library gives the changed nodes their new
   * children (`setChildren`) and writes a new root array. A read-only source (a getter, a
   * readonly ref, a computed): call `event.preventDefault()` and apply `event.result`
   * yourself (as in `SortableListOptions.items`).
   */
  items: SortableItems<T>;
  /** Default: `node.id`. Also keys `makeSortableItem({ item })`, copies and created nodes. */
  getKey?: (node: T) => Key;
  getChildren?: (node: T) => T[] | undefined;
  /** How the default write gives a node its new children. Default: `node.children = children`. */
  setChildren?: (node: T, children: T[]) => void;
  /**
   * A copy of `node` with `children`, for `event.result`: a new tree that leaves your
   * nodes as they are (the default write still goes through `setChildren`). Default:
   * `{ ...node }` given the children through `setChildren` (`{ ...node, children }`
   * without a `setChildren`). Pass it for class instances and nodes that need more
   * than a shallow copy.
   */
  withChildren?: (node: T, children: T[]) => T;
  /** Default: `useId()`, stable between server and client render. Read once. */
  id?: Key;
  /** Overlay component for this tree's rows (a row's own `overlay` wins). Read when the drag starts. */
  overlay?: MaybeReadonlyRef<Component | undefined>;
  /**
   * Modifiers for drags of this tree's rows, applied after the provider's `modifiers` (a
   * row's own `modifiers` win): e.g. `[restrictToVerticalAxis]`. Read when the drag starts.
   * A locked axis still nests: the depth then comes from hovering the middle of a row.
   */
  modifiers?: MaybeReadonlyRefOrGetter<Modifier[] | undefined>;
  /**
   * Locks drags of this tree's rows to one axis (a row's own `axis` wins), after the
   * modifiers. With `'y'` rows still nest: the depth then comes from hovering the middle of
   * a row. Read when the drag starts.
   */
  axis?: MaybeReadonlyRefOrGetter<'x' | 'y' | undefined>;
  /** Lists and trees with the same group name exchange items. Default: a group of its own. Read once. */
  group?: string | SortableGroupOptions;
  /** Multi-drag of items of several types: `'all'` (default) or `'some'` must be accepted (`group.put`). */
  acceptMode?: MaybeReadonlyRefOrGetter<AcceptMode | undefined>;
  /** Pixels of horizontal offset per depth level. Default 24. */
  indentation?: MaybeReadonlyRefOrGetter<number | undefined>;
  /** How the depth is chosen: horizontal offset, hovering the middle of a row, or both (default). */
  nesting?: MaybeReadonlyRefOrGetter<TreeNesting | undefined>;
  /**
   * `'item'` (default): the dragged node moves through the rows at its projected depth.
   * `'indicator'`: the tree doesn't move; `indicator` (on the tree and on each row's
   * `makeSortableItem`) says where the drop goes, with its `depth` and `parentKey`, and
   * you draw the line. Dropping outside then cancels.
   */
  placeholder?: MaybeReadonlyRefOrGetter<SortablePlaceholder | undefined>;
  /** Deepest allowed depth (roots are 0). The dragged nodes' own descendants count. */
  maxDepth?: MaybeReadonlyRefOrGetter<number | undefined>;
  /** Whether `node` may go under `parent`; a multi-drag asks for every dragged node. */
  canNest?: (node: T, parent: T) => boolean;
  /** Keys of the nodes whose children are hidden. */
  collapsed?: MaybeReadonlyRefOrGetter<ReadonlySet<Key> | undefined>;
  /**
   * Creates copies (`group.pull: 'clone'`, the copy modifier key). Required for copying.
   * Return the copy with its whole subtree: a copied folder keeps its children. The copy
   * and each of its descendants need keys of their own (read with `getKey`), as every
   * node of a tree does.
   */
  clone?: (node: T) => T;
  /**
   * Accepts plain draggables from outside: creates the node to insert, at the projected
   * position and depth (`canNest` and `maxDepth` apply to it). With the keyboard, an arrow
   * toward the tree takes the draggable in, level with the row it goes before, and the
   * arrow keys then move the node like any other.
   */
  createItem?: (active: Active) => T | undefined;
  /**
   * A drop outside every target: keep the nodes where the placeholder is, cancel, or
   * remove them. Default `'placeholder'` (`'cancel'` with `placeholder: 'indicator'`).
   * Read at the drop.
   */
  dropOutside?: MaybeReadonlyRefOrGetter<DropOutside | undefined>;
  /** FLIP animation of this tree; default: the provider's `animation`. A value or a ref (a function is a custom animation). */
  animation?: MaybeReadonlyRef<LayoutAnimation | undefined>;
  /**
   * As in `SortableListOptions`, for the visible rows: nodes added, removed or moved, and
   * the rows a node shows or hides as it expands or collapses (`collapsed`).
   */
  animate?: MaybeReadonlyRefOrGetter<AutoAnimation | undefined>;
  /** Overrides the provider's `autoScroll` for this tree's scroll container. Read when the drag starts. */
  autoScroll?: MaybeReadonlyRefOrGetter<boolean | AutoScrollOptions | undefined>;
  disabled?: MaybeReadonlyRefOrGetter<boolean>;
  /** As in `SortableListOptions`. */
  onBeforeDrop?: (
    event: SortableTreeDropEvent<T>,
  ) => MaybePromise<BeforeDropResult>;
  /** As in `SortableListOptions`: before the write, which `event.preventDefault()` skips. */
  onDrop?: (event: SortableTreeDropEvent<T>) => void;
}

export interface SortableTreeReturn<T> {
  id: Key;
  /** Visible nodes in draft order; the active node carries its projected depth. */
  items: ComputedRef<FlatNode<T>[]>;
  /** Where the active node would land, `null` when it isn't in this tree. */
  projected: ComputedRef<TreeProjection | null>;
  /** Indicator mode: where the drop goes, with its `depth` and `parentKey`; `null` when not here. */
  indicator: ComputedRef<SortableIndicator | null>;
  isOver: ComputedRef<boolean>;
  /** Something is being dragged and this tree takes it. */
  isAccepting: ComputedRef<boolean>;
  /**
   * The row a virtualizer must keep mounted: the slot while it is in this tree (the
   * dragged node, the selected node the grabbed one rides in, a copy, a created node),
   * otherwise the dragged node.
   */
  activeKey: ComputedRef<Key | null>;
  /** Index of `activeKey` in `items`, -1 when it isn't here. */
  activeIndex: ComputedRef<number>;
  /** Size of the dragged row at drag start. */
  activeSize: ComputedRef<Size | null>;
  captureLayout(): void;
}
