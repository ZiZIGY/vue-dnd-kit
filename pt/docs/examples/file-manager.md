---
title: "Gerenciador de arquivos"
description: "Um drive na nuvem — visualizações em grade e em lista, seleção por retângulo, pastas que aceitam drops em todo lugar e abrem com o ponteiro parado em cima, Alt para copiar, uma Lixeira com Undo, e arquivos soltos a partir da sua área de trabalho."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/examples/file-manager"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="40rem" hint="Desenhe um retângulo em volta de arquivos, solte-os em uma pasta; Alt copia" name="file-manager" title="Gerenciador de arquivos">



</example>

## O que observar

- **FileView.vue**: a pasta aberta é uma única lista ordenável, mostrada como uma grade de blocos
ou uma lista de linhas. O retângulo, os cliques e as teclas selecionam; um arraste leva a
seleção.
- **useFolderDrop.ts**: toda pasta na tela é um alvo de drop: blocos, linhas da árvore,
favoritos, as migalhas do caminho, a Lixeira. Ela diz por que recusa um arraste, e engole os
arquivos quando eles entram.
- **FilesOverlay.vue**: o que segue o ponteiro, feito a partir das props que todo overlay recebe:
uma pilha dos blocos reais com uma contagem, um "+" enquanto Alt copia, e o que o drop faria.
- **SidebarRow.vue**: uma pasta fechada da árvore abre quando um arraste para sobre ela, para que
as suas subpastas possam receber o drop. **Favorites.vue** é uma lista ordenável própria, cujas
linhas também são alvos de drop.
- **useDesktopDrop.ts**: arquivos arrastados do seu computador. Isso é o arrastar e soltar do
navegador, não o da biblioteca, tratado ao lado dele.
- **drive.ts**: o estado e toda mudança, com Undo. **index.vue**: o provider, com as teclas
remapeadas e os seus anúncios.

## Uma lista, duas visualizações

A grade e a lista são a mesma lista ordenável. As opções dela são getters, lidos quando um arraste
começa: a estratégia acompanha a visualização, e uma pasta ordenada por uma coluna (`sort: false`)
não se reordena. Os arrastes continuam entrando nas pastas dela.

```ts [FileView.vue]
const { items } = makeSortableList(list, {
  items: drive.entries,   // the open folder, sorted by a column or in your own order
  group: 'files',
  strategy: () => (grid.value ? 'grid' : 'vertical'),
  sort: () => drive.sort.value.key === 'manual',
  multiple: 'gaps',       // the other picked files wait in place, as in Finder
  clone: drive.duplicateOf, // Alt-drag leaves the files and drops "Budget copy.xlsx"
  dropzone: area,         // the empty space takes drops too
  animate: true,          // a new sort, a new folder, files sent to the Trash slide and fade
});
```

- `drive.entries` é um computed gravável: a biblioteca escreve cada drop de volta pelo `set` dele,
e o `onDrop` da lista salva o drive antes, para o Undo.
- A janela cria uma nova visualização para cada pasta (`:key` no `FileView`), então abrir uma não é
uma mudança da lista que o `animate` animaria.

## Selecionar

O provider guarda a seleção; a visualização decide como as pessoas a fazem. Uma pressão no espaço
vazio desenha um retângulo: sozinho ele substitui a seleção; com Shift, Ctrl ou Cmd segurado, ele
inverte os blocos que cruza. A estratégia é um getter, lido quando um retângulo começa:

```ts [FileView.vue]
let adding = false;
const { isSelecting, style } = makeSelectionArea(area, {
  strategy: () => (adding ? 'toggle' : 'select'),
});

// On the area, `@pointerdown.capture`: it runs before the band's own listener.
const onPress = (event: PointerEvent) => {
  adding = event.shiftKey || event.ctrlKey || event.metaKey;
};
```

Os cliques seguem o Finder: um clique escolhe um, Ctrl/Cmd-clique o adiciona ou remove, Shift-clique
pega a sequência a partir do último. As setas movem uma única parada de tab pelos arquivos (um
`tabindex` itinerante, que a biblioteca não toca), Shift+setas estendem, Enter abre, F2 renomeia,
Delete manda para a Lixeira, e digitar pula para um nome. O provider devolve Enter para o app: só
Space pega um arquivo.

```vue [index.vue]
<script setup lang="ts">
// Space picks a focused file up and drops it; Enter is left to open folders.
const keyboard = { keys: { start: ['Space'], drop: ['Space', 'Enter'] } };
</script>

<template>
  <DnDProvider :keyboard="keyboard" :announcements="announcements">
    <FileManager />
  </DnDProvider>
</template>
```

## As pastas aceitam drops em todo lugar

`useFolderDrop` transforma qualquer elemento em uma pasta que aceita arquivos. Um bloco também é um
item ordenável da grade: ali o alvo só conta no meio do bloco, e perto das bordas a grade abre
espaço. `accept` recusa a pasta em que os arquivos já estão, e uma pasta dentro de si mesma; um
bloco que recusa deixa a grade ordenar sobre ele como sobre qualquer outro.

```ts [useFolderDrop.ts]
const { id, isOver, isAccepting } = makeDroppable(target, {
  disabled: () => !folder(),
  data: () => drive.placeOf(folder()!),   // { name, trash, why }: the overlay reads it as `over.data`
  accept: ({ active, types }) => types.includes('files') && !drive.whyNot(active.ids, folder()!),
  onDrop: (event) => drive.dropInto(event, folder()!),
});

// The files are in once the overlay has landed in the folder: it gulps.
useDnDMonitor({
  onDragSettle: (event) => {
    if ('dropped' in event && event.dropped && event.over?.id === id.value) gulps.value++;
  },
});
```

