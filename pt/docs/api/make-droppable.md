---
title: "makeDroppable"
description: "Torna um elemento um alvo de drop, com regras para o que ele aceita e hooks para o drop."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/api/make-droppable"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeDroppable">



</api-signature>

```ts
const zone = useTemplateRef<HTMLElement>('zone');
const { isOver, isAccepting } = makeDroppable(zone, {
  accept: 'image',
  onDrop: (e) => move(e.active.id),
});
```

Veja [Arrastar e soltar](https://zizigy.github.io/docs/guides/drag-and-drop) e [Decidindo um drop](https://zizigy.github.io/docs/guides/drop-decisions).

<example height="26rem" hint="Solte os arquivos nas zonas que os aceitam" name="droppable">



</example>

## Opções

<api-table name="DroppableOptions">



</api-table>

## Retorno

<api-table name="DroppableReturn">



</api-table>

## Regras de accept

<api-table name="AcceptRule">



</api-table>

<api-table name="AcceptContext">



</api-table>

<api-table name="AcceptMode">



</api-table>

## De fora da página

O que `external` aceita de arrastes que vêm de fora da página, e o que um arraste assim carrega
(`e.external`). Veja [arquivos e outros apps](https://zizigy.github.io/docs/guides/native).

<api-table name="ExternalAccept">



</api-table>

<api-table name="ExternalData">



</api-table>

<api-table name="ExternalFile">



</api-table>

## Placement

<api-table name="Placement">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
