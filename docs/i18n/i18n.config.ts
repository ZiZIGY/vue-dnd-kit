export default defineI18nConfig(() => ({
  // Languages not translated yet (or missing a key) read the English source.
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
}));
