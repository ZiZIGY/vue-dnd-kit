---
title: "makeSortableTree"
description: "Macht einen Container zu einem sortierbaren Baum, flach gerendert mit Tiefen – Verschachtelung durch Ziehen zur Seite oder durch Hovern über einem Knoten."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/api/make-sortable-tree"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeSortableTree">



</api-signature>

```ts
const root = useTemplateRef<HTMLElement>('root');
const { items } = makeSortableTree(root, { items: files, indentation: 20, collapsed });
```

Jede Zeile ruft [`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item) mit `id: () => node.key` auf.
Siehe [Bäume](https://zizigy.github.io/docs/guides/trees).

<example height="26rem" hint="Schalte eine Option um, dann ziehe eine Zeile seitwärts" name="api-tree-options">



</example>

## Optionen

<api-table name="SortableTreeOptions">



</api-table>

## Rückgabe

<api-table name="SortableTreeReturn">



</api-table>

## Flache Knoten

<api-table name="FlatNode">



</api-table>

## Projektion

<api-table name="TreeProjection">



</api-table>

<api-table name="TreeNesting">



</api-table>

## Das Drop-Event

<api-table name="SortableTreeDropEvent">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
