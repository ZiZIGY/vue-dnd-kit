import {
  computed,
  createApp,
  defineComponent,
  h,
  nextTick,
  ref,
  shallowRef,
  toRaw,
  useTemplateRef,
  type Component,
  type PropType,
  type Ref,
} from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type {
  FlatNode,
  Key,
  Rect,
  SortableListOptions,
  SortableTreeDropEvent,
  SortableTreeOptions,
  SortableTreeReturn,
} from '../types';
import { createRect } from '../animation/layout';
import { DnDProvider } from '../core/DnDProvider';
import { useManager } from '../core/context';
import type { DnDManager } from '../core/manager';
import { makeDraggable } from '../core/makeDraggable';
import { restrictToVerticalAxis } from '../core/modifiers';
import { makeSortableItem } from './makeSortableItem';
import { makeSortableList } from './makeSortableList';
import { makeSortableTree } from './makeSortableTree';

/**
 * Drags through a mounted tree (and lists) in happy-dom. The layout happy-dom lacks:
 * containers (`data-col`) sit side by side 300px apart, their children stack 40px high.
 */

interface Node {
  id: string;
  folder?: boolean;
  children?: Node[];
}

const node = (id: string, children?: Node[]): Node => (children ? { id, folder: true, children } : { id });

/**
 * a/          (0)
 *   a1        (1)
 *   a2/       (1)
 *     a2x     (2)
 * b/          (0)
 *   b1        (1)
 * c           (0)
 */
const sample = (): Node[] => [
  node('a', [node('a1'), node('a2', [node('a2x')])]),
  node('b', [node('b1')]),
  node('c'),
];

/** `a(a1,a2(a2x)),b(b1),c` */
const shape = (roots: readonly Node[]): string =>
  roots.map((n) => (n.children?.length ? `${n.id}(${shape(n.children)})` : n.id)).join(',');

/** A copy of a node with its whole subtree; every key gets a `+`. */
const copyOf = (n: Node): Node => ({ ...n, id: `${n.id}+`, children: n.children?.map(copyOf) });

const ROW = 40;
const ROW_HEIGHT = ROW;
let manager: DnDManager;
const mounted: Array<() => void> = [];

const rectOf = (element: Element): Rect => {
  if (element.closest('[data-dnd-overlay]')) return createRect(0, 0, 0, 0);
  const column = element.getAttribute('data-col');
  if (column != null) return createRect(Number(column) * 300, 0, 200, Math.max(element.children.length, 1) * ROW);
  const parent = element.parentElement;
  const parentColumn = parent?.getAttribute('data-col');
  if (parent && parentColumn != null) {
    return createRect(Number(parentColumn) * 300, [...parent.children].indexOf(element) * ROW, 200, ROW_HEIGHT);
  }
  return createRect(0, 0, 0, 0);
};

const mount = (root: Component) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp(root);
  app.mount(container);
  mounted.push(() => {
    app.unmount();
    container.remove();
  });
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return rectOf(this) as DOMRect;
  });
  vi.spyOn(document, 'elementFromPoint').mockImplementation((x, y) => {
    for (const column of container.querySelectorAll('[data-col]')) {
      const rect = rectOf(column);
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return column;
    }
    return null;
  });
  return container;
};

/** A row: its key, depth and (indicator mode) the line attached to it as `side:depth:parent`. */
const Row = defineComponent({
  props: { rowKey: { type: [String, Number] as PropType<Key>, required: true }, depth: { type: Number, default: 0 } },
  setup(props) {
    const { indicator } = makeSortableItem(useTemplateRef<HTMLElement>('el'), { id: () => props.rowKey });
    return () => {
      const line = indicator.value;
      return h(
        'div',
        {
          ref: 'el',
          'data-id': props.rowKey,
          'data-depth': props.depth,
          'data-line': line ? `${line.side}:${line.depth ?? ''}:${line.parentKey ?? 'root'}` : undefined,
        },
        String(props.rowKey),
      );
    };
  },
});

const Tree = defineComponent({
  props: {
    roots: { type: Object as PropType<Ref<Node[]>>, required: true },
    options: { type: Object as PropType<Partial<SortableTreeOptions<Node>>>, default: () => ({}) },
    column: { type: Number, default: 0 },
    bind: { type: Function as PropType<(tree: SortableTreeReturn<Node>) => void>, required: true },
  },
  setup(props) {
    const tree = makeSortableTree(useTemplateRef<HTMLElement>('tree'), {
      id: 'tree',
      items: props.roots,
      ...props.options,
    });
    props.bind(tree);
    return () =>
      h(
        'div',
        { ref: 'tree', 'data-col': props.column },
        tree.items.value.map((row: FlatNode<Node>) => h(Row, { key: row.key, rowKey: row.key, depth: row.depth })),
      );
  },
});

const List = defineComponent({
  props: {
    listId: { type: String, required: true },
    tasks: { type: Object as PropType<Ref<Node[]>>, required: true },
    column: { type: Number, required: true },
    indicator: Boolean,
    options: { type: Object as PropType<Partial<SortableListOptions<Node>>>, default: () => ({}) },
  },
  setup(props) {
    const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), {
      id: props.listId,
      items: props.tasks,
      group: 'shared',
      placeholder: props.indicator ? 'indicator' : 'item',
      ...props.options,
    });
    return () =>
      h('div', { ref: 'list', 'data-col': props.column }, items.value.map((task: Node) => h(Row, { key: task.id, rowKey: task.id })));
  },
});

/** A plain draggable `chip` (not in any list), alone in column 0. */
const Chip = defineComponent({
  setup() {
    makeDraggable(useTemplateRef<HTMLElement>('chip'), { id: 'chip', data: { title: 'new' } });
    return () => h('div', { 'data-col': 0 }, [h('span', { ref: 'chip', 'data-chip': '' }, 'chip')]);
  },
});

