---
title: "Dashboard"
description: "Widgets em uma grade — movidos pelo cabeçalho, redimensionados pelo canto uma célula por vez, em linhas tão altas quanto o conteúdo, com menos colunas em telas estreitas."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/examples/dashboard"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="38rem" hint="Arraste um widget pelo cabeçalho, redimensione-o pelo canto, digite nas notas" name="dashboard" title="Dashboard">



</example>

## O que observar

- **Dashboard.vue**: a grade é uma única lista ordenável com `strategy: 'grid'`, que ordena
widgets de tamanhos diferentes. Ela conta as colunas a partir da própria largura
(`useElementSize`): quatro, três ou duas. As linhas dela têm pelo menos 92 px de altura e crescem
com o conteúdo, e `grid-auto-flow: dense` preenche os buracos que um redimensionamento deixa.
- **Widget.vue**: um widget se move pelo cabeçalho (`handle`), então o conteúdo dele fica livre:
as tarefas são marcadas, as notas recebem texto. O canto dele é um draggable próprio, e o
redimensiona.
- **WidgetBody.vue**: o que os widgets mostram. Digite nas notas: a linha cresce com o texto, e os
widgets ao lado, com a linha. Nada os mede: é o próprio layout da grade, e a biblioteca lê os
tamanhos como estão quando um arraste começa.
- **widgets.ts**: os widgets, os tamanhos deles em células e os números da grade.

Expanda a demo: a grade ganha quatro colunas, e um widget que ficou mais estreito em uma tela
pequena volta a ser tão largo quanto era.

## Redimensionar: o canto é um draggable

O canto fica dentro do widget, e uma pressão arrasta o draggable mais próximo: o canto, não o
widget. Ele não tem overlay e nunca se move. Em vez disso, o widget cresce.

```ts [Widget.vue]
makeDraggable(corner, {
  id: cornerId,
  type: 'resize',
  overlay: false,
  activation: { touch: { distance: 4 } }, // a finger resizes at once, not after a long press
  attributes: false,                       // no tab stop: Shift + arrows on the header resize
});
```

O tamanho segue o ponteiro: quanto ele andou desde a pressão, em células inteiras. A grade mostra
esse tamanho enquanto o canto é segurado, e os outros widgets dela abrem espaço.

```ts [Widget.vue]
const preview = computed<Size | null>(() => {
  const start = from.value;
  if (!resizing.value || !start || !pointer.value) return null;
  return {
    w: clamp(cellsIn(pixels(own.value.w, props.cell) + pointer.value.x - start.x, props.cell), 1, props.columns),
    h: clamp(cellsIn(pixels(own.value.h, ROW) + pointer.value.y - start.y, ROW), 1, MAX_ROWS),
  };
});
```

O drop o mantém: um monitor ouve o `onDragEnd` do canto. <kbd value="Escape">



</kbd>

 cancela o arraste em
vez disso, e o widget volta ao próprio tamanho.

```ts [Widget.vue]
useDnDMonitor({
  onDragEnd: ({ active: dropped }) => {
    if (dropped.id === cornerId() && preview.value) emit('resize', preview.value);
  },
});
```

## A grade fica de fora do redimensionamento

Um canto não é um widget, e a grade o recusaria: o drop em um alvo que recusa um arraste é um
cancelamento. Então, enquanto um canto é arrastado, a grade fica `disabled`, e o drop do canto não
cai em alvo nenhum.

```ts [Dashboard.vue]
const { active } = useDnD();
const { items } = makeSortableList(grid, {
  items: widgets,
  strategy: 'grid',
  label: 'Dashboard',
  disabled: () => !!active.value?.type.includes('resize'),
});
```

## Tamanhos que se adaptam

Um widget mantém o tamanho que recebeu. Com menos colunas, ele nunca é mais largo que a grade
(`Math.min(w, columns)`), e recupera a largura quando a grade volta a ter espaço. As linhas têm uma
altura mínima, não uma altura: o conteúdo decide, e os widgets de uma linha se esticam todos até o
mais alto.

## O teclado

Chegue com Tab ao cabeçalho de um widget e pressione <kbd value="Space">



</kbd>

 para pegar o widget. As
setas o movem entre os outros, <kbd value="Space">



</kbd>

 o solta, <kbd value="Escape">



</kbd>

 o devolve ao
lugar. Com o cabeçalho focado, <kbd value="Shift">



</kbd>

 e as setas redimensionam o widget uma célula por
vez, e os leitores de tela ouvem o novo tamanho dele.

Leia mais: [Estratégias](https://zizigy.github.io/docs/guides/sortable-lists#strategies) ·
[Handles](https://zizigy.github.io/docs/guides/sortable-lists#handles) ·
[Sem overlay](https://zizigy.github.io/docs/guides/drag-and-drop#without-an-overlay) ·
[useDnDMonitor()](https://zizigy.github.io/docs/guides/provider#listen-to-every-drag-usedndmonitor) ·
[Calendário semanal](https://zizigy.github.io/docs/examples/calendar)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
