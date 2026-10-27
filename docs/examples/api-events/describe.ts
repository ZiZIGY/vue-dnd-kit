/**
 * An event payload as console-like lines, taken when the event fires (the drag state
 * moves on right after). Elements print as `<li.task>`, functions as `ƒ name()`; a value
 * that fits on one line stays on one line.
 */
export interface Token {
  text: string;
  kind?: 'key' | 'string' | 'number' | 'literal' | 'type';
}
export interface Line {
  depth: number;
  tokens: Token[];
}
/** An event of the log, as it was when it fired. Moves share one entry: `count`. */
export interface LoggedEvent {
  id: number;
  name: string;
  type: string;
  lines: Line[];
  count: number;
}

const MAX_INLINE = 54;
const MAX_DEPTH = 4;

const leaf = (value: unknown): Token | null => {
  if (value === null || value === undefined || typeof value === 'boolean') return { text: String(value), kind: 'literal' };
  if (typeof value === 'number') return { text: String(Math.round(value)), kind: 'number' };
  if (typeof value === 'string') return { text: `'${value}'`, kind: 'string' };
  if (typeof value === 'function') return { text: `ƒ ${value.name}()`, kind: 'literal' };
  if (value instanceof Element) {
    const name = value.classList[0];
    return { text: `<${value.tagName.toLowerCase()}${name ? `.${name}` : ''}>`, kind: 'literal' };
  }
  return null;
};

type Entry = [label: Token[], value: unknown];

const open = (value: object): { start: string; end: string; entries: Entry[] } => {
  if (value instanceof Map) {
    return { start: `Map(${value.size}) {`, end: '}', entries: [...value].map(([key, item]) => [[leaf(key)!, { text: ' => ' }], item]) };
  }
  if (Array.isArray(value)) return { start: '[', end: ']', entries: value.map((item) => [[], item]) };
  return { start: '{', end: '}', entries: Object.entries(value).map(([key, item]) => [[{ text: key, kind: 'key' }, { text: ': ' }], item]) };
};

const inline = (value: unknown, depth: number): Token[] => {
  const single = leaf(value);
  if (single) return [single];
  const { start, end, entries } = open(value as object);
  if (!entries.length) return [{ text: start === '[' ? '[]' : `${start}}` }];
  if (depth > MAX_DEPTH) return [{ text: start === '[' ? '[…]' : '{…}' }];
  const pad = start === '[' ? '' : ' ';
  const tokens: Token[] = [{ text: start + pad }];
  entries.forEach(([label, item], index) => {
    if (index) tokens.push({ text: ', ' });
    tokens.push(...label, ...inline(item, depth + 1));
  });
  tokens.push({ text: pad + end });
  return tokens;
};

const width = (tokens: Token[]) => tokens.reduce((sum, token) => sum + token.text.length, 0);

export function describe(type: string, value: unknown): Line[] {
  const lines: Line[] = [];
  const walk = (label: Token[], item: unknown, depth: number, last: boolean) => {
    const comma = last ? [] : [{ text: ',' }];
    const tokens = inline(item, depth);
    if (leaf(item) || width(label) + width(tokens) + depth * 2 <= MAX_INLINE) {
      lines.push({ depth, tokens: [...label, ...tokens, ...comma] });
      return;
    }
    const { start, end, entries } = open(item as object);
    lines.push({ depth, tokens: [...label, { text: start }] });
    entries.forEach(([childLabel, child], index) => walk(childLabel, child, depth + 1, index === entries.length - 1));
    lines.push({ depth, tokens: [{ text: end }, ...comma] });
  };
  walk([{ text: `${type} `, kind: 'type' }], value, 0, true);
  return lines;
}
