import { computed, createApp, defineComponent, h, nextTick, ref, useTemplateRef } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { DnDProvider } from '../core/DnDProvider';
import { useManager } from '../core/context';
import type { DnDManager } from '../core/manager';
import { makeDraggable } from '../core/makeDraggable';
import { makeDroppable } from '../core/makeDroppable';
import { makeSortableItem } from '../sortable/makeSortableItem';
import { makeSortableList } from '../sortable/makeSortableList';
import { makeSortableTree } from '../sortable/makeSortableTree';
import type { SortableListOptions } from '../types';
import { connectDevtools } from './index';
import type { DevtoolsBridge, DevtoolsProvider } from './types';

/**
 * Live overrides of options (`overrides.ts`): a provider with a list `a` (options given as
 * a plain value, a ref and a getter), a tree `t`, a drop target `trash` and a draggable
 * `chip`, which can be unmounted (`chipShown`).
 */

let manager: DnDManager;
let bridge: DevtoolsBridge | null = null;
let unmount: (() => void) | null = null;
let listOptions: SortableListOptions<{ id: string }>;
const fit = ref<'slot' | 'source'>('slot');
const chipShown = ref(true);
const sortRef = ref(true);

const Row = defineComponent({
  props: { rowId: { type: String, required: true } },
  setup(props) {
    makeSortableItem(useTemplateRef<HTMLElement>('el'), { id: () => props.rowId });
    return () => h('li', { ref: 'el' }, props.rowId);
  },
});

const List = defineComponent({
  setup() {
    listOptions = { id: 'a', items: ref([{ id: 'a1' }, { id: 'a2' }]), strategy: 'vertical', sort: sortRef, multiple: () => 'stack' };
    const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), listOptions);
    return () => h('ul', { ref: 'list' }, items.value.map((item) => h(Row, { key: item.id, rowId: item.id })));
  },
});

const Tree = defineComponent({
  setup() {
    const { items } = makeSortableTree(useTemplateRef<HTMLElement>('tree'), { id: 't', items: ref([{ id: 'f' }]) });
    return () => h('ul', { ref: 'tree' }, items.value.map((row) => h(Row, { key: row.key, rowId: String(row.key) })));
  },
});

const Chip = defineComponent({
  setup() {
    makeDraggable(useTemplateRef<HTMLElement>('chip'), { id: 'chip', type: 'chip' });
    return () => h('span', { ref: 'chip' }, 'chip');
  },
});

const Zones = defineComponent({
  setup() {
    makeDroppable(useTemplateRef<HTMLElement>('trash'), { id: 'trash', accept: 'chip', priority: 1 });
    return () => [h('div', { ref: 'trash' }), chipShown.value ? h(Chip) : null];
  },
});

const Probe = defineComponent({
  setup() {
    manager = useManager();
    return () => null;
  },
});

const mount = async (): Promise<DevtoolsProvider> => {
  bridge = connectDevtools();
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp({
    setup: () => () =>
      h(DnDProvider, { overlayFit: fit.value, animation: false }, () => [h(Probe), h(List), h(Tree), h(Zones)]),
  });
  app.mount(container);
  unmount = () => {
    app.unmount();
    container.remove();
  };
  await nextTick();
  return bridge.providers()[0]!;
};

afterEach(() => {
  unmount?.();
  unmount = null;
  bridge?.disconnect();
  bridge = null;
  fit.value = 'slot';
  chipShown.value = true;
  sortRef.value = true;
});

