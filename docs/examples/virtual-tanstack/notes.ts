export interface Note {
  id: string;
  title: string;
  body: string;
  tag: 'Idea' | 'Bug' | 'Todo' | 'Read';
}

const TITLES = [
  'Pinch to zoom on the board',
  'Overlay flickers on Safari',
  'Write the release post',
  'Read: FLIP animations',
  'Undo for every drop',
  'Dark mode for the editor',
  'Keyboard drags in tables',
  'Card covers from links',
];
const SENTENCES = [
  'Short and sweet.',
  'Came up twice in the last call, worth a closer look before Friday.',
  'Needs a quick design pass and a test on a real phone, then it can ship with the next minor.',
  'Ask the team.',
  'Links, screenshots and the whole thread are in the issue; the fix may be a one-liner, or it may not.',
];
const TAGS: Note['tag'][] = ['Idea', 'Bug', 'Todo', 'Read'];

/** `count` notes, the same every time, with bodies of one to three sentences. */
export const makeNotes = (count: number): Note[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `n${i + 1}`,
    title: TITLES[i % TITLES.length]!,
    body: Array.from({ length: 1 + ((i * 7) % 3) }, (_, s) => SENTENCES[(i + s * 3) % SENTENCES.length]).join(' '),
    tag: TAGS[(i * 5) % TAGS.length]!,
  }));
