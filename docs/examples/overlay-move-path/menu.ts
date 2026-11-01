import type { InjectionKey, Ref } from 'vue';
import type { Key } from '@vue-dnd-kit/core';

export interface MenuNode {
  id: string;
  title: string;
  /** A section holds pages and other sections; a page holds nothing. */
  section?: boolean;
  children?: MenuNode[];
}

/** The site's menu: the tree edits it, the overlay reads section titles from it. */
export const MENU: InjectionKey<Ref<MenuNode[]>> = Symbol('menu');

export const site = (): MenuNode[] => [
  { id: 'home', title: 'Home' },
  {
    id: 'docs',
    title: 'Docs',
    section: true,
    children: [
      {
        id: 'start',
        title: 'Getting started',
        section: true,
        children: [
          { id: 'install', title: 'Installation' },
          { id: 'quick', title: 'Quick start' },
        ],
      },
      { id: 'guides', title: 'Guides', section: true, children: [{ id: 'theming', title: 'Theming' }] },
      { id: 'faq', title: 'FAQ' },
    ],
  },
  { id: 'blog', title: 'Blog', section: true, children: [{ id: 'launch', title: 'Launch post' }] },
  { id: 'pricing', title: 'Pricing' },
];

/** The sections from the top down to the node `key` (that node included), or `null` if it isn't there. */
export const trail = (nodes: MenuNode[], key: Key): MenuNode[] | null => {
  for (const node of nodes) {
    if (node.id === key) return [node];
    const below = node.children && trail(node.children, key);
    if (below) return [node, ...below];
  }
  return null;
};

/** `Docs › Guides` for the section `guides`, `the top level` for none (`null`). */
export const pathOf = (nodes: MenuNode[], section: Key | null | undefined) =>
  section == null ? 'the top level' : (trail(nodes, section) ?? []).map((node) => node.title).join(' › ');
