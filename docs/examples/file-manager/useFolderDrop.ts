import { computed, inject, ref } from 'vue';
import { makeDroppable, useDnDMonitor, type MaybeElementRef } from '@vue-dnd-kit/core';
import { DRIVE } from './drive';
import type { FolderEntry } from './files';

/**
 * Makes an element take files and folders into `folder` (nothing for `null`): a tree row,
 * a favorite, a crumb of the path, a folder's tile, the Trash.
 *
 * A tile is also an item of the sortable grid. While the grid sorts a drag, the library
 * counts the tile as a target only in its middle; near its edges the grid makes room.
 */
export function useFolderDrop(target: MaybeElementRef, folder: () => FolderEntry | null) {
  const drive = inject(DRIVE)!;

  const { id, isOver, isAccepting } = makeDroppable(target, {
    disabled: () => !folder(),
    // Read live by the overlay as `over.data`: "Move to Photos", or why not.
    data: () => (folder() ? drive.placeOf(folder()!) : undefined),
    // Files of the grid only (not a favorite being sorted), and never where they can't go:
    // a refused tile lets the grid sort over it as over any other.
    accept: ({ active, types }) => types.includes('files') && !drive.whyNot(active.ids, folder()!),
    onDrop: (event) => drive.dropInto(event, folder()!),
  });

  /** Times it took something: each replays the folder's gulp. */
  const gulps = ref(0);
  // The drop is in once its overlay has landed in the folder, the clones one after another.
  useDnDMonitor({
    onDragSettle: (event) => {
      if ('dropped' in event && event.dropped && event.over?.id === id.value) gulps.value++;
    },
  });

  return {
    /** A drag is over it, taken or not. */
    isOver,
    /** A drag it takes is over it: the folder opens. */
    isTarget: computed(() => isOver.value && isAccepting.value),
    /** A drag it refuses is over it. */
    isRefused: computed(() => isOver.value && !isAccepting.value),
    /** Files from the desktop are held over it. */
    isUploadTarget: computed(() => !!folder() && drive.uploadTarget.value === folder()!.id),
    gulps,
  };
}
