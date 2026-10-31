/**
 * Style snapshot of an overlay clone. The overlay is rendered outside the list (in <body>
 * by default), where rules that match through ancestors no longer reach the clone:
 * `.grid li { display: flex }`, `table td { padding }`, a shadow root's styles, a UI kit's
 * styles keyed on its list. At pickup the clone is laid out in a host where the overlay
 * goes, at the overlay's size; its computed styles are compared with the source's, element
 * by element, and only what differs is inlined. What already matches keeps flowing:
 * inherited values, defaults, sizes that follow the overlay box.
 *
 * Passes, each reading every element before writing any: what an element looks like and
 * its box; what the layout resolves (margins, offsets, grid tracks, transforms); sizes the
 * source sets; then sizes that still differ. The host leaves before anything paints.
 */

type Styled = Element & ElementCSSInlineStyle;

interface Entry {
  source: Element;
  clone: Styled;
  parent?: Entry;
  /**
   * Properties compared in each pass, with the source's values: look, resolved, the sizes
   * the source sets, then any size (the same map twice). Last (`SHOWN`), the clone's values
   * as compared: a child that inherits compares with its parent's.
   */
  passes: Array<Map<string, string>>;
  /** The source's Typed OM computed values, made when first read (`computedValue`). */
  styleMap?: StylePropertyMapReadOnly | null;
}

/**
 * Elements snapshotted at most, the root and the levels below it first: reading styles
 * is most of a pickup's cost. Deeper elements keep what the overlay's cascade gives them.
 */
const LIMIT = 200;
const SHOWN = 4;

// Shorthands where they cover several longhands: every engine serializes them in
// computed styles, and one read (and write) takes all of them.
const names = (list: string) => list.split(' ');

/** Inherited: a child that inherits one in the clone will get its parent's snapshot value. */
const INHERITED = new Set(
  names(
    'color font-family font-size font-weight font-style font-variant font-feature-settings line-height ' +
      'letter-spacing text-align text-transform text-shadow white-space word-break overflow-wrap direction ' +
      'visibility list-style-type',
  ),
);

/**
 * Compared on every element. Size constraints (`min-*`, `max-*`, `aspect-ratio`) show in
 * the sizes the last passes compare.
 */
const LOOK = [
  ...INHERITED,
  ...names(
    'display opacity filter box-shadow outline background overflow text-overflow text-decoration-line ' +
      'border-radius padding border-width border-style border-color flex-flow place-content place-items gap ' +
      'position z-index vertical-align flex object-fit',
  ),
];

/**
 * Resolved by the layout, compared below the root only: the root fills the overlay box.
 * Grid tracks are a box's own, compared on the root too.
 */
const RESOLVED = names('grid-template-columns grid-template-rows margin inset transform translate rotate scale');
const SIZES = names('width height');

const read = (style: CSSStyleDeclaration, list: string[], into = new Map<string, string>()) => {
  for (const name of list) into.set(name, style.getPropertyValue(name));
  return into;
};

/** Source and clone elements side by side, breadth first. SVG contents follow their <svg>. */
const collect = (source: Element, clone: Styled): Entry[] => {
  const entries: Entry[] = [{ source, clone, passes: [] }];
  for (const parent of entries) {
    if (parent.source.localName === 'svg') continue;
    [...parent.source.children].forEach((child, index) => {
      const copy = parent.clone.children[index] as Styled | undefined;
      if (copy && entries.length < LIMIT) entries.push({ source: child, clone: copy, parent, passes: [] });
    });
  }
  return entries;
};

const readSource = (entry: Entry) => {
  const style = getComputedStyle(entry.source);
  const { parent } = entry;
  const sizes = read(style, parent ? SIZES : []);
  entry.passes = [
    read(style, LOOK),
    read(style, parent ? RESOLVED : RESOLVED.slice(0, 2)),
    sizes,
    sizes,
    new Map(),
  ];
};