`dropInto` move os arquivos, ou os copia quando `event.mode` é `'copy'` (Alt segurado sobre uma
lista com `clone`). Uma movimentação chama `event.source.remove()`: a grade solta os arquivos, e o
`onDrop` dela roda com `to.index === -1`.

```ts [drive.ts]
const dropInto = (event: DnDEvent, target: FolderEntry) => {
  const dragged = entries.value.filter((entry) => event.active.ids.includes(entry.id));
  const copying = event.mode === 'copy' && !isTrash(target) && !inTrash.value;
  record(`${copying ? 'Copied' : 'Moved'} ${describe(dragged)} to ${isTrash(target) ? 'the Trash' : target.name}`);
  if (copying) return put(target, dragged.map(copyEntry), current.value);
  put(target, dragged, current.value);
  // The grid lets them go: the library writes the open folder without them.
  event.source?.remove();
  selection.delete(...event.active.ids);
};
```

Um favorito é ao mesmo tempo um item ordenável (em `Favorites.vue`, uma lista do seu próprio grupo)
e um alvo de drop: `FavoriteRow.vue` passa o componente da linha para `makeSortableItem`, que lê o
elemento raiz dele, e `SidebarRow.vue` faz do mesmo elemento uma pasta. Perto das bordas, um
favorito arrastado ordena; arquivos soltos nele entram na sua pasta.

### Pastas com mola

Uma pasta fechada da árvore abre quando um arraste para sobre ela, como no Finder: `isOver` se
mantém por um momento, e a linha se expande. As subpastas dela são montadas no meio do arraste e
aceitam drops na hora.

```ts [SidebarRow.vue]
const springing = computed(() => isOver.value && props.expandable && !props.expanded);
watch(springing, (now) => {
  clearTimeout(timer);
  if (now) timer = setTimeout(() => emit('toggle'), 700);
});
```

## O overlay

`FilesOverlay.vue` é o `overlay` da lista. A partir da grade, ele empilha `DragPreview`s, os clones
reais dos blocos escolhidos: soltos em uma posição, cada um pousa no seu próprio bloco; soltos em
uma pasta, eles entram um depois do outro. Uma linha é tão larga quanto a lista, então a lista
centraliza a caixa no ponteiro (`snapCenterToCursor`) e o overlay pendura um pequeno chip nela. O
overlay é uma função, que o Vue trata como um componente funcional: ela repassa as props que lê e
diz qual dos dois desenhar.

```ts [FileView.vue]
overlay: ({ items, over, accepted, status, mode }: OverlayProps) =>
  h(FilesOverlay, { items, over, accepted, status, mode, rows: !grid.value }),
modifiers: () => (grid.value ? [] : [snapCenterToCursor]),
```

Embaixo da pilha, uma pílula diz o que soltar faria, a partir do `data` da pasta: "Move to Photos",
"Copy to Photos" enquanto Alt está segurado (`mode`), ou em vermelho o motivo de não poder, quando
`accepted` é `false`.

```ts [FilesOverlay.vue]
const place = computed(() => (props.status === 'dragging' ? (props.over?.data as DropPlace | undefined) : undefined));
const pill = computed(() => {
  if (!place.value) return null;
  if (!props.accepted) return { refused: true, text: place.value.why ?? 'Can’t go here' };
  if (place.value.trash) return { refused: false, text: 'Move to Trash' };
  return { refused: false, text: `${props.mode === 'copy' ? 'Copy' : 'Move'} to ${place.value.name}` };
});
```

Os `announcements` do provider leem o mesmo `data`, então um leitor de tela ouve "Over Photos.
Drop to move 3 items there", ou "Already in Documents". Eles dizem os nomes dos arquivos, onde os
textos embutidos diriam as keys deles.

## Arquivos da sua área de trabalho

Arraste arquivos do seu computador para a janela: eles são enviados para a pasta sob o ponteiro (um
bloco, uma linha da barra lateral, uma migalha), senão para a pasta aberta, e as fotos se mostram.
A biblioteca arrasta elementos da página; arquivos de fora vêm com o arrastar e soltar do próprio
navegador, `dragover` e `drop`, tratados ao lado dela:

```ts [useDesktopDrop.ts]
const dragover = (event: DragEvent) => {
  if (!carriesFiles(event)) return;
  // Cancelled, a `dragover` says the drop is welcome here.
  event.preventDefault();
  const folder = folderAt(event); // under the pointer: an element with a folder's `data-id`
  // …nothing goes into the Trash…
  drive.uploadTarget.value = folder.id; // that folder opens, as for the library's drags
};
```

## Undo, a Lixeira e o resto

- Toda mudança salva antes uma cópia do drive; o Undo do toast (ou Ctrl/Cmd+Z) volta para ela. A
Lixeira é uma pasta fora da árvore: o que está nela lembra de onde veio, e Put Back o leva de
volta para lá.
- `ContextMenu.vue` (um clique com o botão direito, Shift+F10 ou o botão "⋯") age sobre a seleção,
ou sobre a pasta aberta: Rename no lugar, Duplicate, Add to Favorites, Move to Trash, Empty Trash.
- A janela preenche o palco quando você a expande, e o painel de informações abre ao lado dos
arquivos. No celular, a barra lateral é uma gaveta; um toque abre uma pasta e um toque longo pega
um arquivo.

Leia mais: [Multi-drag e seleção](https://zizigy.github.io/docs/guides/multi-drag) ·
[Drop dentro de um item ordenável](https://zizigy.github.io/docs/guides/drag-and-drop#drop-into-a-sortable-item) ·
[`DragPreview`](https://zizigy.github.io/docs/guides/overlay#dragpreview-the-clone-in-your-layout) ·
[Mudanças nos dados: `animate`](https://zizigy.github.io/docs/guides/animations#data-changes-animate) ·
[Acessibilidade](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
