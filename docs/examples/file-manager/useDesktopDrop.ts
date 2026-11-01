import { ref } from 'vue';
import type { Drive } from './drive';

/**
 * Files dragged in from the computer's desktop. That is the browser's own drag and drop
 * (HTML5 `dragover` and `drop`), not the library's: it carries files, not elements. The
 * folder under the pointer takes them (a tile, a row of the sidebar, a crumb), else the
 * open folder. Bind the handlers on the window.
 */
export function useDesktopDrop(drive: Drive) {
  /** Files are held over the window. */
  const active = ref(false);

  const carriesFiles = (event: DragEvent) => !!event.dataTransfer?.types.includes('Files');

  /** The folder under the pointer: an element with a folder's `data-id`, else the open folder. */
  const folderAt = (event: DragEvent) => {
    const id = (event.target as Element).closest<HTMLElement>('[data-id]')?.dataset.id;
    return (id && drive.find(id)) || drive.current.value;
  };

  const reset = () => {
    active.value = false;
    drive.uploadTarget.value = null;
  };

  const dragover = (event: DragEvent) => {
    if (!carriesFiles(event)) return;
    // Cancelled, a `dragover` says the drop is welcome here.
    event.preventDefault();
    const folder = folderAt(event);
    // Nothing is uploaded into the Trash.
    const welcome = !drive.isTrash(folder);
    event.dataTransfer!.dropEffect = welcome ? 'copy' : 'none';
    active.value = true;
    drive.uploadTarget.value = welcome ? folder.id : null;
  };

  // Left for good, not for a child element of the window.
  const dragleave = (event: DragEvent) => {
    if (!(event.currentTarget as Element).contains(event.relatedTarget as Node | null)) reset();
  };

  const drop = (event: DragEvent) => {
    if (!carriesFiles(event)) return;
    event.preventDefault();
    const folder = folderAt(event);
    reset();
    if (drive.isTrash(folder)) return;
    // A dropped folder comes as an empty "file": only real files go in.
    const files = [...event.dataTransfer!.items]
      .filter((item) => item.kind === 'file' && !item.webkitGetAsEntry()?.isDirectory)
      .map((item) => item.getAsFile()!);
    if (files.length) drive.upload(files, folder);
    else drive.notify('Only files can be dropped here, not folders');
  };

  return { active, dragover, dragleave, drop };
}