const renderTree = (options: Partial<SortableTreeOptions<Node>> = {}, extra: () => unknown[] = () => []) => {
  const roots = ref(sample());
  const drops: SortableTreeDropEvent<Node>[] = [];
  let tree!: SortableTreeReturn<Node>;
  const container = mount({
    setup: () => () =>
      h(DnDProvider, { animation: false, dropAnimation: false }, {
        default: () => [
          h({ setup: () => () => ((manager = useManager()), null) }),
          h(Tree, {
            roots,
            options: { onDrop: (event: SortableTreeDropEvent<Node>) => drops.push(event), ...options },
            bind: (value: SortableTreeReturn<Node>) => (tree = value),
            column: 1,
          }),
          ...(extra() as never[]),
        ],
      }),
  });
  return { container, roots, drops, tree: () => tree };
};

const rowsOf = (container: HTMLElement, column = 1) =>
  [...container.querySelectorAll(`[data-col="${column}"] > [data-id]`)].map((row) => row.getAttribute('data-id'));
const depthOf = (container: HTMLElement, key: string) =>
  container.querySelector(`[data-col] > [data-id="${key}"]`)?.getAttribute('data-depth');
const lineOn = (container: HTMLElement, key: string) =>
  container.querySelector(`[data-col] > [data-id="${key}"]`)?.getAttribute('data-line') ?? null;

/** Center of a mounted row. */
const centerOf = (container: HTMLElement, key: string) => {
  const rect = rectOf(container.querySelector(`[data-col] > [data-id="${key}"]`)!);
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

const settle = async () => {
  for (let i = 0; i < 4; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await nextTick();
  }
};

const press = async (key: string) => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  await settle();
};

const pointTo = async (point: { x: number; y: number }) => {
  manager.move(point);
  manager.flushFrame();
  await settle();
};

const select = (...keys: Key[]) => {
  manager.selection.clear();
  for (const key of keys) manager.selection.add(key);
};

const start = async (container: HTMLElement, key: string, sensor: 'pointer' | 'keyboard') => {
  expect(manager.start(key, centerOf(container, key), sensor)).toBe(true);
  await settle();
};

const drop = async () => {
  await manager.drop();
  await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
  await settle();
};

const cancel = async () => {
  manager.cancel();
  await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
  await settle();
};

afterEach(() => {
  mounted.splice(0).forEach((unmount) => unmount());
  vi.restoreAllMocks();
});

