import { createApp, defineComponent, effectScope, ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Key } from '../types';
import { createDnDManager } from './manager';
import { DND_CONTEXT } from './context';
import { makeDraggable } from './makeDraggable';
import { makeDroppable } from './makeDroppable';
import { makeSortableList } from '../sortable/makeSortableList';
import { createId } from '../utils/dom';

/** Runs `fn` in a detached effect scope of an app that has a provider bridged in: no component instance. */
const runDetached = <T>(fn: () => T): T => {
  const app = createApp({ render: () => null });
  app.provide(DND_CONTEXT, createDnDManager({}));
  return app.runWithContext(() => effectScope(true).run(fn)!);
};

describe('default ids', () => {
  afterEach(() => vi.restoreAllMocks());

  it('use useId() in components: unique per call, scoped by the app prefix', () => {
    const ids: string[] = [];
    const app = createApp(defineComponent({
      setup() {
        ids.push(createId('draggable'), createId('draggable'));
        return () => null;
      },
    }));
    app.config.idPrefix = 'app';
    app.mount(document.createElement('div'));
    expect(ids[0]).toMatch(/^draggable-app-/);
    expect(ids[1]).not.toBe(ids[0]);
    app.unmount();
  });

  it('fall back to a counter without a component instance, without useId() warnings', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { draggable, droppable, list } = runDetached(() => ({
      draggable: makeDraggable(() => null).id.value,
      droppable: makeDroppable(() => null).id.value,
      list: makeSortableList(() => null, { items: ref([]) }).id,
    }));
    expect(draggable).toMatch(/^draggable-\d+$/);
    expect(droppable).toMatch(/^droppable-\d+$/);
    expect(String(list)).toMatch(/^sortable-\d+$/);
    // (A list outside setup still warns about its own `provide()`; that is not about ids.)
    expect(warn.mock.calls.map(String).filter((message) => /useId/.test(message))).toEqual([]);
  });

  it('stay overridable', () => {
    const id = ref<Key>('mine');
    const { draggable, droppable, list } = runDetached(() => ({
      draggable: makeDraggable(() => null, { id }),
      droppable: makeDroppable(() => null, { id: () => 'zone' }).id.value,
      list: makeSortableList(() => null, { items: ref([]), id: 'tasks' }).id,
    }));
    expect(draggable.id.value).toBe('mine');
    id.value = 7;
    expect(draggable.id.value).toBe(7);
    expect(droppable).toBe('zone');
    expect(list).toBe('tasks');
  });
});
