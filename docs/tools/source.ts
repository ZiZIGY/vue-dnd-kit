import { createHash } from 'node:crypto';

/**
 * What a translation was made from: a short hash of the English text. A translation keeps the
 * hash of the text it was made from (`source:` of a page, `source` of an API text). When the
 * English changes, the hashes differ, and the translation is outdated.
 */
export const sourceHash = (text: string) =>
  createHash('sha1').update(text.replace(/\r\n/g, '\n').trim()).digest('hex').slice(0, 10);

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;
const SOURCE = /^source:\s*['"]?([0-9a-f]{10})\b/m;

/** The `source:` of a translated file: in the frontmatter of Markdown, at the top of YAML. */
export const sourceOf = (text: string, extension: string) =>
  SOURCE.exec(extension === '.md' ? (FRONTMATTER.exec(text)?.[1] ?? '') : text)?.[1];