describe('tree multi-drag: a block with subtrees', () => {
  it('pickup gathers the selected nodes at the grabbed one, in document order, without their descendants', async () => {
    const { container } = renderTree();
    await settle();
    select('c', 'a2');
    await start(container, 'c', 'pointer');
    expect(manager.active.value!.ids).toEqual(['c', 'a2']);
    expect(manager.overlayColumn.value?.ids).toEqual(['a2', 'c']);
    // a2 joins c (with a2x hidden inside it); the block takes c's level.
    expect(rowsOf(container)).toEqual(['a', 'a1', 'b', 'b1', 'a2', 'c']);
    expect(depthOf(container, 'a2')).toBe('0');
    await cancel();
    expect(rowsOf(container)).toEqual(['a', 'a1', 'a2', 'a2x', 'b', 'b1', 'c']);
    expect(depthOf(container, 'a2')).toBe('1');
  });

  it('the keyboard moves the block by rows and levels; the drop lands every node side by side', async () => {
    const { container, roots, drops, tree } = renderTree();
    await settle();
    select('a1', 'c');
    await start(container, 'a1', 'keyboard');
    expect(rowsOf(container)).toEqual(['a', 'a1', 'c', 'a2', 'a2x', 'b', 'b1']);
    expect(tree().projected.value).toEqual({ depth: 1, parentKey: 'a' });
    // Past a2: a2x below makes the block its children.
    await press('ArrowDown');
    expect(rowsOf(container)).toEqual(['a', 'a2', 'a1', 'c', 'a2x', 'b', 'b1']);
    expect(tree().projected.value).toEqual({ depth: 2, parentKey: 'a2' });
    await press('ArrowDown');
    expect(rowsOf(container)).toEqual(['a', 'a2', 'a2x', 'a1', 'c', 'b', 'b1']);
    await press('ArrowLeft');
    await press('ArrowLeft');
    expect(tree().projected.value).toEqual({ depth: 0, parentKey: null });
    expect([depthOf(container, 'a1'), depthOf(container, 'c')]).toEqual(['0', '0']);
    await drop();
    expect(shape(roots.value)).toBe('a(a2(a2x)),a1,c,b(b1)');
    expect(drops).toHaveLength(1);
    expect(drops[0]!.keys).toEqual(['a1', 'c']);
    expect(drops[0]!.from).toMatchObject({ index: 0, parentKey: 'a' });
    expect(drops[0]!.to).toMatchObject({ index: 1, parentKey: null });
  });

  it('maxDepth counts the deepest descendant of the whole block', async () => {
    // a2 has a child: with it in the block, depth 1 would put a2x at depth 2 > maxDepth 1.
    const { container, roots, tree } = renderTree({ maxDepth: 1 });
    await settle();
    select('a1', 'a2');
    await start(container, 'a1', 'keyboard');
    expect(tree().projected.value).toEqual({ depth: 0, parentKey: null });
    await press('ArrowRight');
    expect(tree().projected.value).toEqual({ depth: 0, parentKey: null });
    await drop();
    expect(shape(roots.value)).toBe('a,a1,a2(a2x),b(b1),c');
  });

  it('canNest has to take every node of the block', async () => {
    // Only folders take children, and b takes no folders.
    const canNest = (n: Node, parent: Node) => !!parent.folder && !(n.folder && parent.id === 'b');
    const { container, roots, tree } = renderTree({ canNest });
    await settle();
    select('c', 'a2');
    await start(container, 'c', 'keyboard');
    // Right of b1 means into b: a2 is a folder.
    await press('ArrowRight');
    expect(tree().projected.value).toEqual({ depth: 0, parentKey: null });
    await cancel();
    // c alone may go there.
    select();
    await start(container, 'c', 'keyboard');
    await press('ArrowRight');
    expect(tree().projected.value).toEqual({ depth: 1, parentKey: 'b' });
    await drop();
    expect(shape(roots.value)).toBe('a(a1,a2(a2x)),b(b1,c)');
  });

  it('a selected node inside another selected one rides along in its subtree', async () => {
    const { container, roots, drops } = renderTree();
    await settle();
    select('a', 'a2x');
    await start(container, 'a', 'keyboard');
    expect(manager.active.value!.ids).toEqual(['a']);
    expect(manager.overlayColumn.value).toBeNull();
    expect(rowsOf(container)).toEqual(['a', 'b', 'b1', 'c']);
    await press('ArrowDown');
    await press('ArrowDown');
    await press('ArrowLeft');
    await drop();
    expect(shape(roots.value)).toBe('b(b1),a(a1,a2(a2x)),c');
    expect(drops[0]!.keys).toEqual(['a']);
  });

  it('a grabbed node inside a selected one stays inside it: that node leads the drag with its subtree (VS Code)', async () => {
    const { container, roots, drops, tree } = renderTree();
    await settle();
    select('a2x', 'a2');
    await start(container, 'a2x', 'keyboard');
    expect(manager.active.value!.ids).toEqual(['a2x', 'a2']);
    // a2 moves with a2x inside it: a2's subtree is hidden, a2 is the placeholder.
    expect(rowsOf(container)).toEqual(['a', 'a1', 'a2', 'b', 'b1', 'c']);
    expect(manager.landingKey.value).toBeNull();
    expect([...manager.landings.value]).toEqual([['a2', 'a2']]);
    // The overlay keeps the grabbed row in the box, a2 shows above it in the column.
    expect(manager.overlayColumn.value?.ids).toEqual(['a2', 'a2x']);
    expect(tree().projected.value).toEqual({ depth: 1, parentKey: 'a' });
    expect(tree().activeKey.value).toBe('a2');
    await press('ArrowDown');
    expect(rowsOf(container)).toEqual(['a', 'a1', 'b', 'a2', 'b1', 'c']);
    expect(tree().projected.value).toEqual({ depth: 1, parentKey: 'b' });
    // The pointer holds the grabbed row one row below a2's slot: a2's clone is over it.
    expect(manager.pointer.value!.y).toBe(centerOf(container, 'a2').y + ROW);
    await drop();
    expect(shape(roots.value)).toBe('a(a1),b(a2(a2x),b1),c');
    expect(drops[0]!.keys).toEqual(['a2']);
    expect(drops[0]!.from).toMatchObject({ index: 1, parentKey: 'a' });
    expect(drops[0]!.to).toMatchObject({ index: 0, parentKey: 'b' });
    expect(rowsOf(container)).toEqual(['a', 'a1', 'b', 'a2', 'a2x', 'b1', 'c']);
  });

  it('VS Code rule with the pointer: the block follows the lead, which sits above the grabbed row', async () => {
    const { container, roots } = renderTree();
    await settle();
    select('a2', 'a2x');
    const grab = centerOf(container, 'a2x');
    await start(container, 'a2x', 'pointer');
    expect(rowsOf(container)).toEqual(['a', 'a1', 'a2', 'b', 'b1', 'c']);
    // Past b's center, but a2 (a row above the pointer) is still on its own row: nothing moves.
    await pointTo({ x: grab.x, y: grab.y + 10 });
    expect(rowsOf(container)).toEqual(['a', 'a1', 'a2', 'b', 'b1', 'c']);
    // A row further, a2 passes b.
    await pointTo({ x: grab.x, y: grab.y + 10 + ROW });
    expect(rowsOf(container)).toEqual(['a', 'a1', 'b', 'a2', 'b1', 'c']);
    await drop();
    expect(shape(roots.value)).toBe('a(a1),b(a2(a2x),b1),c');
  });

  it('several selected nodes with the grabbed one inside one of them: the block keeps document order', async () => {
    const { container, roots, drops } = renderTree();
    await settle();
    select('a1', 'a2x', 'a2', 'c');
    await start(container, 'a2x', 'keyboard');
    expect(manager.active.value!.ids).toEqual(['a2x', 'a1', 'a2', 'c']);
    expect(manager.overlayColumn.value?.ids).toEqual(['a1', 'a2', 'a2x', 'c']);
    expect(rowsOf(container)).toEqual(['a', 'a1', 'a2', 'c', 'b', 'b1']);
    await press('ArrowLeft');
    await drop();
    expect(shape(roots.value)).toBe('a,a1,a2(a2x),c,b(b1)');
    expect(drops[0]!.keys).toEqual(['a1', 'a2', 'c']);
  });
});

