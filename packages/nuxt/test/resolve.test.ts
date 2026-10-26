import { describe, expect, it } from 'vitest';
import { resolveComponents, resolveImports } from '../src/resolve';

const names = (options: Parameters<typeof resolveImports>[0], type = false) =>
  resolveImports(options)
    .filter((entry) => !!entry.type === type)
    .map((entry) => entry.name);

describe('module options', () => {
  it('registers DnDProvider and DragPreview, with an optional prefix', () => {
    expect(resolveComponents({})).toEqual([
      { name: 'DnDProvider', export: 'DnDProvider', filePath: '@vue-dnd-kit/core' },
      { name: 'DragPreview', export: 'DragPreview', filePath: '@vue-dnd-kit/core' },
    ]);
    expect(resolveComponents({ prefix: 'Dnd' }).map((entry) => entry.name)).toEqual(['DndDnDProvider', 'DndDragPreview']);
    expect(resolveComponents({ components: false })).toEqual([]);
  });

  it('auto-imports composables by default, never modifiers, collision or the bridge API', () => {
    const imported = names({});
    expect(imported).toEqual([
      'makeDraggable',
      'makeDroppable',
      'makeSortableList',
      'makeSortableItem',
      'makeSortableTree',
      'makeSelectionArea',
      'makeDragArea',
      'useDnD',
      'useDnDMonitor',
    ]);
    for (const name of ['snapToGrid', 'closestCenter', 'useDnDContext', 'provideDnDContext']) {
      expect(imported).not.toContain(name);
    }
  });

  it('opts into modifiers and collision helpers', () => {
    const imported = names({ autoImports: { modifiers: true, collision: true } });
    expect(imported).toContain('snapToGrid');
    expect(imported).toContain('restrictToParent');
    expect(imported).toContain('closestCenter');
    expect(imported).toContain('makeDraggable');
    expect(imported).not.toContain('useDnDContext');
  });

  it('opts into the sensors', () => {
    expect(names({})).not.toContain('defineSensor');
    const imported = names({ autoImports: { sensors: true } });
    for (const name of ['defineSensor', 'useSensor', 'pointerSensor', 'keyboardSensor']) expect(imported).toContain(name);
  });

  it('adds type-only imports unless turned off', () => {
    expect(names({}, true)).toContain('SortableListOptions');
    expect(resolveImports({}).every((entry) => entry.from === '@vue-dnd-kit/core')).toBe(true);
    expect(names({ autoImports: { types: false } }, true)).toEqual([]);
  });

  it('turns everything off with autoImports: false', () => {
    expect(resolveImports({ autoImports: false })).toEqual([]);
  });
});
