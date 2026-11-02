---
title: "O overlay"
description: "O que segue o ponteiro enquanto você arrasta — o clone padrão e como estilizá-lo, componentes de overlay que mudam durante o arraste, vários itens de uma vez, o tamanho dele e onde ele é renderizado."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/guides/overlay"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Enquanto você arrasta, uma caixa segue o ponteiro: o **overlay**. O próprio elemento arrastado
fica onde estava, como a posição em que vai pousar. No drop, o overlay voa até essa posição e
desaparece.

O overlay é teleportado para o `body`, fora dos seus componentes. Por padrão, ele mostra um clone
do elemento arrastado.

<example height="22rem" hint="Digite em uma linha, marque-a, depois arraste-a pelo grip: a cópia mantém os valores e o gráfico" name="overlay">



</example>

## O clone padrão

O clone é feito ao pegar o item, antes de qualquer coisa se mover. É uma cópia profunda do
elemento:

- Os valores de formulário e os pixels de `<canvas>` são copiados.
- Os estilos computados que o elemento perderia fora da lista são aplicados inline: fontes e
cores herdadas, estilos que valem por causa dos ancestrais (`.list li { … }`), larguras de
células de tabela. Uma linha de tabela vem envolvida em uma tabela própria.
- `id`s e atributos `data-dnd-*` são removidos, e o clone é `aria-hidden`.
- Ripples e outros efeitos de pressão de UI kits (Vuetify, Quasar, PrimeVue, Naive UI) ficam de
fora.

Na tabela acima, uma linha em que você digitou viaja com o texto, o valor, a marcação e o
gráfico, em uma tabela própria cujas células mantêm as larguras das reais.

Marque qualquer outra coisa que não deve viajar com **data-dnd-no-clone**: um botão de menu, um
tooltip, uma marca de seleção. O botão de remover de cada linha fica para trás:

```vue [ExpenseRow.vue]
<tr ref="el" class="row">
  …
  <td><button type="button" aria-label="Remove" data-dnd-no-clone @click="emit('remove')">×</button></td>
</tr>
```

### Os fundos não são adivinhados

O clone mostra o elemento como ele é. Uma linha que não tem fundo próprio, porque a lista o
pinta (um `<li>` em um `<ul>` branco, um `v-list-item`, uma linha de tabela), gera um clone
**transparente**. Dê a ele o fundo da lista em CSS, aqui nas células:

```vue [ExpenseRow.vue]
<style scoped>
[data-dnd-overlay] .row td {
  background: color-mix(in srgb, currentColor 4%, Canvas);
}
</style>
```

O clone mantém as classes e os atributos do elemento, incluindo o atributo de escopo do Vue,
então a regra funciona tanto no estilo scoped da linha quanto em uma folha de estilos global. A
outra saída é um fundo na própria linha. Ícones e blocos feitos para flutuar ficam transparentes
de propósito.

## Estilizar a caixa

A caixa é o elemento com `data-dnd-overlay`. Ela é `position: fixed`, fica por cima
(`z-index: 9999`), é `pointer-events: none` e `inert`, e o valor do atributo diz o que ela está
fazendo:

<table>
<thead>
  <tr>
    <th>
      <code>
        data-dnd-overlay
      </code>
    </th>
    
    <th>
      Quando
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        "dragging"
      </code>
    </td>
    
    <td>
      Ela segue o ponteiro.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        "dropping"
      </code>
    </td>
    
    <td>
      Ela pousa na sua posição, volta ao lugar ou espera um <code>
        onBeforeDrop
      </code>
      
       assíncrono.
    </td>
  </tr>
</tbody>
</table>

Um visual erguido durante o arraste, que some ao pousar:

```css
[data-dnd-overlay='dragging'] .row td {
  box-shadow: 0 14px 20px -16px rgb(0 0 0 / 0.7);
}
```

