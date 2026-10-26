import { describe, expect, it } from 'vitest';
import type { SortablePosition } from '@vue-dnd-kit/core';
import * as library from './index';
import type * as Public from './index';

const accepts = <T>(value: T): T => value;

describe('public exports', () => {
  it('values', () => {
    expect(Object.keys(library).sort()).toEqual(['createDnDActions', 'useDnDActions']);
  });

  it('types (compile-time)', () => {
    type Exported = [Public.DnDActions, Public.ActionDrag, Public.DragDestination, Public.StartDragOptions];
    accepts<Exported | undefined>(undefined);
    // A destination is a point, an element or a list position.
    accepts<Public.DragDestination>({ x: 1, y: 2 });
    accepts<Public.DragDestination>(document.body);
    accepts<Public.DragDestination>({ list: 'done', index: 0 } satisfies SortablePosition);
    // @ts-expect-error Ids of draggables are keys, not elements.
    accepts<Parameters<Public.DnDActions['moveItem']>[0]>(document.body);
    expect(true).toBe(true);
  });
});