describe('overrides', () => {
  it("of the provider's props: read where the library reads them, the parent's updates kept underneath", async () => {
    const provider = await mount();
    // Read before the first override: told when it comes.
    const shown = computed(() => manager.props.overlayFit);
    expect(shown.value).toBe('slot');
    expect(provider.overrides.set({ kind: 'provider' }, 'overlayFit', 'source')).toBe(true);
    expect([manager.props.overlayFit, shown.value]).toEqual(['source', 'source']);
    expect(provider.overrides.read({ kind: 'provider' }, 'overlayFit')).toEqual({ value: 'source', code: 'slot', overridden: true });
    expect(provider.snapshot().options.overlayFit).toBe('source');

    // The parent changes the prop meanwhile: it is underneath, and shows once reset.
    fit.value = 'source';
    await nextTick();
    fit.value = 'slot';
    await nextTick();
    expect(manager.props.overlayFit).toBe('source');
    provider.overrides.set({ kind: 'provider' }, 'overlayFit', 'slot');
    expect(shown.value).toBe('slot');
    fit.value = 'source';
    await nextTick();
    provider.overrides.reset({ kind: 'provider' }, 'overlayFit');
    expect([manager.props.overlayFit, shown.value]).toEqual(['source', 'source']);
    expect(provider.overrides.list()).toEqual([]);
    // Every override reset: the props object is as it was.
    expect(Object.getOwnPropertyDescriptor(manager.props, 'overlayFit')).toMatchObject({ value: 'source', writable: true });
  });

  it("of a list: its options, read as the library reads them (plain values, refs, getters)", async () => {
    const provider = await mount();
    const list = { kind: 'list', id: 'a' } as const;
    const snapshotOf = () => provider.snapshot().groups.flatMap((group) => group.lists).find((entry) => entry.id === 'a')!;
    expect(provider.overrides.set(list, 'strategy', 'horizontal')).toBe(true);
    expect(provider.overrides.set(list, 'sort', false)).toBe(true);
    expect(provider.overrides.set(list, 'multiple', 'gaps')).toBe(true);
    expect(snapshotOf()).toMatchObject({ strategy: 'horizontal', sort: false, multiple: 'gaps' });
    expect(provider.overrides.read(list, 'sort')).toEqual({ value: false, code: sortRef, overridden: true });
    expect(provider.overrides.read(list, 'multiple')!.code).toBeTypeOf('function');
    expect(provider.overrides.read(list, 'placeholder')).toEqual({ value: undefined, code: undefined, overridden: false });

    // `disabled`: the list, its items and its drop target.
    provider.overrides.set(list, 'disabled', true);
    expect(snapshotOf().disabled).toBe(true);
    expect(manager.getDraggable('a1')!.isDisabled()).toBe(true);
    expect(manager.getDroppable('a')!.isDisabled()).toBe(true);
    expect(manager.getDraggable('f')!.isDisabled()).toBe(false);

    provider.overrides.reset(list);
    expect(snapshotOf()).toMatchObject({ strategy: 'vertical', sort: true, multiple: 'stack', disabled: false });
    expect(manager.getDraggable('a1')!.isDisabled()).toBe(false);
    // The options object is as it was.
    expect(Object.keys(listOptions)).toEqual(['id', 'items', 'strategy', 'sort', 'multiple']);
    expect(listOptions.sort).toBe(sortRef);
  });

  it('of a tree, a drop target and a draggable', async () => {
    const provider = await mount();
    expect(provider.overrides.set({ kind: 'list', id: 't' }, 'placeholder', 'indicator')).toBe(true);
    expect(provider.snapshot().groups.flatMap((group) => group.lists).find((entry) => entry.id === 't')!.placeholder).toBe('indicator');

    const trash = { kind: 'droppable', id: 'trash' } as const;
    provider.overrides.set(trash, 'priority', 5);
    provider.overrides.set(trash, 'accept', ['chip', 'card']);
    const snapshot = provider.snapshot().droppables.find((entry) => entry.id === 'trash')!;
    expect([snapshot.priority, snapshot.accept]).toEqual([5, ['chip', 'card']]);
    // Options a drop target doesn't have, a list's own drop target.
    expect(provider.overrides.set(trash, 'strategy', 'grid')).toBe(false);
    expect(provider.overrides.set({ kind: 'droppable', id: 'a' }, 'disabled', true)).toBe(false);

    const chip = { kind: 'draggable', id: 'chip' } as const;
    expect(provider.overrides.set(chip, 'disabled', true)).toBe(true);
    expect(provider.overrides.set(chip, 'keyboard', 'droppables')).toBe(true);
    expect(manager.getDraggable('chip')!.isDisabled()).toBe(true);
    expect(provider.overrides.read(chip, 'disabled')).toEqual({ value: true, code: false, overridden: true });
    // A sortable item: over what it takes from its list.
    provider.overrides.set({ kind: 'list', id: 'a' }, 'disabled', true);
    provider.overrides.set({ kind: 'draggable', id: 'a2' }, 'disabled', false);
    expect([manager.getDraggable('a1')!.isDisabled(), manager.getDraggable('a2')!.isDisabled()]).toEqual([true, false]);
    // Unknown targets and options.
    expect(provider.overrides.set({ kind: 'draggable', id: 'nope' }, 'disabled', true)).toBe(false);
    expect(provider.overrides.set(chip, 'data', 1)).toBe(false);
    expect(provider.overrides.list()).toHaveLength(7);
  });

  it('apply to entries mounted again, and stop with the provider', async () => {
    const provider = await mount();
    provider.overrides.set({ kind: 'draggable', id: 'chip' }, 'disabled', true);
    const entry = manager.getDraggable('chip')!;
    chipShown.value = false;
    await nextTick();
    expect(provider.overrides.read({ kind: 'draggable', id: 'chip' }, 'disabled')).toBeUndefined();
    chipShown.value = true;
    await nextTick();
    expect(manager.getDraggable('chip')).not.toBe(entry);
    expect(manager.getDraggable('chip')!.isDisabled()).toBe(true);

    // Reset: the getters are the entry's own again.
    provider.overrides.reset();
    expect(manager.getDraggable('chip')!.isDisabled()).toBe(false);
    expect(Object.getOwnPropertyDescriptor(manager.getDraggable('chip')!, 'getKeyboard')!.value).toBeTypeOf('function');

    provider.overrides.set({ kind: 'provider' }, 'autoScroll', false);
    const props = manager.props;
    unmount!();
    unmount = null;
    expect(Object.getOwnPropertyDescriptor(props, 'autoScroll')).toMatchObject({ value: true });
  });

  it("can't override a frozen options object", async () => {
    const provider = await mount();
    manager.getDroppable('trash')!.options = Object.freeze({ id: 'trash' });
    expect(provider.overrides.set({ kind: 'droppable', id: 'trash' }, 'disabled', true)).toBe(false);
    expect(provider.overrides.list()).toEqual([]);
  });
});
