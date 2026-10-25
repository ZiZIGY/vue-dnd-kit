import { computed, createApp, defineComponent, ref, type ShallowRef } from 'vue';
import { describe, expect, it } from 'vitest';
import { provideDnDContext, useDnDContext } from './index';
import type {
  DnDContext,
  DraggableOptions,
  Key,
  MaybeElementRef,
  MaybeReadonlyRefOrGetter,
  SortableItemOptions,
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