/**
 * The source's computed value (Typed OM, Chromium and WebKit): unlike the used value the
 * layout resolves, `auto` margins, `50%` and `calc()` keep following the overlay box.
 */
const computedValue = (entry: Entry, name: string): string | undefined => {
  try {
    // One map per element and snapshot: a map is live, and making one costs as much as reading it.
    entry.styleMap ??= entry.source.computedStyleMap?.() ?? null;
    return entry.styleMap?.get(name)?.toString();
  } catch {
    // A property this browser's Typed OM doesn't know.
  }
};

/**
 * What to write on `entry`'s clone in `pass`. The first pass writes the source's values;
 * the layout's passes its computed ones where they can. Sizes run twice: those the source
 * sets first, then what still differs, as used: a size the source leaves to the layout
 * (`auto`) may only have followed content fixed by the first.
 */
const compare = (entry: Entry, pass: number): Array<() => void> => {
  const { clone, parent, passes } = entry;
  const style = getComputedStyle(clone);
  const writes: Array<() => void> = [];
  for (const [name, from] of passes[pass]!) {
    let value = style.getPropertyValue(name);
    // Inherited properties are compared in the first pass only.
    const inherited = INHERITED.has(name);
    passes[SHOWN]!.set(name, value);
    // A child that inherits in the clone will inherit its parent's snapshot value.
    if (inherited && parent && value === parent.passes[SHOWN]!.get(name)) value = parent.passes[0]!.get(name)!;
    // Sizes within half a pixel are the same size.
    if (value === from || (pass > 1 && Math.abs(parseFloat(value) - parseFloat(from)) < 0.5)) continue;
    // Passes 1 and 2 take the computed value, and so do inherited values: a unitless
    // `line-height` is inherited as a ratio, not as the root's pixels. Otherwise the
    // source's (used) value.
    const computed = pass % 3 || inherited ? computedValue(entry, name) : undefined;
    // No computed value, or a keyword (`auto`): left to the next pass.
    if (pass === 2 && /^[a-z-]*$/.test(computed + '')) continue;
    writes.push(() => clone.style.setProperty(name, computed ?? from));
  }
  return writes;
};

/**
 * Inlines on `clone` (a deep copy of `source`, shown as `mount`: itself or its table
 * wrapper) the computed styles it would lose in `container`, the overlay's parent.
 * `source` is in the document.
 */
export const snapshotStyles = (source: HTMLElement, clone: HTMLElement, mount: HTMLElement, container: Element) =>
  snapshotMany([{ source, clone, mount }], container);

export interface SnapshotJob {
  source: HTMLElement;
  clone: HTMLElement;
  mount: HTMLElement;
}

/**
 * `snapshotStyles` for several clones at once: every source is read, then the clones are
 * laid out side by side, each in a host of its source's size, and every pass runs over all
 * of them. The page lays out once per pass, not once per pass and clone.
 */
export const snapshotMany = (jobs: readonly SnapshotJob[], container: Element) => {
  const all = jobs.map((job) => ({ ...job, entries: collect(job.source, job.clone) }));
  for (const job of all) job.entries.forEach(readSource);
  const sizes = all.map((job) => job.source.getBoundingClientRect());
  // Overlay boxes, out of the page's layout: `contain` keeps the page from re-laying out.
  const hosts = all.map((job, index) => {
    const host = document.createElement('div');
    host.style.cssText = `position:fixed;contain:strict;width:${sizes[index]!.width}px;height:${sizes[index]!.height}px`;
    host.appendChild(job.mount);
    return host;
  });
  container.append(...hosts);
  try {
    for (let pass = 0; pass < 4; pass++) {
      // Values written start transitions: the reads want where they end. Animations of the
      // clone's own start again in the overlay.
      for (const job of all) job.mount.getAnimations?.({ subtree: true }).forEach((animation) => animation.cancel());
      all.flatMap((job) => job.entries.flatMap((entry) => compare(entry, pass))).forEach((write) => write());
    }
  } finally {
    for (const job of all) job.mount.remove();
    for (const host of hosts) host.remove();
  }
};