describe("tree placeholder: 'indicator'", () => {
  it('the tree does not move; the line carries the depth and the parent, by keyboard', async () => {
    const { container, roots, drops, tree } = renderTree({ placeholder: 'indicator' });
    await settle();
    await start(container, 'c', 'keyboard');
    const rows = ['a', 'a1', 'a2', 'a2x', 'b', 'b1', 'c'];
    expect(rowsOf(container)).toEqual(rows);
    await press('ArrowUp');
    // Between b and b1 only a child of b fits.
    expect(tree().indicator.value).toMatchObject({ key: 'b1', side: 'before', depth: 1, parentKey: 'b' });
    await press('ArrowUp');
    expect(tree().indicator.value).toMatchObject({ index: 4, key: 'b', side: 'before', depth: 1, parentKey: 'a' });
    await press('ArrowRight');
    expect(lineOn(container, 'b')).toBe('before:2:a2');
    expect(tree().projected.value).toEqual({ depth: 2, parentKey: 'a2' });
    expect(rowsOf(container)).toEqual(rows);
    await drop();
    expect(shape(roots.value)).toBe('a(a1,a2(a2x,c)),b(b1)');
    expect(drops[0]!.to).toMatchObject({ parentKey: 'a2', index: 1 });
  });

  it('hovering the middle of a folder reports the drop into it', async () => {
    const { container, roots } = renderTree({ placeholder: 'indicator' });
    await settle();
    await start(container, 'c', 'pointer');
    await pointTo(centerOf(container, 'a2'));
    expect(lineOn(container, 'a2')).toBe('inside:2:a2');
    // The top edge band of the same row is before it, at its level.
    await pointTo({ ...centerOf(container, 'a2'), y: centerOf(container, 'a2').y - 15 });
    expect(lineOn(container, 'a2')).toBe('before:1:a');
    // No line over the dragged node.
    await pointTo(centerOf(container, 'c'));
    expect(container.querySelectorAll('[data-line]')).toHaveLength(0);
    await pointTo(centerOf(container, 'a2'));
    await drop();
    expect(shape(roots.value)).toBe('a(a1,a2(c,a2x)),b(b1)');
  });

  it("'hover' nesting: the line takes the level of the row it is on", async () => {
    const { container } = renderTree({ placeholder: 'indicator', nesting: 'hover' });
    await settle();
    await start(container, 'c', 'pointer');
    // The bottom of a2x, far to the left: still a sibling of a2x.
    await pointTo({ x: 310, y: centerOf(container, 'a2x').y + 15 });
    expect(lineOn(container, 'a2x')).toBe('after:2:a2');
    await cancel();
  });

  it('dropping outside cancels', async () => {
    const { container, roots, drops } = renderTree({ placeholder: 'indicator' });
    await settle();
    await start(container, 'a1', 'pointer');
    await pointTo(centerOf(container, 'b1'));
    expect(lineOn(container, 'b1')).not.toBeNull();
    await pointTo({ x: 900, y: 600 });
    await drop();
    expect(shape(roots.value)).toBe(shape(sample()));
    expect(drops).toHaveLength(0);
  });

  it('a block of nodes lands at the line in document order; the others stay put during the drag', async () => {
    const { container, roots } = renderTree({ placeholder: 'indicator' });
    await settle();
    select('c', 'a1');
    await start(container, 'c', 'pointer');
    expect(rowsOf(container)).toEqual(['a', 'a1', 'a2', 'a2x', 'b', 'b1', 'c']);
    await pointTo(centerOf(container, 'b'));
    expect(lineOn(container, 'b')).toBe('inside:1:b');
    await drop();
    expect(shape(roots.value)).toBe('a(a2(a2x)),b(a1,c,b1)');
  });
});

describe('keyboard into indicator lists: only the line moves', () => {
  const renderLists = (target: 'list' | 'tree') => {
    const source = ref([node('l1'), node('l2'), node('l3')]);
    const lines = ref([node('i1'), node('i2'), node('i3')]);
    const roots = ref(sample());
    let tree!: SortableTreeReturn<Node>;
    const container = mount({
      setup: () => () =>
        h(DnDProvider, { animation: false, dropAnimation: false }, {
          default: () => [
            h({ setup: () => () => ((manager = useManager()), null) }),
            h(List, { listId: 'source', tasks: source, column: 0 }),
            target === 'list'
              ? h(List, { listId: 'lines', tasks: lines, column: 1, indicator: true })
              : h(Tree, {
                  roots,
                  options: { group: 'shared', placeholder: 'indicator' },
                  bind: (value: SortableTreeReturn<Node>) => (tree = value),
                  column: 1,
                }),
          ],
        }),
    });
    return { container, source, lines, roots, tree: () => tree };
  };

  it('from a list into an indicator list', async () => {
    const { container, source, lines } = renderLists('list');
    await settle();
    await start(container, 'l2', 'keyboard');
    await press('ArrowRight');
    // Level with l2: before i2. Neither list moved.
    expect(lineOn(container, 'i2')).toBe('before::root');
    expect(rowsOf(container, 1)).toEqual(['i1', 'i2', 'i3']);
    expect(rowsOf(container, 0)).toEqual(['l1', 'l2', 'l3']);
    await press('ArrowDown');
    expect(lineOn(container, 'i3')).toBe('before::root');
    // Back: the list takes the slot again, the line goes away.
    await press('ArrowLeft');
    expect(container.querySelectorAll('[data-line]')).toHaveLength(0);
    await press('ArrowRight');
    await drop();
    expect(source.value.map((n) => n.id)).toEqual(['l1', 'l3']);
    expect(lines.value.map((n) => n.id)).toEqual(['i1', 'i2', 'l2', 'i3']);
  });

  it('from a list into an indicator tree, at the level of the rows there', async () => {
    const { container, source, roots, tree } = renderLists('tree');
    await settle();
    await start(container, 'l3', 'keyboard');
    await press('ArrowRight');
    // Level with l3 (third row): before a2, as its sibling.
    expect(tree().indicator.value).toMatchObject({ key: 'a2', side: 'before', depth: 1, parentKey: 'a' });
    expect(rowsOf(container, 1)).toEqual(['a', 'a1', 'a2', 'a2x', 'b', 'b1', 'c']);
    expect(rowsOf(container, 0)).toEqual(['l1', 'l2', 'l3']);
    await press('ArrowDown');
    expect(tree().indicator.value).toMatchObject({ key: 'a2x', side: 'before', depth: 2, parentKey: 'a2' });
    await drop();
    expect(source.value.map((n) => n.id)).toEqual(['l1', 'l2']);
    expect(shape(roots.value)).toBe('a(a1,a2(l3,a2x)),b(b1),c');
  });
});

