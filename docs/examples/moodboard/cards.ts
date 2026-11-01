import type { Active, ExternalData } from '@vue-dnd-kit/core';

export type Card =
  | { id: string; kind: 'image'; src: string; name: string }
  | { id: string; kind: 'link'; url: string; title: string }
  | { id: string; kind: 'note'; text: string }
  | { id: string; kind: 'swatch'; color: string; name: string }
  | { id: string; kind: 'incoming'; label: string };

/** Keys of this window: another window of the page makes its own, so cards moved between them never clash. */
export const uid = () => Math.random().toString(36).slice(2, 10);

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

const sky = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3"><defs><linearGradient id="g" x2="0" y2="1"><stop offset="0" stop-color="#fbbf77"/><stop offset="1" stop-color="#f472b6"/></linearGradient></defs><rect width="4" height="3" fill="url(#g)"/><circle cx="2.9" cy="1.1" r=".45" fill="#fff7ed"/></svg>',
)}`;

export const seed = (): Card[] => [
  { id: uid(), kind: 'image', src: sky, name: 'Sunset.svg' },
  { id: uid(), kind: 'swatch', color: '#42b883', name: 'Vue green' },
  { id: uid(), kind: 'note', text: 'Warm light, soft shadows, lots of air between things.' },
  { id: uid(), kind: 'link', url: 'https://vuejs.org', title: 'vuejs.org' },
  { id: uid(), kind: 'swatch', color: '#35495e', name: 'Slate' },
];

/** What a drag from outside will be, while it is held: the browser tells its types only. */
const incoming = (external: ExternalData): string => {
  const count = external.fileTypes.length;
  if (count) return count === 1 ? '1 image' : `${count} images`;
  return external.types.includes('text/uri-list') ? 'a link' : 'a note';
};

/**
 * The board's `createItem`: what comes in from outside the page. While it is held, a tile
 * that says what is coming; at the drop, a card per image, per link, or a note. Cards from
 * this page in another window come as they are, with keys of this window.
 */
export const fromOutside = (active: Active): Card | Card[] | undefined => {
  const { external } = active;
  if (!external) return undefined;
  if (external.group) return active.items.map(({ item }) => ({ ...(item as Card), id: uid() }));
  if (!external.dropped) return { id: 'incoming', kind: 'incoming', label: incoming(external) };
  if (external.files.length) {
    return external.files.map((file) => ({ id: uid(), kind: 'image', src: URL.createObjectURL(file), name: file.name }));
  }
  if (external.urls.length) return external.urls.map((url) => ({ id: uid(), kind: 'link', url, title: host(url) }));
  const text = external.text.trim();
  return text ? { id: uid(), kind: 'note', text: text.slice(0, 280) } : undefined;
};

/** What a card gives other apps when it is dragged out of the page. */
export const toOutside = (card: Card): Record<string, string> => {
  switch (card.kind) {
    case 'image': {
      const src = new URL(card.src, location.href).href;
      // Chromium saves `DownloadURL` as a file where it is dropped (the desktop).
      return { 'text/uri-list': src, 'text/plain': card.name, DownloadURL: `image/png:${card.name}:${src}` };
    }
    case 'link':
      return { 'text/uri-list': card.url, 'text/plain': card.url };
    case 'note':
      return { 'text/plain': card.text };
    case 'swatch':
      return { 'text/plain': card.color };
    default:
      return {};
  }
};

export const labelOf = (card: Card): string => {
  switch (card.kind) {
    case 'image':
      return card.name;
    case 'link':
      return card.title;
    case 'note':
      return card.text.slice(0, 40);
    case 'swatch':
      return card.name;
    default:
      return card.label;
  }
};
