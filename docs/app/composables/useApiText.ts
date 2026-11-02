import { translations } from '#api';

/**
 * The descriptions of the API reference (`modules/api.ts`) in the page's language: `text(key,
 * english)` gives the translation of `key` (`Name`, `Name.member` or an export's name) while it
 * is up to date, else the English.
 */
export const useApiText = async () => {
  const { locale } = useI18n();
  const words = (await translations[locale.value]?.())?.default ?? {};
  return (key: string, english: string) => words[key] ?? english;
};
