---
title: "makeDraggable"
description: "Torna um elemento arrastável — arraste livre, ou para dentro dos alvos de drop que o aceitam."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/api/make-draggable"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
function makeDraggable<TData = unknown>(
  target: MaybeElementRef,
  options?: DraggableOptions<TData>,
): DraggableReturn;
```

```ts
const el = useTemplateRef<HTMLElement>('el');
const { isDragging } = makeDraggable(el, { id: 'card', type: 'card', data: { title } });
```

Veja [Arrastar e soltar](https://zizigy.github.io/docs/guides/drag-and-drop). Os itens ordenáveis também são draggables:
[`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item) aceita as mesmas opções e outras mais.

<example height="22rem" hint="Arraste cada card. Solte, e ele volta ao lugar" name="draggable">



</example>

## Opções

<api-table name="DraggableOptions">



</api-table>

## Retorno

<api-table name="DraggableReturn">



</api-table>

## Para fora da página

O que um arraste `native` leva para fora da página. Veja
[arquivos e outros apps](https://zizigy.github.io/docs/guides/native#out-of-the-page).

<api-table name="NativeDragOptions">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
