/** A value as a line of colored tokens, the way a console prints it. */
export interface Token {
  text: string;
  kind?: 'string' | 'number' | 'literal' | 'key';
}

/** Prints `value`; `more` ends a top-level object with `…` (some keys left out). */
export function inspect(value: unknown, more = false): Token[] {
  const out: Token[] = [];
  const print = (item: unknown, ellipsis = false) => {
    if (item === null || item === undefined || typeof item === 'boolean') out.push({ text: String(item), kind: 'literal' });
    else if (typeof item === 'number') out.push({ text: String(Math.round(item)), kind: 'number' });
    else if (typeof item === 'string') out.push({ text: `'${item}'`, kind: 'string' });
    else if (item instanceof Set || Array.isArray(item)) {
      const values = [...item];
      out.push({ text: item instanceof Set ? `Set(${values.length}) { ` : '[' });
      values.forEach((entry, index) => {
        if (index) out.push({ text: ', ' });
        print(entry);
      });
      out.push({ text: item instanceof Set ? ' }' : ']' });
    } else {
      out.push({ text: '{ ' });
      Object.entries(item).forEach(([key, entry], index) => {
        if (index) out.push({ text: ', ' });
        out.push({ text: key, kind: 'key' }, { text: ': ' });
        print(entry);
      });
      out.push({ text: ellipsis ? ', … }' : ' }' });
    }
  };
  print(value, more);
  return out;
}
