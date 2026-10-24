import { inject } from 'vue';
import { makeDroppable, type MaybeElementRef } from '@vue-dnd-kit/core';
import { FILE_MANAGER, type FileManagerContext } from './fs';

/**
 * Makes an element (tree row, breadcrumb, folder tile) a drop target for files.
 * A folder appears in several places at once, so each place gets its own id.
 */
export function useFolderDrop(
  target: MaybeElementRef,
  folderId: () => string,
  place: string,
  fm: FileManagerContext = inject(FILE_MANAGER)!,
) {
  return makeDroppable(target, {
    id: () => `${place}:${folderId()}`,
    // Files only, and never into the folder they are already in.
    accept: ({ types }) => types.includes('file') && folderId() !== fm.current.value,
    // While folders are dragged the rows are plain tree rows: no target may sit on top
    // of the tree, or it would catch the pointer before the tree does.
    disabled: () => !fm.draggingFiles.value,
    onDrop: (event) => fm.moveInto(event, folderId()),
  });
}
