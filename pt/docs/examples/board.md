---
title: "Quadro de projeto"
description: "Um quadro de produto no espírito do Linear e do Trello — colunas que você reordena, limites de WIP, uma pergunta antes de Done, seleção múltipla com uma barra de seleção, filtros através dos quais os arrastes funcionam, uma lixeira com Undo e um painel de card cujos botões de Status executam arrastes de verdade."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/examples/board"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="40rem" hint="Arraste cards e colunas; clique em um card para abri-lo, Ctrl/Cmd-clique para selecionar" name="board" title="Quadro de projeto">



</example>

## O que observar

- **Board.vue**: as colunas são uma lista ordenável horizontal própria (`strategy: 'horizontal'`, `axis: 'x'`), e cada coluna é um item ordenável arrastado pelo cabeçalho
(`handle`). Expandido, o quadro preenche a tela; no celular, ele rola para os lados.
- **Column.vue**: os cards de todas as colunas são um único `group`, com as regras da coluna: o
limite de WIP, a pergunta antes de Done e os filtros. O medidor no cabeçalho acende os cards que
um arraste traria.
- **Card.vue**: um item ordenável de `type: 'card'`, então a lixeira aceita cards e não colunas.
Um clique o abre, Ctrl/Cmd-clique o seleciona (`selected`); com o teclado, Space o pega, Enter o
abre e X o seleciona.
- **store.ts**: os dados e as regras do quadro, sem nenhum arrastar e soltar neles, fornecidos
acima do `DnDProvider` para que o overlay também os leia.

## As regras de uma coluna

Cada coluna passa quatro regras para a sua lista. `put` vê todos os cards de um multi-drag de uma
vez: a coluna aceita todos se couberem no limite dela, ou nenhum. Sobre uma coluna cheia, a
posição fica onde o arraste começou, a coluna fica vermelha e os cards na mão dizem por quê.
`onBeforeDrop` pergunta antes de os cards entrarem em Done, e `animateChanges` desliza os cards que
entram e saem sem um arraste: um filtro, Add card, Undo.

```ts [Column.vue]
const { items, isOver, isAccepting } = makeSortableList(list, {
  id: props.column.id,
  items: () => props.column.cards.filter(board.matches),
  group: { name: 'cards', put: ({ keys }) => board.fits(props.column, keys) },
  overlay: CardOverlay,
  animateChanges: true,
  onBeforeDrop: (event) => (props.column.confirm && !event.sameList ? board.ask(event.items) : 'accept'),
  onDrop: (event) => {
    event.preventDefault();
    board.apply(event);
  },
});
```

## Filtros, e drops que o quadro aplica

A busca e as pessoas na barra de ferramentas filtram os cards, e todo arraste continua funcionando
sobre o que é mostrado. Cada lista lê a sua coluna por um getter, filtrada, então a biblioteca
nunca a escreve: `onDrop` chama `preventDefault()` e entrega ao quadro `e.result`, os novos cards
filtrados de cada coluna que o drop alterou. O quadro os coloca de volta nos lugares que os cards
mostrados ocupavam, e os cards que os filtros escondem ficam onde estavam.

```ts [store.ts]
const merge = (all: Card[], shown: Card[]) => {
  const queue = [...shown];
  const merged: Card[] = [];
  for (const entry of all) {
    if (!matches(entry)) merged.push(entry);
    else if (queue.length) merged.push(queue.shift()!);
  }
  // Cards that came in from another column and found no place left: at the end.
  return [...merged, ...queue];
};
```

## Os cards na mão

**CardOverlay.vue** é o `overlay` dos cards. O card pego se ergue e se inclina, o resto de uma
seleção fica embaixo dele, feito de clones `DragPreview` girados pelo `transform` dos seus
wrappers, e uma contagem fica por cima. Embaixo dos cards, uma dica diz o que soltar faria, a
partir do `over` e do `accepted` do overlay: *Move 2 cards to In review*, *Complete*, *Delete* ou
*In review is full · 2 max*. Soltos em uma coluna, cada clone pousa na sua própria posição; sobre a
lixeira a pilha encolhe, e soltos ali os cards entram um depois do outro.

