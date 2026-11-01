import { computed, inject, type Ref } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import { DRIVE } from './drive';
import { isFolder, type Entry } from './files';
import { useFolderDrop } from './useFolderDrop';

/** What a tile of the grid and a row of the list share: one entry of the open folder. */
export function useFileItem(el: Readonly<Ref<HTMLElement | null>>, entry: () => Entry) {
  const drive = inject(DRIVE)!;

  // `selected` is the provider's selection: drag a selected entry and the others come along.
  const { selected, isDragging } = makeSortableItem(el, { item: entry });

  // A folder takes drops too: in its middle, files go inside.
  const folder = () => {
    const value = entry();
    return isFolder(value) ? value : null;
  };
  const { isTarget, isUploadTarget, gulps } = useFolderDrop(el, folder);

  return {
    selected,
    isDragging,
    /** The folder opens: a drag it takes, or files from the desktop, are over it. */
    isOpen: computed(() => isTarget.value || isUploadTarget.value),
    gulps,
    renaming: computed(() => drive.renaming.value === entry().id),
  };
}
