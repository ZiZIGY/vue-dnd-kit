import type { Ref } from 'vue';

type Words = Record<string, string>;

// The examples are written in English, like the code a reader copies. Their words in other
// languages: i18n/examples/<locale>.json, English text → translation.
const dictionaries = import.meta.glob<Words>('../../i18n/examples/*.json', { import: 'default' });
const ATTRIBUTES = ['aria-label', 'title', 'placeholder'];

const translateText = (node: Node, words: Words) => {
  const text = node.nodeValue ?? '';
  const key = text.trim();
  const word = key ? words[key] : undefined;
  if (word) node.nodeValue = text.replace(key, word);
};

const translateAttributes = (element: Element, words: Words) => {
  for (const name of ATTRIBUTES) {
    const word = words[element.getAttribute(name) ?? ''];
    if (word) element.setAttribute(name, word);
  }
};

const translate = (node: Node, words: Words) => {
  if (node.nodeType === Node.TEXT_NODE) return translateText(node, words);
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  translateAttributes(node as Element, words);
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  for (let next = walker.nextNode(); next; next = walker.nextNode()) {
    if (next.nodeType === Node.TEXT_NODE) translateText(next, words);
    else translateAttributes(next as Element, words);
  }
};

/**
 * Shows a live example in the page's language: the text it renders (and its labels) that
 * the dictionary knows is swapped for the translation, as it renders. A translation is no
 * key, so nothing is translated twice. Client-only, like the demos.
 */
export function useDemoWords(root: Ref<HTMLElement | null | undefined>) {
  const { locale } = useI18n();
  let observer: MutationObserver | undefined;

  onMounted(async () => {
    const load = dictionaries[`../../i18n/examples/${locale.value}.json`];
    const words = load ? await load() : null;
    if (!words || !root.value) return;
    translate(root.value, words);
    observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === 'childList') record.addedNodes.forEach((node) => translate(node, words));
        else if (record.type === 'characterData') translateText(record.target, words);
        else translateAttributes(record.target as Element, words);
      }
    });
    observer.observe(root.value, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRIBUTES,
    });
  });
  onBeforeUnmount(() => observer?.disconnect());
}
