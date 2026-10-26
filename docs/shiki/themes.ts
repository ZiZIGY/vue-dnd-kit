/**
 * Code themes of the site: keywords in the brand green, warm strings, blue functions,
 * pink tags, quiet punctuation. Used by the Markdown code blocks (Nuxt Content) and by
 * the live examples' sources.
 */

import type { ThemeRegistrationRaw } from 'shiki';

interface Palette {
  name: string;
  type: 'light' | 'dark';
  fg: string;
  keyword: string;
  string: string;
  fn: string;
  tag: string;
  attr: string;
  number: string;
  type_: string;
  comment: string;
  punctuation: string;
}

const theme = (palette: Palette): ThemeRegistrationRaw => ({
  name: palette.name,
  type: palette.type,
  colors: {
    'editor.foreground': palette.fg,
    'editor.background': '#00000000',
  },
  settings: [
    { settings: { foreground: palette.fg, background: '#00000000' } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: palette.comment, fontStyle: 'italic' } },
    {
      scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.control', 'keyword.operator.new', 'variable.language'],
      settings: { foreground: palette.keyword },
    },
    {
      scope: ['string', 'string.quoted', 'string.template', 'punctuation.definition.string', 'markup.inline.raw'],
      settings: { foreground: palette.string },
    },
    { scope: ['constant.numeric', 'constant.language', 'support.constant'], settings: { foreground: palette.number } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call'], settings: { foreground: palette.fn } },
    { scope: ['entity.name.tag', 'support.class.component', 'punctuation.definition.tag'], settings: { foreground: palette.tag } },
    { scope: ['entity.name.type', 'support.type', 'entity.name.class', 'support.class'], settings: { foreground: palette.type_ } },
    { scope: ['entity.other.attribute-name', 'meta.object-literal.key', 'variable.parameter'], settings: { foreground: palette.attr } },
    {
      scope: ['punctuation', 'meta.brace', 'keyword.operator', 'punctuation.separator', 'punctuation.terminator'],
      settings: { foreground: palette.punctuation },
    },
    { scope: ['markup.heading', 'markup.bold'], settings: { foreground: palette.keyword } },
  ],
});

export const codeDark = theme({
  name: 'dnd-dark',
  type: 'dark',
  fg: '#e4e4e7',
  keyword: '#42b883',
  string: '#e9c46a',
  fn: '#7cc4ff',
  tag: '#ff7b9c',
  attr: '#c3a6ff',
  number: '#f4a261',
  type_: '#7ee0c0',
  comment: '#6e6e78',
  punctuation: '#9f9fa9',
});

export const codeLight = theme({
  name: 'dnd-light',
  type: 'light',
  fg: '#27272a',
  keyword: '#1f8a5b',
  string: '#9a6700',
  fn: '#0969da',
  tag: '#cf2257',
  attr: '#7c4dcc',
  number: '#bc4c00',
  type_: '#0f766e',
  comment: '#85858d',
  punctuation: '#5b5b63',
});
