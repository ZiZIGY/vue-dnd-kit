import { computed, createApp, defineComponent, readonly, ref, type ShallowRef } from 'vue';
import { describe, expect, it } from 'vitest';
import * as library from './index';
import { provideDnDContext, useDnDContext } from './index';
import type * as Public from './index';
import type {
  AutoAnimation,
  DnDContext,
  DraggableOptions,
  Key,
  MaybeElementRef,
  MaybeReadonlyRefOrGetter,
  SortableItemOptions,
  SortableItems,
  SortableListOptions,
  SortableTreeOptions,
} from './index';

/** A component with typed emits, like most UI kit components (`<v-list-item>`, `<UTooltip>`). */
const KitComponent = defineComponent({
  props: { title: String },
  emits: { click: (_event: MouseEvent) => true, 'update:open': (_value: boolean) => true },
  setup: () => () => null,
});

// Compile-time checks (run by `yarn typecheck`): the refs users actually have must
// be accepted by option types.
const accepts = <T>(value: T): T => value;

/** `true` when `A` and `B` are the same type. */
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
const assertType = <_T extends true>() => {};

describe('public exports', () => {
  it('values', () => {
    expect(Object.keys(library).sort()).toEqual(
      [
        'DnDProvider',
        'DragPreview',
        'makeDraggable',
        'makeDroppable',
        'makeSortableList',
        'makeSortableItem',
        'makeSortableTree',
        'makeSelectionArea',
        'defineSensor',
        'useSensor',
        'pointerSensor',
        'keyboardSensor',
        'useDnD',
        'useDnDMonitor',
        'useDnDContext',
        'provideDnDContext',
        'pointerFirst',
        'pointerWithin',
        'rectIntersection',
        'closestCenter',
        'closestCorners',
        'restrictToVerticalAxis',
        'restrictToHorizontalAxis',
        'restrictToWindowEdges',
        'restrictToParent',
        'restrictToElement',
        'restrictToFirstScrollableAncestor',
        'snapToGrid',
        'snapCenterToCursor',
      ].sort(),
    );
  });

  it('types: what users write, and everything those types refer to (compile-time)', () => {
    type Exported = [
      // Primitives and option values
      Public.Key,
      Public.Coordinates,
      Public.Size,
      Public.Rect,
      Public.MaybePromise<boolean>,
      Public.MaybeReadonlyRefOrGetter<boolean>,
      Public.MaybeReadonlyRef<boolean>,
      Public.MaybeElement,
      Public.MaybeElementRef,
      Public.DnDStatus,
      Public.SensorType,
      Public.PointerKind,
      Public.ActivationConstraint,
      Public.ActivationOptions,
      Public.KeyboardOptions,
      Public.AutoScrollOptions,
      Public.HapticsOptions,
      Public.HapticPattern,
      // Sensors
      Public.Sensor,
      Public.SensorContext,
      Public.SensorActivation,
      Public.SensorDrag,
      Public.SensorDragState,
      Public.SensorDirection,
      Public.SensorStepOptions,
      Public.SortablePosition,
      // Drag state and events
      Public.DragItem,
      Public.Active,
      Public.Over,
      Public.DragSource,
      Public.DragMode,
      Public.DnDEvent,
      Public.DnDEndEvent,
      Public.BeforeDropResult,
      Public.DnDMonitor,
      Public.KeyboardMoveContext,
      Public.DnDState,
      Public.DnDSelection,
      Public.Announcements,
      // Accept rules
      Public.AcceptContext,
      Public.AcceptRule,
      Public.AcceptMode,
      // Animations
      Public.AnimationOptions,
      Public.LayoutAnimation,
      Public.LayoutAnimationContext,
      Public.DropAnimation,
      Public.DropAnimationContext,
      Public.AutoAnimation,
      Public.AutoAnimationOptions,
      Public.EnterAnimation,
      Public.EnterAnimationContext,
      Public.LeaveAnimation,
      Public.LeaveAnimationContext,
      // Collision detection and modifiers (custom ones need their argument types)
      Public.CollisionDetection,
      Public.CollisionArgs,
      Public.CollisionCandidate,
      Public.Modifier,
      Public.ModifierArgs,
      Public.SnapToGridOptions,
      // Provider, context and overlay
      Public.DnDProviderProps,
      Public.DnDContext,
      Public.OverlaySlotProps,
      Public.OverlayProps,
      Public.DragPreviewProps,
      // Composables
      Public.DraggableOptions,
      Public.DraggableReturn,
      Public.DroppableOptions,
      Public.DroppableReturn,
      Public.Placement,
      Public.SortableListOptions<unknown>,
      Public.SortableListReturn<unknown>,
      Public.SortableItems<unknown>,
      Public.SortableItemOptions,
      Public.SortableItemReturn,
      Public.SortableStrategy,
      Public.SortableBehavior,
      Public.SortablePlaceholder,
      Public.MultipleMode,
      Public.DropOutside,
      Public.SortableGroupOptions,
      Public.SortablePutContext,
      Public.SortableDropEvent,
      Public.SortableIndicator,
      Public.SortableTreeOptions<unknown>,
      Public.SortableTreeReturn<unknown>,
      Public.SortableTreeDropEvent,
      Public.TreeNesting,
      Public.FlatNode<unknown>,
      Public.TreeProjection,
      Public.SelectionAreaOptions,
      Public.SelectionAreaReturn,
      Public.SelectionStrategy,
      Public.SelectionModifier,
    ];
    accepts<Exported | undefined>(undefined);
    // @ts-expect-error The manager is internal: `useDnDContext()` gives an opaque `DnDContext`.
    accepts<Public.DnDManager | undefined>(undefined);
    expect(true).toBe(true);
  });
});