describe('tree copies (clone)', () => {
  it("group.pull: 'clone' copies a folder with its subtree; the original keeps its place and rows", async () => {
    const { container, roots, drops, tree } = renderTree({ group: { name: 'shared', pull: 'clone' }, clone: copyOf });
    await settle();
    await start(container, 'a2', 'pointer');
    expect(manager.mode.value).toBe('copy');
    expect(rowsOf(container)).toEqual(['a', 'a1', 'a2', 'a2x', 'b', 'b1', 'c']);
    // The top band of c: the copy goes before it, at its level.
    await pointTo({ x: 400, y: centerOf(container, 'c').y - 15 });
    expect(rowsOf(container)).toEqual(['a', 'a1', 'a2', 'a2x', 'b', 'b1', 'a2+', 'c']);
    expect(tree().projected.value).toEqual({ depth: 0, parentKey: null });
    expect(tree().activeKey.value).toBe('a2+');
    expect(tree().activeIndex.value).toBe(6);
    await drop();
    expect(shape(roots.value)).toBe('a(a1,a2(a2x)),b(b1),a2+(a2x+),c');
    expect(drops[0]).toMatchObject({
      mode: 'copy',
      keys: ['a2'],
      from: { list: 'tree', parentKey: 'a', index: 1 },
      to: { list: 'tree', parentKey: null, index: 2 },
    });
    expect(drops[0]!.items[0]).toMatchObject({ id: 'a2+', children: [{ id: 'a2x+' }] });
  });

  it('the copy modifier copies mid-drag: the rows of the original come back, and hide again when it moves', async () => {
    const { container, roots } = renderTree({ clone: copyOf });
    await settle();
    const alt = async (type: 'keydown' | 'keyup') => {
      document.dispatchEvent(new KeyboardEvent(type, { key: 'Alt', bubbles: true }));
      manager.flushFrame();
      await settle();
    };
    await start(container, 'a', 'pointer');
    expect(rowsOf(container)).toEqual(['a', 'b', 'b1', 'c']);
    await alt('keydown');
    expect(manager.mode.value).toBe('copy');
    expect(rowsOf(container)).toEqual(['a+', 'a', 'a1', 'a2', 'a2x', 'b', 'b1', 'c']);
    await alt('keyup');
    expect(manager.mode.value).toBe('move');
    expect(rowsOf(container)).toEqual(['a', 'b', 'b1', 'c']);
    await alt('keydown');
    // After c, at the root level.
    await pointTo({ x: 400, y: centerOf(container, 'c').y + 15 });
    expect(rowsOf(container)).toEqual(['a', 'a1', 'a2', 'a2x', 'b', 'b1', 'c', 'a+']);
    await drop();
    expect(shape(roots.value)).toBe('a(a1,a2(a2x)),b(b1),c,a+(a1+,a2+(a2x+))');
  });

  it('copying with the grabbed node inside a selected one copies that node; both clones land on the copy', async () => {
    const { container, roots, drops } = renderTree({ clone: copyOf });
    await settle();
    select('a2', 'a2x');
    await start(container, 'a2x', 'pointer');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Alt', bubbles: true }));
    manager.flushFrame();
    await settle();
    // The originals keep their rows; the copy of a2 (a2x's copy inside) takes a2's place.
    expect(rowsOf(container)).toEqual(['a', 'a1', 'a2+', 'a2', 'a2x', 'b', 'b1', 'c']);
    expect(manager.landingKey.value).toBe('a2+');
    expect([...manager.landings.value]).toEqual([['a2+', 'a2']]);
    await drop();
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Alt', bubbles: true }));
    expect(shape(roots.value)).toBe('a(a1,a2+(a2x+),a2(a2x)),b(b1),c');
    expect(drops[0]).toMatchObject({ mode: 'copy', keys: ['a2'], to: { parentKey: 'a', index: 1 } });
  });

  it('a palette list copies into the tree at the projected depth', async () => {
    const palette = ref([node('p1'), node('pf', [node('pf1')])]);
    const { container, roots, drops } = renderTree({ group: 'shared' }, () => [
      h(List, {
        listId: 'palette',
        tasks: palette,
        column: 0,
        options: { group: { name: 'shared', pull: 'clone' }, clone: copyOf, sort: false },
      }),
    ]);
    await settle();
    await start(container, 'pf', 'pointer');
    // The middle of b: into it.
    await pointTo(centerOf(container, 'b'));
    expect(rowsOf(container)).toEqual(['a', 'a1', 'a2', 'a2x', 'b', 'pf+', 'b1', 'c']);
    await drop();
    expect(shape(roots.value)).toBe('a(a1,a2(a2x)),b(pf+(pf1+),b1),c');
    expect(palette.value.map((n) => n.id)).toEqual(['p1', 'pf']);
    expect(drops[0]).toMatchObject({ mode: 'copy', from: { list: 'palette', parentKey: null }, to: { parentKey: 'b', index: 0 } });
  });
});

