import { computed, nextTick, ref, shallowRef, type InjectionKey } from 'vue';
import { KINDS, copyBlock, createBlock, createPage, locate, snapshot, type Block, type BlockKind, type Place } from './blocks';
import { placeCaret, type Caret } from './caret';

/** The deepest level a block can sit at: the page is 0. */
export const MAX_DEPTH = 3;

/** The menu that is open: the block menu of a handle, or the menu of new blocks ("+" or "/"). */
export type Menu =
  | { type: 'block'; id: string }
  | { type: 'insert'; id: string }
  /** "/" typed in a block, at `at`: what follows it filters the menu. */
  | { type: 'command'; id: string; at: number };

interface State {
  title: string;
  blocks: Block[];
}

/** How many levels a block's subtree goes down below it. */
const height = (block: Block): number => Math.max(0, ...block.children.map((child) => height(child) + 1));

/** Gives a block another kind. A kind that takes no nested blocks hands them over: they follow it, a level up. */
const setKind = ({ siblings, index }: Place, kind: BlockKind) => {
  const block = siblings[index]!;
  block.kind = kind;
  if (kind === 'todo') block.done ??= false;
  if (!KINDS[kind].nests) siblings.splice(index + 1, 0, ...block.children.splice(0));
};

/**
 * The document and everything that changes it, provided to every component of the demo:
 * the tree, the text fields, the menus and the top bar. Each edit records the state
 * before it, so Undo takes back drops, typing and menu actions alike.
 */
