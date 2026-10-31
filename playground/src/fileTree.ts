export interface FileNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: FileNode[];
}

const folder = (id: string, children: FileNode[] = []): FileNode => ({ id, name: id, type: 'folder', children });
const file = (id: string, name: string): FileNode => ({ id, name, type: 'file' });

/**
 * src/            (0)
 *   components/   (1)
 *     ui/         (2, empty)
 *     Button.vue  (2)
 *   main.ts       (1)
 * docs/           (0, collapsed in the demo)
 *   intro.md, guide.md
 * assets/         (0, empty)
 * package.json    (0)
 * README.md       (0)
 */
export const createFileTree = (): FileNode[] => [
  folder('src', [folder('components', [folder('ui'), file('button', 'Button.vue')]), file('main', 'main.ts')]),
  folder('docs', [file('intro', 'intro.md'), file('guide', 'guide.md')]),
  folder('assets'),
  file('package', 'package.json'),
  file('readme', 'README.md'),
];

/** `src(components(ui,button),main),docs(intro,guide),...` for assertions. */
export const serializeTree = (nodes: readonly FileNode[]): string =>
  nodes.map((node) => (node.children?.length ? `${node.id}(${serializeTree(node.children)})` : node.id)).join(',');