describe('createItem: plain draggables into a tree', () => {
  it('the created node lands at the projected position and depth', async () => {
    const { container, roots, drops, tree } = renderTree({ createItem: () => node('new') }, () => [h(Chip)]);
    await settle();
    expect(tree().isAccepting.value).toBe(false);
    expect(manager.start('chip', { x: 100, y: 20 }, 'pointer')).toBe(true);
    await settle();
    expect(tree().isAccepting.value).toBe(true);
    // The middle of b: into it.
    await pointTo(centerOf(container, 'b'));
    expect(manager.mode.value).toBe('insert');
    expect(rowsOf(container)).toEqual(['a', 'a1', 'a2', 'a2x', 'b', 'new', 'b1', 'c']);
    expect(tree().projected.value).toEqual({ depth: 1, parentKey: 'b' });
    expect(tree().activeKey.value).toBe('new');
    await drop();
    expect(shape(roots.value)).toBe('a(a1,a2(a2x)),b(new,b1),c');
    expect(drops[0]).toMatchObject({
      mode: 'insert',
      keys: ['chip'],
      from: { list: null, parentKey: null },
      to: { list: 'tree', parentKey: 'b', index: 0 },
    });
  });

  it('canNest and maxDepth apply to the created node and its children', async () => {
    const { container, roots, tree } = renderTree({ createItem: () => node('new', [node('new1')]), maxDepth: 1 }, () => [
      h(Chip),
    ]);
    await settle();
    manager.start('chip', { x: 100, y: 20 }, 'pointer');
    await settle();
    // The middle of b: inside it new1 would be at depth 2.
    await pointTo({ x: 400, y: centerOf(container, 'b').y - 5 });
    expect(tree().projected.value).toEqual({ depth: 0, parentKey: null });
    await drop();
    expect(shape(roots.value)).toBe('a(a1,a2(a2x)),new(new1),b(b1),c');
  });

  it('a tree without createItem is no target for plain draggables', async () => {
    const { container, roots, tree } = renderTree({}, () => [h(Chip)]);
    await settle();
    manager.start('chip', { x: 100, y: 20 }, 'pointer');
    await settle();
    await pointTo(centerOf(container, 'b'));
    expect(manager.over.value).toBeNull();
    expect(tree().isAccepting.value).toBe(false);
    await drop();
    expect(shape(roots.value)).toBe(shape(sample()));
  });

  it('the keyboard takes it in level with the row it goes before; the arrows then move it like any node', async () => {
    const { container, roots, tree } = renderTree({ createItem: () => node('new') }, () => [h(Chip)]);
    await settle();
    // Level with a1.
    expect(manager.start('chip', { x: 100, y: 60 }, 'keyboard')).toBe(true);
    await settle();
    await press('ArrowRight');
    expect(rowsOf(container)).toEqual(['a', 'new', 'a1', 'a2', 'a2x', 'b', 'b1', 'c']);
    expect(tree().projected.value).toEqual({ depth: 1, parentKey: 'a' });
    expect(manager.mode.value).toBe('insert');
    await press('ArrowDown');
    expect(rowsOf(container)).toEqual(['a', 'a1', 'new', 'a2', 'a2x', 'b', 'b1', 'c']);
    expect(tree().activeIndex.value).toBe(2);
    await press('ArrowRight');
    expect(tree().projected.value).toEqual({ depth: 2, parentKey: 'a1' });
    await drop();
    expect(shape(roots.value)).toBe('a(a1(new),a2(a2x)),b(b1),c');
  });
});

describe('tree options as lists have them', () => {
  it("modifiers apply to drags of the tree's rows, read when the drag starts", async () => {
    const locked = ref(true);
    const { container } = renderTree({ modifiers: () => (locked.value ? [restrictToVerticalAxis] : undefined) });
    await settle();
    const from = centerOf(container, 'c');
    await start(container, 'c', 'pointer');
    await pointTo({ x: from.x + 80, y: from.y - 30 });
    expect(manager.transform.value).toEqual({ x: 0, y: -30 });
    await cancel();
    locked.value = false;
    await start(container, 'c', 'pointer');
    await pointTo({ x: from.x + 80, y: from.y - 30 });
    expect(manager.transform.value).toEqual({ x: 80, y: -30 });
    await cancel();
  });

  it("axis locks drags of the tree's rows, read when the drag starts", async () => {
    const axis = ref<'x' | 'y' | undefined>('y');
    const { container } = renderTree({ axis });
    await settle();
    const from = centerOf(container, 'c');
    await start(container, 'c', 'pointer');
    await pointTo({ x: from.x + 80, y: from.y - 30 });
    expect(manager.transform.value).toEqual({ x: 0, y: -30 });
    await cancel();
    axis.value = undefined;
    await start(container, 'c', 'pointer');
    await pointTo({ x: from.x + 80, y: from.y - 30 });
    expect(manager.transform.value).toEqual({ x: 80, y: -30 });
    await cancel();
  });

  it("autoScroll overrides the provider's for the tree's scroll container, following a ref", async () => {
    const autoScroll = ref<boolean | { maxSpeed: number } | undefined>(false);
    const { container } = renderTree({ autoScroll });
    await settle();
    const element = container.querySelector('[data-col="1"]');
    // Read when a drag starts: what the scroller would take now.
    const entries = () => [...manager.autoScrollEntries].map((entry) => [entry.getElement(), entry.getOptions()]);
    expect(entries()).toEqual([[element, false]]);
    autoScroll.value = { maxSpeed: 5 };
    expect(entries()).toEqual([[element, { maxSpeed: 5 }]]);
    autoScroll.value = undefined;
    expect(entries()).toEqual([[element, undefined]]);
  });

  it("dropOutside: 'cancel' keeps the nodes, 'remove' takes them out with their subtrees; read at the drop", async () => {
    const rule = ref<'cancel' | 'remove'>('cancel');
    const { container, roots, drops } = renderTree({ dropOutside: rule });
    await settle();
    await start(container, 'a2', 'pointer');
    await pointTo({ x: 900, y: 600 });
    await drop();
    expect(shape(roots.value)).toBe(shape(sample()));
    expect(drops).toHaveLength(0);
    rule.value = 'remove';
    await start(container, 'a2', 'pointer');
    await pointTo({ x: 900, y: 600 });
    await drop();
    expect(shape(roots.value)).toBe('a(a1),b(b1),c');
    // The tree the nodes leave is told, with the tree they leave behind.
    expect(drops).toHaveLength(1);
    expect(drops[0]).toMatchObject({ keys: ['a2'], to: { list: 'tree', index: -1 } });
    expect(shape(drops[0]!.result.get('tree')!)).toBe('a(a1),b(b1),c');
  });

  it("dropOutside: 'placeholder' in indicator mode drops at the last line", async () => {
    const { container, roots } = renderTree({ placeholder: 'indicator', dropOutside: 'placeholder' });
    await settle();
    await start(container, 'c', 'pointer');
    await pointTo(centerOf(container, 'a2'));
    expect(lineOn(container, 'a2')).toBe('inside:2:a2');
    await pointTo({ x: 900, y: 600 });
    await drop();
    expect(shape(roots.value)).toBe('a(a1,a2(c,a2x)),b(b1)');
  });

  it("acceptMode: 'some' takes the nodes group.put accepts; the others stay in their list", async () => {
    const source = ref([node('l1'), node('lf', [node('lf1')]), node('l2')]);
    const put = ({ items }: { items: unknown[] }) => items.every((item) => !(item as Node).folder);
    const { container, roots, drops } = renderTree({ group: { name: 'shared', put }, acceptMode: 'some' }, () => [
      h(List, { listId: 'source', tasks: source, column: 0 }),
    ]);
    await settle();
    select('l1', 'lf');
    await start(container, 'l1', 'pointer');
    await pointTo({ x: 400, y: centerOf(container, 'c').y - 15 });
    expect(rowsOf(container)).toEqual(['a', 'a1', 'a2', 'a2x', 'b', 'b1', 'l1', 'c']);
    expect(rowsOf(container, 0)).toEqual(['lf', 'l2']);
    await drop();
    expect(shape(roots.value)).toBe('a(a1,a2(a2x)),b(b1),l1,c');
    expect(source.value.map((n) => n.id)).toEqual(['lf', 'l2']);
    expect(drops[0]).toMatchObject({ accepted: ['l1'], rejected: ['lf'] });
  });

  it('isAccepting, activeKey, activeIndex and activeSize, as lists have them', async () => {
    const source = ref([node('l1'), node('lf', [node('lf1')])]);
    const put = ({ items }: { items: unknown[] }) => items.every((item) => !(item as Node).folder);
    const { container, tree } = renderTree({ group: { name: 'shared', put } }, () => [
      h(List, { listId: 'source', tasks: source, column: 0 }),
    ]);
    await settle();
    expect(tree().isAccepting.value).toBe(false);
    expect(tree().activeKey.value).toBeNull();
    expect(tree().activeIndex.value).toBe(-1);
    expect(tree().activeSize.value).toBeNull();
    await start(container, 'c', 'keyboard');
    expect(tree().isAccepting.value).toBe(true);
    expect(tree().activeKey.value).toBe('c');
    expect(tree().activeIndex.value).toBe(6);
    expect(tree().activeSize.value).toEqual({ width: 200, height: 40 });
    await press('ArrowUp');
    expect(tree().activeIndex.value).toBe(5);
    await cancel();
    // A folder from the list: group.put refuses it.
    await start(container, 'lf', 'pointer');
    expect(tree().isAccepting.value).toBe(false);
    expect(tree().activeKey.value).toBe('lf');
    expect(tree().activeIndex.value).toBe(-1);
    await cancel();
  });
});