export function createEditor() {
  const title = ref('Launch plan');
  const blocks = ref<Block[]>(createPage());
  /** Toggles that are closed: the tree hides their blocks. */
  const collapsed = ref(new Set<string>());
  const menu = shallowRef<Menu | null>(null);
  /** The editor's element: fields and handles are found in it by their block's id. */
  const root = shallowRef<HTMLElement | null>(null);

  const find = (id: string) => locate(blocks.value, id);
  const get = (id: string) => {
    const place = find(id);
    return place ? place.siblings[place.index] : undefined;
  };

  // ─── Status: a line in the top bar, read by screen readers ───────────────────

  const message = ref('');
  let quiet: ReturnType<typeof setTimeout> | undefined;
  const say = (text: string) => {
    message.value = text;
    clearTimeout(quiet);
    quiet = setTimeout(() => (message.value = ''), 2600);
  };

  // ─── History ─────────────────────────────────────────────────────────────────

  const past = shallowRef<State[]>([]);
  const future = shallowRef<State[]>([]);
  /** The block being typed in: its keystrokes make one step, until something else happens. */
  let typing: string | null = null;

  const capture = (): State => ({ title: title.value, blocks: snapshot(blocks.value) });

  /** Called before every change: the state it changes goes on the undo stack. */
  const record = () => {
    past.value = [...past.value.slice(-99), capture()];
    future.value = [];
    typing = null;
  };

  const recordTyping = (id: string) => {
    if (typing === id) return;
    record();
    typing = id;
  };

  const travel = (from: typeof past, to: typeof past, done: string) => {
    const state = from.value.at(-1);
    if (!state) return;
    from.value = from.value.slice(0, -1);
    to.value = [...to.value, capture()];
    title.value = state.title;
    blocks.value = state.blocks;
    typing = null;
    say(done);
    // The focused block may be gone: the focus stays in the editor, on the title.
    nextTick(() => {
      if (!root.value?.contains(document.activeElement)) focus('title');
    });
  };

  const undo = () => travel(past, future, 'Undone');
  const redo = () => travel(future, past, 'Redone');

  // ─── Focus ───────────────────────────────────────────────────────────────────

  const all = (selector: string) => [...(root.value?.querySelectorAll<HTMLElement>(selector) ?? [])];

  /** Puts the caret in a block's text, once the change that made the block has rendered. */
  const focus = async (id: string, at: Caret = 'end') => {
    await nextTick();
    const field = root.value?.querySelector<HTMLElement>(`[data-text="${id}"]`);
    if (!field) return focusHandle(id); // a divider: no text
    placeCaret(field, at);
    field.scrollIntoView({ block: 'nearest' });
  };

  const focusHandle = async (id: string) => {
    await nextTick();
    root.value?.querySelector<HTMLElement>(`[data-handle="${id}"]`)?.focus();
  };

  /** The arrow keys at the edge of a field: on to the field above or below (the title too). */
  const focusNext = (field: HTMLElement, step: 1 | -1, at: Caret) => {
    const fields = all('[data-text]');
    const next = fields[fields.indexOf(field) + step];
    if (!next) return;
    placeCaret(next, at);
    next.scrollIntoView({ block: 'nearest' });
  };

  /** The ids of the blocks on screen, in reading order (none from closed toggles). */
  const visibleIds = () => all('[data-handle]').map((handle) => handle.dataset.handle!);

  // ─── Edits ───────────────────────────────────────────────────────────────────

  /** Adds a block below another one, or at the end of the page, with the caret in it. */
  const insertAfter = (id: string | null, block: Block) => {
    record();
    const place = id ? find(id) : null;
    if (place) place.siblings.splice(place.index + 1, 0, block);
    else blocks.value.push(block);
    focus(block.id, 'start');
  };

  /** Adds a block into another one, first: an empty toggle's "add a block". */
  const insertInto = (id: string, block: Block) => {
    record();
    get(id)!.children.unshift(block);
    focus(block.id, 'start');
  };

  /** Enter: the text after the caret goes into a new block below, and the caret with it. */
  const split = (id: string, offset: number) => {
    const { siblings, index, parent } = find(id)!;
    const block = siblings[index]!;
    const info = KINDS[block.kind];
    // Enter in an empty list item ends the list: it steps out a level, or becomes text.
    if (info.continues && !block.text) {
      if (parent) return outdent(id);
      return turnInto([id], 'text');
    }
    record();
    const next = createBlock(info.continues ? block.kind : 'text', block.text.slice(offset));
    block.text = block.text.slice(0, offset);
    // Right below the line, where it shows: above the block's own children when they are in sight.
    if (block.children.length && !collapsed.value.has(id)) block.children.unshift(next);
    else siblings.splice(index + 1, 0, next);
    focus(next.id, 'start');
  };

  /** Backspace at the start of a block: it becomes text first, then joins the text above. */
  const backspace = (id: string) => {
    const block = get(id)!;
    if (block.kind !== 'text') return turnInto([id], 'text');
    const ids = visibleIds();
    const above = get(ids[ids.indexOf(id) - 1] ?? '');
    if (!above) return;
    // A divider or an image above gets the focus, and the next Backspace deletes it.
    if (KINDS[above.kind].fixed) return focusHandle(above.id);
    record();
    const join = above.text.length;
    above.text += block.text;
    // The blocks nested in it stay on screen where they were: they take its place.
    const { siblings, index } = find(id)!;
    siblings.splice(index, 1, ...block.children);
    focus(above.id, join);
  };

  /** Removes blocks with what is nested in them; the focus goes to the block above, or the title. */
  const remove = (ids: string[]) => {
    const visible = visibleIds();
    record();
    for (const id of ids) {
      const place = find(id); // gone already when it was nested in another removed block
      place?.siblings.splice(place.index, 1);
    }
    const first = visible.findIndex((id) => ids.includes(id));
    const next = [...visible.slice(0, first).reverse(), ...visible.slice(first)].find((id) => get(id));
    if (next) focusHandle(next);
    else focus('title');
    say(ids.length === 1 ? 'Block deleted' : `${ids.length} blocks deleted`);
  };

  /** The given blocks that aren't nested in another given block, in reading order. */
  const outermost = (ids: ReadonlySet<string>, list = blocks.value): Block[] =>
    list.flatMap((block) => (ids.has(block.id) ? [block] : outermost(ids, block.children)));

  /** Copies blocks with what is nested in them. Neighbours are copied as a run, after its last block. */
  const duplicate = (ids: string[]): string[] => {
    record();
    const runs: { siblings: Block[]; last: number; copies: Block[] }[] = [];
    for (const block of outermost(new Set(ids))) {
      const { siblings, index } = find(block.id)!;
      const run = runs.at(-1);
      if (run?.siblings === siblings && run.last === index - 1) {
        run.copies.push(copyBlock(block));
        run.last = index;
      } else runs.push({ siblings, last: index, copies: [copyBlock(block)] });
    }
    // From the last run up: inserting there leaves the indices of the runs above as they are.
    for (const run of [...runs].reverse()) run.siblings.splice(run.last + 1, 0, ...run.copies);
    const copies = runs.flatMap((run) => run.copies.map((copy) => copy.id));
    say(copies.length === 1 ? 'Block duplicated' : `${copies.length} blocks duplicated`);
    return copies;
  };

  const turnInto = (ids: string[], kind: BlockKind) => {
    record();
    for (const id of ids) {
      const place = find(id)!;
      if (!KINDS[place.siblings[place.index]!.kind].fixed) setKind(place, kind);
    }
    if (ids.length === 1) focus(ids[0]!, 'start');
  };

  /**
   * A pick in the "/" menu: the command typed after the slash goes. An empty block becomes
   * the kind picked (a divider leaves a new line below it); one with text gets it below.
   */
  const command = (id: string, from: number, to: number, kind: BlockKind) => {
    record();
    const place = find(id)!;
    const block = place.siblings[place.index]!;
    block.text = block.text.slice(0, from) + block.text.slice(to);
    if (block.text) {
      const next = createBlock(kind);
      place.siblings.splice(place.index + 1, 0, next);
      return focus(next.id, 'start');
    }
    setKind(place, kind);
    if (kind !== 'divider') return focus(id, 'start');
    const line = createBlock('text');
    place.siblings.splice(place.index + 1, 0, line);
    focus(line.id);
  };

  /** Tab: the block goes into the one above it, at the end. */
  const indent = (id: string) => {
    const { siblings, index, depth } = find(id)!;
    const block = siblings[index]!;
    const above = siblings[index - 1];
    if (!above || !KINDS[above.kind].nests || depth + 1 + height(block) > MAX_DEPTH) return;
    record();
    siblings.splice(index, 1);
    above.children.push(block);
    collapsed.value.delete(above.id); // a closed toggle opens to show it
    focus(id, 'end');
  };

  /** Shift+Tab: the block steps out of its parent. The blocks below it come along, nested in it, so nothing moves on screen. */
  const outdent = (id: string) => {
    const { siblings, index, parent } = find(id)!;
    if (!parent) return;
    record();
    const [block, ...below] = siblings.splice(index);
    if (KINDS[block!.kind].nests) block!.children.push(...below);
    else siblings.push(...below);
    const outer = find(parent.id)!;
    outer.siblings.splice(outer.index + 1, 0, block!);
    focus(id, 'end');
  };

  const check = (id: string) => {
    record();
    const block = get(id)!;
    block.done = !block.done;
  };

  const toggle = (id: string) => {
    if (collapsed.value.has(id)) collapsed.value.delete(id);
    else collapsed.value.add(id);
  };

  return {
    title,
    blocks,
    collapsed,
    menu,
    root,
    message,
    get,
    record,
    recordTyping,
    undo,
    redo,
    canUndo: computed(() => past.value.length > 0),
    canRedo: computed(() => future.value.length > 0),
    focus,
    focusHandle,
    focusNext,
    visibleIds,
    insertAfter,
    insertInto,
    split,
    backspace,
    remove,
    duplicate,
    turnInto,
    command,
    indent,
    outdent,
    check,
    toggle,
  };
}

export type Editor = ReturnType<typeof createEditor>;
export const EDITOR: InjectionKey<Editor> = Symbol('editor');
