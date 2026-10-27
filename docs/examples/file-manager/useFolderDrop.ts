import { computed, inject } from 'vue';
import { makeDroppable, type MaybeElementRef } from '@vue-dnd-kit/core';
import { FILES, type FolderEntry } from './files';

/**
 * Makes a tree row or a folder tile take files and folders (none for `null`). Returns
 * whether a drag it takes is over it.
 *
 * A tile is also an item of the sortable grid. While the grid sorts a drag, the library
 * counts the tile as a target only in its middle; near its edges the grid makes room.
 */
export function useFolderDrop(target: MaybeElementRef, folder: () => FolderEntry | null) {
  const files = inject(FILES)!;
  const { isOver, isAccepting } = makeDroppable(target, {
    disabled: () => !folder(),
    accept: ({ active }) => files.canDrop(active.ids, folder()!),
    onDrop: (event) => files.dropInto(event, folder()!),
  });
  return computed(() => isOver.value && isAccepting.value);
}
