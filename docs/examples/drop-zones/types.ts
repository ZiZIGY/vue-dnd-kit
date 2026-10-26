export interface DeskFile {
  id: string;
  name: string;
  /** The draggable's `type`: what the folders' `accept` checks. */
  kind: 'image' | 'doc';
  size: string;
  /** The folder it is in. */
  place: string;
}
