import type { InjectionKey, Ref } from 'vue';
import type { Key } from '@vue-dnd-kit/core';

export interface FileNode {
  id: string;
  name: string;
  folder?: boolean;
  children?: FileNode[];
}

/** The project's files: the tree edits them, the overlay reads folder names from them. */
export const FILES: InjectionKey<Ref<FileNode[]>> = Symbol('files');

export const project = (): FileNode[] => [
  {
    id: 'src',
    name: 'src',
    folder: true,
    children: [
      {
        id: 'components',
        name: 'components',
        folder: true,
        children: [
          { id: 'button', name: 'Button.vue' },
          { id: 'dialog', name: 'Dialog.vue' },
        ],
      },
      { id: 'composables', name: 'composables', folder: true, children: [{ id: 'use-auth', name: 'useAuth.ts' }] },
      { id: 'app', name: 'App.vue' },
      { id: 'main', name: 'main.ts' },
    ],
  },
  { id: 'public', name: 'public', folder: true, children: [{ id: 'logo', name: 'logo.svg' }] },
  { id: 'readme', name: 'README.md' },
  { id: 'package', name: 'package.json' },
];

/** The folders from the root down to the node `key` (that node included), or `null` if it isn't there. */
export const trail = (nodes: FileNode[], key: Key): FileNode[] | null => {
  for (const node of nodes) {
    if (node.id === key) return [node];
    const below = node.children && trail(node.children, key);
    if (below) return [node, ...below];
  }
  return null;
};

/** `src/components/` for the folder `components`, `/` for the root (`null`). */
export const pathOf = (nodes: FileNode[], folder: Key | null | undefined) =>
  folder == null ? '/' : `${(trail(nodes, folder) ?? []).map((node) => node.name).join('/')}/`;