describe('public option types', () => {
  it('accept readonly template refs, narrower refs, computeds and getters', () => {
    const templateRef = ref(null) as unknown as Readonly<ShallowRef<HTMLElement | null>>;
    accepts<MaybeElementRef>(templateRef);
    accepts<MaybeElementRef>(() => document.body);
    accepts<MaybeReadonlyRefOrGetter<Key>>(ref('a'));
    accepts<MaybeReadonlyRefOrGetter<Key>>(computed(() => 1));
    accepts<MaybeReadonlyRefOrGetter<boolean>>(() => true);
    expect(true).toBe(true);
  });

  it('accept template refs to components with typed emits', () => {
    const componentRef = ref(null) as unknown as Readonly<ShallowRef<InstanceType<typeof KitComponent> | null>>;
    accepts<MaybeElementRef>(componentRef);
    accepts<MaybeElementRef>(() => componentRef.value);
    expect(true).toBe(true);
  });

  it('sortable items take `canDrag` and `attributes` as draggables do, but no `keyboard`', () => {
    accepts<SortableItemOptions>({ id: 'a', canDrag: (event) => event.shiftKey, attributes: ref(false) });
    assertType<Equal<SortableItemOptions['canDrag'], DraggableOptions['canDrag']>>();
    assertType<Equal<SortableItemOptions['attributes'], DraggableOptions['attributes']>>();
    // @ts-expect-error The keyboard moves sortable items by slots.
    accepts<SortableItemOptions>({ id: 'a', keyboard: 'pixels' });
    expect(true).toBe(true);
  });

  it('`animate`: a value, a ref or a getter; per kind `true`, options, `false` or a function', () => {
    type Animate = SortableListOptions<{ id: string }>['animate'];
    accepts<Animate>(true);
    accepts<Animate>(ref<AutoAnimation>({ duration: 300 }));
    accepts<Animate>(() => false);
    accepts<SortableTreeOptions<{ id: string }>['animate']>(computed(() => true));
    accepts<AutoAnimation>({
      easing: 'ease-out',
      move: ({ element, from, to, signal }) => {
        signal.addEventListener('abort', () => element.getAnimations().forEach((animation) => animation.cancel()));
        return element.animate([{ translate: `${from.left - to.left}px ${from.top - to.top}px` }, { translate: '0 0' }], 200);
      },
      enter: { duration: 150 },
      leave: ({ element }) => new Promise<void>((resolve) => element.animate({ opacity: [1, 0] }, 150).addEventListener('finish', () => resolve())),
    });
    // @ts-expect-error A function stands for one kind of change, never for `animate` as a whole.
    accepts<AutoAnimation>(() => undefined);
    expect(true).toBe(true);
  });

  it('sortable items: a writable ref, or a read-only source the user applies drops to', () => {
    const tasks = ref<Array<{ id: string }>>([]);
    accepts<SortableItems<{ id: string }>>(tasks);
    accepts<SortableItems<{ id: string }>>(computed(() => tasks.value));
    accepts<SortableItems<{ id: string }>>(readonly(tasks));
    accepts<SortableItems<{ id: string }>>(() => Object.freeze([...tasks.value]));
    expect(true).toBe(true);
  });
});

describe('DnDContext', () => {
  it('is opaque: no public members, and only what useDnDContext() returns fits provideDnDContext()', () => {
    assertType<Equal<ReturnType<typeof useDnDContext>, DnDContext>>();
    assertType<Equal<Extract<keyof DnDContext, string | number>, never>>();
    assertType<Equal<Parameters<typeof provideDnDContext>[1], DnDContext>>();
    const check = (context: DnDContext) => {
      // @ts-expect-error The manager's members are internal.
      void context.status;
      // @ts-expect-error Nothing else can be passed off as a provider.
      provideDnDContext(createApp({}), { status: ref('idle') });
    };
    expect(check).toBeTypeOf('function');
  });
});
