import { createApp, defineComponent, h, nextTick, ref, useTemplateRef, type Component, type PropType, type Ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FlatNode, Key, Rect, SortableTreeDropEvent, SortableTreeOptions, SortableTreeReturn } from '../types';
import { createRect } from '../animation/layout';
import { DnDProvider } from '../core/DnDProvider';
import { useDnDContext } from '../core/context';
import type { DnDManager } from '../core/manager';
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
  },
  setup(props) {
    const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), {
      id: props.listId,
      items: props.tasks,
      group: 'shared',
      placeholder: props.indicator ? 'indicator' : 'item',
    });
    return () =>
      h('div', { ref: 'list', 'data-col': props.column }, items.value.map((task: Node) => h(Row, { key: task.id, rowKey: task.id })));
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
          h({ setup: () => () => ((manager = useDnDContext()), null) }),
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

  it('the grabbed node travels on its own even inside another selected node', async () => {
    const canNest = (_n: Node, parent: Node) => !!parent.folder;
    const { container, roots } = renderTree({ canNest });
    await settle();
    select('a2x', 'a2');
    await start(container, 'a2x', 'keyboard');
    expect(manager.active.value!.ids).toEqual(['a2x', 'a2']);
    expect(rowsOf(container)).toEqual(['a', 'a1', 'a2', 'a2x', 'b', 'b1', 'c']);
    await drop();
    expect(shape(roots.value)).toBe('a(a1,a2,a2x),b(b1),c');
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
            h({ setup: () => () => ((manager = useDnDContext()), null) }),
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
