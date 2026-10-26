import { defineCollection, defineContentConfig } from '@nuxt/content';
import { z } from 'zod';
import { DEFAULT_LOCALE, LOCALES, docsCollection } from './i18n/locales';

// `title`, `description` and `navigation` come with the page type.
const docsSchema = z.object({
  /** Mono label above the title, e.g. `Guide`, `API`. */
  category: z.string().optional(),
  /** Related links shown under the lead. */
  links: z.array(z.object({ label: z.string(), to: z.string(), icon: z.string().optional() })).optional(),
});

/**
 * One docs collection per locale: `content/<locale>/docs/**` → `/docs/…` in English,
 * `/<locale>/docs/…` in the others, matching the i18n routes (`prefix_except_default`).
 */
const docs = Object.fromEntries(
  LOCALES.map(({ code }) => [
    docsCollection(code),
    defineCollection({
      type: 'page',
      source: { include: `${code}/**`, prefix: code === DEFAULT_LOCALE ? '/' : `/${code}` },
      schema: docsSchema,
    }),
  ]),
);

export default defineContentConfig({
  collections: docs,
});
