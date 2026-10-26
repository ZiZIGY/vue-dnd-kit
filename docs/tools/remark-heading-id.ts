/**
 * `## Heading {#id}`: the heading takes that id instead of one made from its text. A
 * translated page keeps the English ids (`node tools/i18n.ts headings <file>`), so links to its
 * sections (`/docs/…#id`) and the table of contents hold in every language.
 */

interface MdastNode {
  type: string;
  value?: string;
  children?: MdastNode[];
  data?: { hProperties?: Record<string, unknown> };
}

const ID = /\s*\{#([\w-]+)\}\s*$/;

const visit = (node: MdastNode) => {
  if (node.type === 'heading') {
    const last = node.children?.at(-1);
    const match = last?.type === 'text' ? ID.exec(last.value ?? '') : null;
    if (last && match) {
      last.value = last.value!.slice(0, match.index);
      node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id: match[1] } };
    }
  }
  node.children?.forEach(visit);
};

export default function remarkHeadingId() {
  return (tree: MdastNode) => visit(tree);
}
