---
title: "makeSortableItem"
description: "Registriert eine Zeile einer sortierbaren Liste oder eines Baums – sie lässt sich ziehen, macht Platz und landet in ihrem Slot."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/api/make-sortable-item"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
function makeSortableItem<TData = unknown>(
  target: MaybeElementRef,
  options: SortableItemOptions<TData>,
): SortableItemReturn;
```

```ts
const el = useTemplateRef<HTMLElement>('el');
const { isPlaceholder, index } = makeSortableItem(el, { item: () => props.task, handle: '.grip' });
```

Rufe es in der Zeilenkomponente auf, die innerhalb des Elements der Liste gerendert wird (von
mehreren Listen, die in einer Komponente angelegt werden, gehört die Zeile zur innersten um sie
herum). Identifiziere die Zeile über `item` (mit dem Schlüssel aus `getKey` der Liste, standardmäßig `item.id`)
oder über `id`. Siehe [Sortierbare Listen](https://zizigy.github.io/docs/guides/sortable-lists).

<example height="24rem" hint="Ziehe eine Zeile an ihrem Griff: Die Checkbox funktioniert weiterhin" name="todo-list">



</example>

## Optionen

<api-table name="SortableItemOptions">



</api-table>

## Rückgabe

<api-table name="SortableItemReturn">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
