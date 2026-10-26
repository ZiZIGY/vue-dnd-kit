# Translating the docs

English is the source: the pages in `content/en`, the JSDoc of the library's types, and the UI
strings in `i18n/locales/en.json`. Every other language is translated from it by AI. Each
translation records which English text it was made from, so when the English changes, the
translation shows up as outdated, and the site tells its readers so until it is redone.

The live examples (`examples/`) and all code stay in English.

## What is translated, and where

| What | Files | Tracks its English with |
| --- | --- | --- |
| Pages and the sidebar sections | `content/<code>/**`, mirroring `content/en/**` (`.md`, `.navigation.yml`) | `source:` |
| API descriptions (the tables of the API pages) | `i18n/api/<code>/<types file>.json` | `source` of each text |
| UI strings (header, home page, notices) | `i18n/locales/<code>.json`, the keys of `en.json` | — |
| The language's terms | `i18n/glossary/<code>.md` | — |

## Workflow

```bash
node tools/i18n.ts status            # every language at a glance
node tools/i18n.ts status ru         # what to (re)translate in Russian, with the `source` of each page
node tools/i18n.ts prepare ru        # writes the API texts to (re)translate into i18n/api/ru/
node tools/i18n.ts headings content/en/docs/2.guides/07.overlay.md   # the ids to keep
```

1. **Glossary first.** Read `i18n/glossary/<code>.md`, or start it: the terms of the library
   (drag, drop, overlay, placeholder, sortable list, drop target, handle, multi-drag…), how
   the reader is addressed, and anything else to keep the same on every page. Keep it short
   and use it on every page.
2. **Pages.** Translate each English file to the same path under `content/<code>/`. The
   frontmatter starts with `source: <hash>`, the hash `status` prints for that page; a
   `.navigation.yml` starts with the same line. For an outdated page, compare it with the
   English (the git history of the English file shows what changed), update what changed,
   and set the new `source`.
3. **API descriptions.** Run `prepare`: each text to translate gets `en`, the English, and an
   empty (or outdated) `text`. Write the translation into `text` and delete `en`. Leave
   `source` as `prepare` wrote it.
4. **UI strings.** The same keys as `en.json`, in the same nesting and order. Placeholders
   (`{name}`) stay as they are.
5. **Check.** `status <code>` lists nothing left.

## Pages

- **Frontmatter:** translate `title`, `description`, `category`, `navigation.title` and
  `links[].label`. Keep every key, `navigation.icon` and `links[].to`. In a `.navigation.yml`,
  translate `title`.
- **Headings keep the English ids**, so links to a section work in every language:
  `## Стандартный клон {#the-default-clone}`. Every heading from `##` down gets one;
  `headings` prints them for the English file.
- **Code blocks stay exactly as they are**, comments included. So does inline code
  (`` `onDrop` ``, `'continue'`, `data-dnd-overlay`), and names of APIs, options, events, files
  and packages.
- **Links:** keep the path and the anchor (`/docs/guides/overlay#the-default-clone`), translate
  the text. The site opens them in the reader's language.
- **Components:**
  - `::example{name height hint title}`: translate `hint` and `title`.
  - `::card{title to icon}` and other cards: translate `title` and the body.
  - `::tip`, `::note`, `::warning`: translate the body.
  - `::api-table{name}`, `:kbd{value}`, `::code-group`: unchanged.
- **Tables:** translate the text cells; code cells stay.
- **Say the same, in the language's own way.** Don't add, drop or "improve": the meaning stays
  the English one. Plain, direct sentences, as in the English. Use the terms developers of the
  language actually use (often the English word in code font); the glossary decides.
- If the English looks wrong, translate it faithfully and report it.

## API descriptions

The same rules: `` `code` `` stays, `**bold**` stays bold, lines starting with `- ` are list
items, and a blank line (`\n\n`) separates paragraphs. Keep that structure in `text`.
