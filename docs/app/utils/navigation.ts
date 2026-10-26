import type { ContentNavigationItem } from '@nuxt/content';

/** `''` for English (unprefixed routes), `/ru`, `/zh`, … for the others. */
export const localePrefix = (code: string) => (code === 'en' ? '' : `/${code}`);

/**
 * A locale's navigation built on the English one: every English page is listed, at its
 * localized path, under its translated title when the page is translated. Untranslated
 * pages still open (in English, flagged), so the sidebar never has holes.
 */
export function localizeNavigation(
  source: ContentNavigationItem[] | null | undefined,
  translated: ContentNavigationItem[] | null | undefined,
  prefix: string,
): ContentNavigationItem[] {
  if (!prefix) return source ?? [];
  const titles = new Map<string, ContentNavigationItem>();
  const collect = (items: ContentNavigationItem[]) => {
    for (const item of items) {
      titles.set(item.path, item);
      if (item.children) collect(item.children);
    }
  };
  collect(translated ?? []);
  const map = (items: ContentNavigationItem[]): ContentNavigationItem[] =>
    items.map((item) => {
      const path = `${prefix}${item.path}`;
      const own = titles.get(path);
      return {
        ...item,
        ...(own ? { title: own.title, icon: own.icon ?? item.icon } : {}),
        path,
        children: item.children ? map(item.children) : undefined,
      };
    });
  // English trees start at `/docs`; a locale's at `/<code>`: wrap it the same way.
  return [{ title: '', path: prefix, children: map(source ?? []) }];
}

/** The docs part of a navigation tree: the children of `/docs` (`/ru/docs`, …). */
export function docsNavigation(navigation: ContentNavigationItem[] | null | undefined, prefix: string) {
  const root = `${prefix}/docs`;
  const find = (items: ContentNavigationItem[]): ContentNavigationItem | undefined => {
    for (const item of items) {
      if (item.path === root) return item;
      const found = item.children && find(item.children);
      if (found) return found;
    }
    return undefined;
  };
  return find(navigation ?? [])?.children ?? [];
}
