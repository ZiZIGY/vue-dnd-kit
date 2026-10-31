import { inject } from 'vue';
import { makeDroppable, type MaybeElementRef } from '@vue-dnd-kit/core';
import { FILE_MANAGER, type FileManagerContext, type FolderPlace } from './fs';

/**
 * Makes an element (grid tile, tree row, breadcrumb, Home) a drop target for files and
 * folders. A folder appears in several places at once, so each place gets its own id.
 *
 * A folder tile is also an item of the sortable grid: there the library lets the tile
 * take a drop only in its middle, and its edges sort the grid. A target that refuses the
 * drag (the tree's rows for the tree's own drags) is left out, so the list under it
 * sorts as usual: no need to disable targets while something else is dragged.
 */
export function useFolderDrop(
  target: MaybeElementRef,
  folderId: () => string,
  place: FolderPlace,
  fm: FileManagerContext = inject(FILE_MANAGER)!,
) {
  return makeDroppable(target, {
    id: () => `${place}:${folderId()}`,
    accept: ({ items }) => items.every((item) => fm.canMove(item, folderId(), place)),
    onDrop: (event) => fm.moveInto(event, folderId()),
  });
}