A caixa se move com `transform` e recebe o tamanho como `width` e `height`: estilize o que está
dentro dela, não a caixa. O clone a preenche, com `width: 100%`, `height: 100%` e
`transform: none` definidos na raiz dele: gire-o ou aumente-o com as propriedades `rotate` e `scale`, que
transições e keyframes animam. Receitas em [animações](https://zizigy.github.io/docs/guides/animations).

## Componentes de overlay

Para mostrar algo diferente do clone, passe um componente. Ele é renderizado dentro da caixa e
recebe o arraste como props, que mudam enquanto você arrasta: onde o arraste está, se aquele lugar
o aceita, se o drop copia, e o próprio drop.

<example height="26.5rem" hint="Arraste um ticket sobre as colunas: Done aceita os aprovados e os carimba; segure Alt para copiar" name="overlay-live">



</example>

```vue [TicketOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DnDStatus, DragItem, DragMode, Over } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean; status: DnDStatus; mode: DragMode }>();
const ticket = computed(() => props.items[0]?.item as Ticket);

const state = computed(() => {
  if (props.status === 'dropping') return props.over ? 'landed' : 'back'; // a cancel flies back
  if (!props.over) return 'free';
  return props.accepted ? 'ok' : 'refused';
});
</script>

<template>
  <!-- Fills the overlay box, which takes the size of the slot. -->
  <div class="ticket-overlay" :data-state="state">
    {{ ticket.title }}
    <span v-if="mode === 'copy'" class="copy">+ copy</span>
  </div>
</template>

<style scoped>
.ticket-overlay { width: 100%; height: 100%; }
.ticket-overlay[data-state='refused'] { background: color-mix(in srgb, #ef4444 8%, Canvas); }
</style>
```

<table>
<thead>
  <tr>
    <th>
      Prop
    </th>
    
    <th>
      O que contém
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        active
      </code>
    </td>
    
    <td>
      O arraste (<code>
        id
      </code>
      
      , <code>
        ids
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        type
      </code>
      
      , …).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        items
      </code>
    </td>
    
    <td>
      Todos os itens arrastados, o pego primeiro: <code>
        { id, item, data, type }
      </code>
      
      . <code>
        item
      </code>
      
       é o item da lista em arrastes ordenáveis.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
    </td>
    
    <td>
      O alvo sob o arraste; enquanto um drop pousa, o alvo em que ele pousa. <code>
        null
      </code>
      
       sobre nada e enquanto um arraste recusado ou cancelado volta ao lugar. O <code>
        over.id
      </code>
      
       de uma lista ordenável é o <code>
        id
      </code>
      
       da lista: as colunas acima usam os seus nomes.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        accepted
      </code>
    </td>
    
    <td>
      Se <code>
        over
      </code>
      
       aceita o arraste: pinte o overlay de vermelho quando não aceita.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        status
      </code>
    </td>
    
    <td>
      <code>
        'dragging'
      </code>
      
      , depois <code>
        'dropping'
      </code>
      
       enquanto ele pousa.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        mode
      </code>
    </td>
    
    <td>
      <code>
        'move'
      </code>
      
      , <code>
        'copy'
      </code>
      
       (Alt segurado em um arraste de uma lista com <code>
        clone
      </code>
      
      , ou um arraste de uma paleta), <code>
        'swap'
      </code>
      
       ou <code>
        'insert'
      </code>
      
       (um draggable simples entrando em uma lista).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        to
      </code>
    </td>
    
    <td>
      Onde um drop colocaria os itens agora: <code>
        { list, index }
      </code>
      
      , e em uma árvore também <code>
        parentKey
      </code>
      
       e <code>
        depth
      </code>
      
      . <code>
        null
      </code>
      
       quando ele não os colocaria em nenhuma lista, por exemplo sobre um alvo simples. Veja <a href="#where-the-drop-would-go-to">
        onde o drop iria parar
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

As props são `OverlayProps`; declare só as que você lê. Passe o componente para o que for
arrastado:

```ts
import TicketOverlay from './TicketOverlay.vue';

makeSortableList(listRef, { items: tickets, overlay: TicketOverlay });   // every item of the list
makeSortableItem(el, { item: () => props.ticket, overlay: TicketOverlay }); // this item
makeDraggable(el, { id: 'chip', overlay: TicketOverlay });                // a plain draggable
```

Um componente pode ser passado como está, em um `shallowRef` para trocá-lo (também durante o
arraste: o overlay muda na hora), ou como uma função, que o Vue trata como um componente funcional:
`overlay: (props) => <TicketOverlay {...props} compact />` em TSX. Nunca o coloque em um `ref`
profundo ou em `reactive`: o Vue tornaria o componente reativo e emitiria um aviso.

A raiz de um componente de overlay deve preencher a caixa (`width: 100%; height: 100%`): a caixa
assume o tamanho da posição e o anima no drop. Um tamanho fixo na raiz mantém esse tamanho dentro
da caixa.

## O slot `#overlay` do provider

Para todo arraste sem um componente próprio, o slot do provider renderiza o overlay. Defina-o uma
vez, junto à raiz do seu app, e todas as listas e draggables do app o recebem. Aqui, as notas
ganham um fantasma próprio, e as fotos ficam com o clone:

<example height="26rem" hint="Arraste uma nota, depois uma foto" name="overlay-slot">



</example>

```vue [App.vue]
<DnDProvider>
  <RouterView />
  <template #overlay="{ items, status }">
    <NoteGhost v-if="items[0]?.type.includes('note')" :items="items" :status="status" />
  </template>
</DnDProvider>
```

O slot recebe as mesmas props que um componente de overlay. Quando ele não renderiza nada (o
`v-if` acima), o arraste usa o clone. Diferencie os arrastes pelo `type`: o tipo de um item
ordenável é o nome do grupo dele, a menos que ele defina o seu próprio
(`makeSortableItem(el, { type })`).

## Alvos que mudam o overlay

Um alvo de drop pode dizer o que o overlay mostra enquanto um arraste que ele aceita está sobre
ele. `makeDroppable`, listas e árvores aceitam um `overOverlay` (o `overlay` de uma lista ou
árvore é para os próprios itens). Sobre uma pasta, o chip das mensagens arrastadas vira o
que o drop vai fazer:

<example height="34rem" hint="Marque duas mensagens, arraste uma sobre Archive e solte" name="overlay-folders">



</example>

```ts [Folder.vue]
makeDroppable(el, {
  id: () => props.folder.id,
  data: () => props.folder,
  overOverlay: MovePill,
  onDrop: (event) => emit('move', event.active.ids),
});
```

O componente do alvo recebe as mesmas props que qualquer componente de overlay, `over` entre elas,
e o overlay do próprio arraste (o componente dele, o slot do provider ou o clone) como slot padrão.
`MovePill` deixa o slot de fora, então substitui o chip:

```vue [MovePill.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, Over } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; over: Over | null }>();
// The folder under the drag: its `data`.
const folder = computed(() => props.over?.data as Folder | undefined);
</script>

<template>
  <!-- Fills the box like any overlay component. -->
  <div class="pill-box">
    <span v-if="folder" class="pill">Move {{ items.length }} to {{ folder.name }}</span>
  </div>
</template>
```

Renderize `<slot />` para manter o overlay do próprio arraste e envolvê-lo. É o que Done faz no
quadro de [componentes de overlay](#overlay-components) acima: sobre Done, um ticket aprovado
mantém o próprio overlay, Done o carimba, e um ticket de outra coluna ganha confete quando é solto.

```ts [Column.vue]
makeSortableList(listRef, {
  items: tickets,
  group: { name: 'release', put },
  overlay: TicketOverlay, // the tickets' own, in every column
  overOverlay: strict ? DoneOverlay : undefined, // Done's, around it
});
```

```vue [DoneOverlay.vue]
<template>
  <div class="done">
    <slot /> <!-- TicketOverlay -->
    <span class="stamp">Shipped</span>
    <span v-if="status === 'dropping' && arrives" class="confetti">…</span>
  </div>
</template>
```

- Ele só aparece enquanto o alvo aceita o arraste, e fica enquanto o drop pousa nele. Sair do alvo
traz de volta o overlay do próprio arraste.
- A troca é feita com um crossfade. O `overlayTransition` do provider define como: `false` troca
na hora, um objeto são as props de um `<Transition>` em volta do conteúdo (`name`, `mode`, hooks
JS para GSAP ou motion). Sem `mode: 'out-in'`, os dois aparecem por um momento: dê ao que sai
`position: absolute` em `.<name>-leave-active`.
- O drop espera o confete: as animações e transições CSS que rodam no overlay enquanto ele pousa
tocam até o fim, por no máximo dois segundos.
- Um arraste com `overlay: false` não tem overlay sobre nenhum alvo.

As pastas também fazem a pílula pousar do jeito delas, dentro do ícone da pasta: um alvo também
pode ter um `overDropAnimation`. Veja [animações](https://zizigy.github.io/docs/guides/animations#per-item-and-per-target).

## Onde o drop iria parar: `to`

`to` diz a um overlay onde um drop colocaria os itens agora, como o `to` do evento de drop vai
dizer: a lista e o índice nela, e em uma árvore o pai e a profundidade. Ele muda conforme a posição
se move. Uma página deste menu de site diz em qual seção entraria, e em qual linha:

<example height="27rem" hint="Arraste uma página sobre as seções, depois para os lados para mudar a profundidade dela" name="overlay-move-path">



</example>

```vue [MoveOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, DropDestination } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; to: DropDestination | null }>();
const page = computed(() => props.items[0]!.item as MenuNode);
// `parentKey` is the section the page would go into, `null` at the top level.
const where = computed(() => (props.to ? pathOf(menu.value, props.to.parentKey) : null));
</script>

<template>
  <div class="move">
    <div class="row">{{ page.title }}</div>
    <p v-if="to && where" class="where">Move to <b>{{ where }}</b>, row {{ to.index + 1 }}</p>
  </div>
</template>
```

Fora de qualquer alvo, `to` continua sendo o lugar da posição: por padrão, um drop ali mantém os
itens onde a posição está (`dropOutside: 'placeholder'`). Ele é `null` quando o drop não os
colocaria em nenhuma lista: sobre um alvo simples, sobre uma lista que os recusa, fora com
`dropOutside: 'cancel'` ou `'remove'`.

## O que vence

Para cada arraste, o primeiro que se aplica:

1. O `overOverlay` do alvo de drop (também o de uma lista ou árvore), enquanto o arraste está
sobre ele e ele aceita o arraste. O que apareceria caso contrário é o slot padrão dele.
2. O `overlay` do próprio item (`makeSortableItem`, `makeDraggable`).
3. O `overlay` da lista ou da árvore dele.
4. O slot `#overlay` do provider, a menos que não renderize nada.
5. O clone padrão. Em um multi-drag, uma coluna ou uma pilha de clones: veja
[multi-drag](https://zizigy.github.io/docs/guides/multi-drag#the-default-overlay).

Se um arraste tem overlay ou não (`overlay: false`) é decidido quando ele começa. Qual componente
aparece é lido ao vivo: um ref trocado durante o arraste o troca, e o mesmo acontece ao entrar ou
sair de um alvo com overlay próprio.

## `DragPreview`: o clone no seu layout

`DragPreview` renderiza o clone que a biblioteca fez de um item arrastado. Um componente de
overlay pode dispor vários deles, ou colocar uma moldura em volta de um. Clique em livros para
escolhê-los, depois arraste um: o overlay abre os clones reais em leque.

<example height="24rem" hint="Arraste um dos três livros escolhidos; clique em livros para escolher outros" name="overlay-fan">



</example>

```vue [FanOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import { DragPreview, type DragItem } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[] }>();
const fan = computed(() =>
  props.items.slice(0, 4).map((entry, index) => ({
    entry,
    angle: index === 0 ? 0 : (index % 2 ? -1 : 1) * Math.ceil(index / 2) * 10,
  })),
);
</script>

<template>
  <div class="fan">
    <div v-for="{ entry, angle } in fan" :key="entry.id" class="card" :style="{ transform: `rotate(${angle}deg)` }">
      <DragPreview :id="entry.id" class="face" :style="{ width: '100%', height: '100%' }">
        <div class="blank" /> <!-- an item without a clone -->
      </DragPreview>
    </div>
    <span v-if="items.length > 1" class="count">{{ items.length }}</span>
  </div>
</template>
```

- Existem clones do item pego e dos outros ao lado dele na ordem do drop, tantos quanto o
`overlayPreviews` do provider (5 por padrão, `'all'` para todos), se estiverem renderizados no
momento em que o item é pego. Para qualquer outro item, `DragPreview` renderiza
o seu slot padrão.
- Uma prévia tem o tamanho que o item tinha ao ser pego, definido inline. Dimensione-a com
`style`, que é repassado (uma classe não consegue sobrescrevê-lo), como acima.
- Em um multi-drag ordenável (`multiple: 'group'` ou `'gaps'`), cada prévia pousa na posição do
seu próprio item no drop. Gire os wrappers dela com `transform` (não com a propriedade
`rotate`): o pouso o desfaz no caminho. Coloque o visual do item (cantos, sombra) na própria
prévia, como faz `class="face"`: os wrappers ficam na caixa.

O [guia de multi-drag](https://zizigy.github.io/docs/guides/multi-drag#a-custom-overlay-for-several-items) tem um overlay
que mostra uma contagem e os títulos em vez dos clones.

## Tamanho: `overlayFit`

Sobre uma lista de outros tamanhos, a caixa assume o tamanho da posição em que vai pousar. O
`overlayFit` do provider troca isso; a [página do DnDProvider](https://zizigy.github.io/docs/api/dnd-provider) tem uma demo
com uma lista estreita e uma larga.

<table>
<thead>
  <tr>
    <th>
      <code>
        overlayFit
      </code>
      
       (provider)
    </th>
    
    <th>
      A caixa
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'slot'
      </code>
      
       (padrão)
    </td>
    
    <td>
      Assume o tamanho da posição em que vai pousar, deslizando até ele. Sobre a lista larga, ela se alarga.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'source'
      </code>
    </td>
    
    <td>
      Mantém o tamanho do elemento arrastado.
    </td>
  </tr>
</tbody>
</table>

Com `'slot'`, a caixa muda de tamanho em volta do ponteiro, que fica na mesma fração da caixa. O
conteúdo nunca é escalado: ele se reorganiza no novo tamanho, então uma fileira flex como as
tarefas daquela demo fica certa em qualquer largura. Uma posição estilizada muito menor que o item, como
uma linha fina, não encolhe a caixa nesse eixo.

Um drop faz o mesmo com qualquer configuração: a caixa voa até o elemento em que pousa e anima
até o tamanho **dele**, e o conteúdo se reorganiza no caminho. Quando um item tem visuais
diferentes em duas listas (um chip compacto em uma paleta, um card completo em um quadro), o
clone da origem se reorganiza no tamanho do destino, e pode parecer espremido ou esticado ali.
Dois jeitos de manter isso certo:

- Dê ao item um **layout que funcione nos dois tamanhos**, como as linhas de tarefa, ou o mesmo
tamanho em todas as listas em que ele pode pousar.
- Renderize o **visual do destino** em um componente de overlay. Ele recebe `over`, então pode
trocar para o visual da lista sobre a qual está, e preenche a caixa em qualquer tamanho.

## Onde ele é renderizado: `overlayTo`

O provider teleporta o overlay para o `body`. Um `<dialog>` modal (aberto com `showModal()`) fica
na top layer, acima de tudo no `body`, então um overlay ali ficaria escondido embaixo dele. Aponte
`overlayTo` para um seletor ou um elemento dentro do dialog. A
[página do DnDProvider](https://zizigy.github.io/docs/api/dnd-provider#where-the-overlay-renders) tem um dialog para testar
com e sem isso:

```vue [index.vue]
<script setup lang="ts">
const dialog = useTemplateRef<HTMLDialogElement>('dialog');
const open = ref(false);
// While the dialog is open, the overlay renders inside it.
const overlayTo = computed(() => (open.value ? '#columns-dialog' : 'body'));

const show = () => {
  dialog.value?.showModal();
  open.value = true;
};
</script>

<template>
  <DnDProvider :overlay-to="overlayTo">
    <button type="button" @click="show">Edit columns</button>
    <dialog id="columns-dialog" ref="dialog" @close="open = false">
      <ColumnList v-model:columns="columns" />
    </dialog>
  </DnDProvider>
</template>
```

- O destino precisa estar na página quando o provider renderiza o overlay, depois de montado. Um
`<dialog>` fechado está: ele só fica escondido. Volte para `body` enquanto ele está fechado,
para que o overlay dos outros arrastes apareça.
- A caixa é `position: fixed`. Um `transform`, `filter` ou `contain` no destino ou nos ancestrais
dele faz desse elemento a referência da caixa em vez da viewport, então deixe-os fora do dialog.
- Os estilos do clone são computados para onde ele é mostrado: em uma shadow root, aponte
`overlayTo` para dentro dela, e o clone mantém os estilos da shadow root.

## Sem overlay

`makeDraggable(el, { overlay: false })` não tem caixa nenhuma: o próprio elemento se move, pelo
`transform` retornado.

```ts
const { transform } = makeDraggable(el, { overlay: false });
const style = computed(() =>
  transform.value ? { translate: `${transform.value.x}px ${transform.value.y}px` } : undefined,
);
```

Veja [arrastar e soltar](https://zizigy.github.io/docs/guides/drag-and-drop#without-an-overlay). Como um arraste com
caixa pousa é definido pelo `dropAnimation` dele: o do alvo de drop (`overDropAnimation`), o do item (ou o da lista
dele) ou o do provider. Veja [animações](https://zizigy.github.io/docs/guides/animations#the-drop).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
