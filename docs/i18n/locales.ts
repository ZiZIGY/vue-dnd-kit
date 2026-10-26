/**
 * The site's languages, shared by the i18n module, the content collections and the UI.
 * English is the source: every other language is translated from it by AI.
 */

export interface SiteLocale {
  /** Route prefix and content folder (`content/<code>/`). */
  code: 'en' | 'ru' | 'zh' | 'ja' | 'ko' | 'es' | 'pt' | 'de' | 'fr';
  /** BCP 47 tag, for `<html lang>` and `hreflang`. */
  language: string;
  /** Name in its own language, for the switcher. */
  name: string;
  /** Export name of the matching Nuxt UI locale (`@nuxt/ui/locale`). */
  ui: string;
}

export const LOCALES: SiteLocale[] = [
  { code: 'en', language: 'en-US', name: 'English', ui: 'en' },
  { code: 'ru', language: 'ru-RU', name: 'Русский', ui: 'ru' },
  { code: 'zh', language: 'zh-CN', name: '简体中文', ui: 'zh_cn' },
  { code: 'ja', language: 'ja-JP', name: '日本語', ui: 'ja' },
  { code: 'ko', language: 'ko-KR', name: '한국어', ui: 'ko' },
  { code: 'es', language: 'es-ES', name: 'Español', ui: 'es' },
  { code: 'pt', language: 'pt-BR', name: 'Português', ui: 'pt_br' },
  { code: 'de', language: 'de-DE', name: 'Deutsch', ui: 'de' },
  { code: 'fr', language: 'fr-FR', name: 'Français', ui: 'fr' },
];

export const DEFAULT_LOCALE = 'en';

/** The content collection of a locale's docs. */
export const docsCollection = (code: string) => `docs_${code}` as const;