```ts [CardOverlay.vue]
const hint = computed(() => {
  if (props.status !== 'dragging' || !props.over) return null;
  const many = props.items.length > 1 ? ` ${props.items.length} cards` : '';
  if (props.over.id === 'trash') return { tone: 'danger', icon: 'trash', text: `Delete${many}` };
  const column = board.column(props.over.id);
  if (!column) return null;
  if (!props.accepted) return { tone: 'danger', icon: 'limit', text: `${column.title} is full · ${column.limit} max` };
  if (board.find(props.items[0]!.id)?.column.id === column.id) return null;
  if (column.confirm) return { tone: 'done', column, text: `Complete${many}` };
  return { tone: '', column, text: `Move${many} to ${column.title}` };
});
```

Uma coluna arrastada pelo cabeçalho é o clone padrão, inclinado com a propriedade `rotate`
enquanto `data-dnd-overlay` vale `dragging`.

## Done pergunta antes

Um drop em Done retorna uma promise do `onBeforeDrop`: os cards esperam onde foram soltos enquanto
**ConfirmDialog.vue** pergunta. *Move to Done* responde `'accept'`, Cancel e Escape `'reject'`
(os cards voltam ao lugar), e *Keep dragging* `'continue'`: os cards voltam a seguir o ponteiro, e
o próximo clique os solta. Depois que os cards pousam (`onDragSettle`), o check deles aparece em
Done e o progresso do sprint avança.

```ts [Board.vue]
useDnDMonitor({
  onDragSettle: (event) => {
    const target = event.over ? board.column(event.over.id) : undefined;
    if ('dropped' in event && target?.confirm && event.source?.list !== target.id) board.complete(event.accepted);
  },
});
```

## Vários cards, a lixeira e Undo

Cards selecionados viajam juntos: arraste um, e todo card selecionado vem junto, de qualquer
coluna. A barra de seleção os move, os apaga ou limpa a seleção (Escape também). O **Trash.vue**
é um alvo de drop simples que só aceita cards; ele os apaga do quadro, como fazem os botões
Delete, para que o aviso possa devolver cada um ao seu lugar.

```ts [Trash.vue]
makeDroppable(el, {
  id: 'trash',
  accept: 'card',
  onDrop: (event) => {
    board.remove(event.active.ids);
    selection.delete(...event.active.ids);
  },
});
```

## Mover sem arrastar

O painel de um card tem botões de Status, e a barra de seleção tem um botão por coluna. Eles movem
cards com `@vue-dnd-kit/actions`: `moveItem` executa um arraste por teclado de verdade do card, e
um card selecionado leva a seleção junto. Ele é anunciado e animado como os seus, e o limite da
coluna e a pergunta de Done valem para ele como para qualquer arraste.

```ts [store.ts]
export function useMove() {
  const board = inject(BOARD)!;
  const { moveItem } = useDnDActions();
  return (ids: Key[], target: Column) => {
    if (!board.fits(target, ids)) return board.notify(`${target.title} is full: ${target.limit} cards at most`);
    void moveItem(ids[0]!, { list: target.id });
  };
}
```

## Teclado e leitores de tela

Só Space pega um card, então Enter fica livre para abri-lo; as instruções dizem isso. As setas
movem um card de posição em posição, e para a próxima coluna que o aceita: uma cheia é pulada, e
depois da última coluna o próximo toque leva o card até a lixeira. Os anúncios dizem os nomes dos
cards e das colunas em vez dos ids: *"Picked up VDK-45, Haptics on Android tablets. Todo, position
6 of 6."*, *"In review is full: its limit is 2 cards."*

```vue [index.vue]
<DnDProvider
  :keyboard="{ keys: { start: ['Space'] } }"
  screen-reader-instructions="Space picks up a card or a column, the arrow keys move it, Space drops it, Escape cancels. Enter opens a card, X selects it."
  :announcements="announcements"
  :haptics="{ enter: true, refuse: true }"
>
```

Leia mais: [Listas que compartilham itens](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists) ·
[Decidindo um drop](https://zizigy.github.io/docs/guides/drop-decisions) · [Multi-drag](https://zizigy.github.io/docs/guides/multi-drag) ·
[O overlay](https://zizigy.github.io/docs/guides/overlay#dragpreview-the-clone-in-your-layout) ·
[Arrastes programáticos](https://zizigy.github.io/docs/guides/sensors#programmatic-drags) ·
[Acessibilidade](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
