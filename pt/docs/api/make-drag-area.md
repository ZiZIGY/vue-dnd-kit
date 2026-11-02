---
title: "makeDragArea"
description: "Regras para os arrastes que começam dentro de um elemento — um eixo, limites, uma grade, rolagem automática, ativação — sob um único provider para o app inteiro."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/api/make-drag-area"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
function makeDragArea(
  target: MaybeElementRef,
  options?: DragAreaOptions,
): DragAreaReturn;
```

```ts
const board = useTemplateRef<HTMLElement>('board');
makeDragArea(board, { restrictToArea: true, modifiers: [snapToGrid(24)] });
```

Quando há áreas aninhadas, vence a mais próxima, exceto `disabled`, que as áreas internas herdam.
Veja [Eixos, limites e grades](https://zizigy.github.io/docs/guides/constraints).

Os chips dentro da área seguem as regras dela; o que está fora é arrastado livremente.

<example height="36rem" hint="Troque as regras da área, depois arraste um chip dentro dela" name="api-drag-area">



</example>

## Opções

<api-table name="DragAreaOptions">



</api-table>

## Retorno

<api-table name="DragAreaReturn">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