describe('tree options take refs and getters', () => {
  it('collapsed, maxDepth and disabled are read when needed', async () => {
    const collapsed = ref(new Set<Key>(['a2']));
    const maxDepth = ref(1);
    const disabled = ref(true);
    const { container, tree } = renderTree({ collapsed: () => collapsed.value, maxDepth, disabled });
    await settle();
    expect(rowsOf(container)).toEqual(['a', 'a1', 'a2', 'b', 'b1', 'c']);
    expect(manager.start('c', centerOf(container, 'c'), 'keyboard')).toBe(false);
    disabled.value = false;
    await start(container, 'c', 'keyboard');
    await press('ArrowRight');
    await press('ArrowRight');
    // Under b1 would be depth 2.
    expect(tree().projected.value).toEqual({ depth: 1, parentKey: 'b' });
    await cancel();
    maxDepth.value = 2;
    collapsed.value = new Set();
    await settle();
    expect(rowsOf(container)).toEqual(['a', 'a1', 'a2', 'a2x', 'b', 'b1', 'c']);
    await start(container, 'c', 'keyboard');
    await press('ArrowRight');
    await press('ArrowRight');
    expect(tree().projected.value).toEqual({ depth: 2, parentKey: 'b1' });
    await cancel();
  });

  it('indentation, nesting and placeholder follow refs and getters', async () => {
    const placeholder = ref<'item' | 'indicator'>('item');
    const { container, tree } = renderTree({ indentation: ref(10), nesting: () => 'offset', placeholder });
    await settle();
    const from = centerOf(container, 'c');
    await start(container, 'c', 'pointer');
    // 12px to the right: one level of 10px.
    await pointTo({ x: from.x + 12, y: from.y + 1 });
    expect(tree().projected.value).toEqual({ depth: 1, parentKey: 'b' });
    await cancel();
    placeholder.value = 'indicator';
    await start(container, 'c', 'keyboard');
    await press('ArrowUp');
    expect(rowsOf(container)).toEqual(['a', 'a1', 'a2', 'a2x', 'b', 'b1', 'c']);
    expect(tree().indicator.value).toMatchObject({ key: 'b1', side: 'before', depth: 1, parentKey: 'b' });
    await cancel();
  });
});

describe('controlled tree drops', () => {
  const ids = (nodes: readonly Node[] | undefined) => (nodes ?? []).map((n) => n.id);

  /** Moves c into b (after b1) with the keyboard and drops it. */
  const nestC = async (container: HTMLElement) => {
    select();
    await start(container, 'c', 'keyboard');
    await press('ArrowRight');
    await drop();
  };

  it('onDrop sees the old tree, result a new one; prevented, nothing is written or mutated', async () => {
    const seen: string[] = [];
    let result: Node[] = [];
    const { container, roots } = renderTree({
      onDrop: (event) => {
        seen.push(shape(roots.value));
        result = event.result.get('tree')!;
        event.preventDefault();
      },
    });
    await settle();
    const before = roots.value;
    const [a, b, c] = before as [Node, Node, Node];
    const bChildren = b.children;
    await nestC(container);
    expect(seen).toEqual(['a(a1,a2(a2x)),b(b1),c']);
    expect(shape(result)).toBe('a(a1,a2(a2x)),b(b1,c)');
    expect(roots.value).toBe(before);
    expect(b.children).toBe(bChildren);
    expect(ids(b.children)).toEqual(['b1']);
    expect(depthOf(container, 'c')).toBe('0');
    // Only b, which got new children, is a copy.
    expect(result[0]).toBe(a);
    expect(result[1]).not.toBe(b);
    expect(result[1]!.children![1]).toBe(c);
  });

  it('the result applied in onDrop renders; withChildren makes the copies', async () => {
    const copies = new WeakSet<object>();
    const { container, roots } = renderTree({
      withChildren: (n, children) => {
        const copy = { ...n, children };
        copies.add(copy);
        return copy;
      },
      onDrop: (event) => {
        event.preventDefault();
        roots.value = event.result.get('tree')!;
      },
    });
    await settle();
    const b = roots.value[1]!;
    await nestC(container);
    expect(shape(roots.value)).toBe('a(a1,a2(a2x)),b(b1,c)');
    expect(depthOf(container, 'c')).toBe('1');
    expect(copies.has(toRaw(roots.value[0]!))).toBe(false);
    expect(copies.has(toRaw(roots.value[1]!))).toBe(true);
    expect(ids(b.children)).toEqual(['b1']);
  });

  it('the default write goes through setChildren after onDrop; the result was built on a copy', async () => {
    const calls: string[] = [];
    let original: Node | null = null;
    const { container, roots } = renderTree({
      setChildren: (n, children) => {
        calls.push(`set:${n.id}:${n === original ? 'original' : 'copy'}`);
        n.children = children;
      },
      onDrop: () => void calls.push('onDrop'),
    });
    await settle();
    original = roots.value[1]!;
    await nestC(container);
    expect(calls).toEqual(['set:b:copy', 'onDrop', 'set:b:original']);
    expect(shape(roots.value)).toBe('a(a1,a2(a2x)),b(b1,c)');
  });

  it('a copy is in the result with its subtree; prevented, the tree stays as it was', async () => {
    let result: Node[] = [];
    const { container, roots } = renderTree({
      group: { name: 'shared', pull: 'clone' },
      clone: copyOf,
      onDrop: (event) => {
        result = event.result.get('tree')!;
        event.preventDefault();
      },
    });
    await settle();
    const before = roots.value;
    await start(container, 'a2', 'pointer');
    await pointTo({ x: 400, y: centerOf(container, 'c').y - 15 });
    await drop();
    expect(shape(result)).toBe('a(a1,a2(a2x)),b(b1),a2+(a2x+),c');
    expect(roots.value).toBe(before);
    expect(shape(roots.value)).toBe(shape(sample()));
    expect(rowsOf(container)).toEqual(['a', 'a1', 'a2', 'a2x', 'b', 'b1', 'c']);
    // Applied by hand, it renders.
    roots.value = result;
    await settle();
    expect(rowsOf(container)).toEqual(['a', 'a1', 'a2', 'a2x', 'b', 'b1', 'a2+', 'a2x+', 'c']);
  });

  it('a created node is in the result at its place; prevented, nothing is written', async () => {
    let result: Node[] = [];
    const { container, roots } = renderTree(
      {
        createItem: () => node('new'),
        onDrop: (event) => {
          result = event.result.get('tree')!;
          event.preventDefault();
        },
      },
      () => [h(Chip)],
    );
    await settle();
    manager.start('chip', { x: 100, y: 20 }, 'pointer');
    await settle();
    await pointTo(centerOf(container, 'b'));
    await drop();
    expect(shape(result)).toBe('a(a1,a2(a2x)),b(new,b1),c');
    expect(shape(roots.value)).toBe(shape(sample()));
    expect(rowsOf(container)).toEqual(['a', 'a1', 'a2', 'a2x', 'b', 'b1', 'c']);
  });

  it('copies and created nodes into a read-only tree are not written; the result has them', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const store = shallowRef(sample());
    const results: string[] = [];
    const { container } = renderTree(
      {
        items: computed(() => store.value),
        group: { name: 'shared', pull: 'clone' },
        clone: copyOf,
        createItem: () => node('new'),
        onDrop: (event) => void results.push(shape(event.result.get('tree')!)),
      },
      () => [h(Chip)],
    );
    await settle();
    await start(container, 'c', 'pointer');
    await pointTo(centerOf(container, 'b'));
    await drop();
    manager.start('chip', { x: 100, y: 20 }, 'pointer');
    await settle();
    await pointTo(centerOf(container, 'b'));
    await drop();
    expect(results).toEqual(['a(a1,a2(a2x)),b(c+,b1),c', 'a(a1,a2(a2x)),b(new,b1),c']);
    expect(warn).toHaveBeenCalledTimes(2);
    expect(shape(store.value)).toBe(shape(sample()));
  });

  it('the VS Code rule: the result moves the lead with the grabbed node inside', async () => {
    let result: Node[] = [];
    const { container } = renderTree({
      onDrop: (event) => {
        result = event.result.get('tree')!;
      },
    });
    await settle();
    select('a2', 'a2x');
    await start(container, 'a2x', 'keyboard');
    await press('ArrowDown');
    await drop();
    expect(shape(result)).toBe('a(a1),b(a2(a2x),b1),c');
  });

  it('a read-only source is not written: development builds warn', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const store = shallowRef(sample());
    const { container } = renderTree({ items: computed(() => store.value) });
    await settle();
    await nestC(container);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(shape(store.value)).toBe('a(a1,a2(a2x)),b(b1),c');
    expect(depthOf(container, 'c')).toBe('0');
  });
});
