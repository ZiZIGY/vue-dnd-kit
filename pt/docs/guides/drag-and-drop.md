---
title: "Arrastar e soltar"
description: "Arraste livre com makeDraggable e alvos de drop com makeDroppable — alvos tipados que aceitam alguns arrastes e recusam outros, uma planta baixa, lixeiras, pastas dentro de uma lista e itens simples que uma lista recebe."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/guides/drag-and-drop"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Use `makeDraggable` e `makeDroppable` para tudo o que não é uma lista ordenável: lixo nas
lixeiras, móveis em uma planta baixa, arquivos em pastas, uma lixeira, um tabuleiro de xadrez.

<example height="29rem" hint="Separe o lixo nas lixeiras; nenhuma lixeira aceita a pilha" name="recycling">



</example>

## Um draggable

```vue [WasteItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ waste: { id: string; name: string; type: string } }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  id: () => props.waste.id,      // read back as `active.id`
  type: () => props.waste.type,  // matched by the targets' `accept`
  data: () => props.waste,       // anything: `active.data`
});
</script>

<template>
  <div ref="el" :class="{ dragging: isDragging }">{{ waste.name }}</div>
</template>
```

Passe o id dos seus dados, como um getter. O id padrão vem do `useId()` e é novo a cada
instância do componente, então não significa nada para o resto do seu app. As opções são lidas
quando são necessárias, então um getter ou um ref as mantém atualizadas.

<table>
<thead>
  <tr>
    <th>
      Opção
    </th>
    
    <th>
      O que faz
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        id
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        type
      </code>
    </td>
    
    <td>
      Quem é arrastado, o que ele carrega e o que o <code>
        accept
      </code>
      
       dos alvos compara.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        handle
      </code>
    </td>
    
    <td>
      Um seletor ou um elemento dentro dele: só ele inicia um arraste. Veja <a href="/docs/guides/sortable-lists#handles">
        handles
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      Nenhum arraste começa.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlay
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       (padrão): uma cópia segue o ponteiro. Um componente: a sua própria prévia. <code>
        false
      </code>
      
      : o próprio elemento se move (<a href="#without-an-overlay">
        abaixo
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        axis
      </code>
      
      , <code>
        modifiers
      </code>
    </td>
    
    <td>
      Travar o arraste em <code>
        'x'
      </code>
      
       ou <code>
        'y'
      </code>
      
      , encaixá-lo, mantê-lo dentro de limites: veja <a href="/docs/guides/constraints">
        restrições
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboardMode
      </code>
    </td>
    
    <td>
      Como as setas o movem: por pixels (padrão) ou de alvo em alvo (<a href="#keyboard">
        abaixo
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
      
      , <code>
        canDrag
      </code>
    </td>
    
    <td>
      Quando uma pressão vira arraste: veja <a href="/docs/guides/sensors">
        sensores
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        attributes
      </code>
    </td>
    
    <td>
      <code>
        role
      </code>
      
      , <code>
        tabindex
      </code>
      
       e <code>
        aria-*
      </code>
      
       para teclados e leitores de tela (padrão <code>
        true
      </code>
      
      ).
    </td>
  </tr>
</tbody>
</table>

<table>
<thead>
  <tr>
    <th>
      Retorna
    </th>
    
    <th>
      O que é
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        isDragging
      </code>
    </td>
    
    <td>
      Este elemento está sendo arrastado.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selected
      </code>
    </td>
    
    <td>
      Gravável, ligado à <a href="/docs/guides/multi-drag">
        seleção
      </a>
      
       do provider.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        transform
      </code>
    </td>
    
    <td>
      O deslocamento do arraste, para <code>
        overlay: false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        id
      </code>
    </td>
    
    <td>
      O id em uso.
    </td>
  </tr>
</tbody>
</table>

Botões, inputs e outros filhos interativos não iniciam um arraste por ponteiro, então continuam
funcionando dentro de um draggable. Todas as opções estão na [API do makeDraggable](https://zizigy.github.io/docs/api/make-draggable).

## Um alvo de drop

```vue [Bin.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable, type Key } from '@vue-dnd-kit/core';
import type { Bin, Waste } from './waste';

const props = defineProps<{ bin: Bin; items: Waste[] }>();
const emit = defineEmits<{ drop: [id: Key] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isOver, isAccepting } = makeDroppable(el, {
  id: props.bin.id,
  accept: props.bin.accept,   // 'glass', ['paper', 'cardboard'], a function…
  onDrop: (event) => emit('drop', event.active.id),
});
</script>

<template>
  <section ref="el" :class="{ accepting: isAccepting, over: isOver && isAccepting, refused: isOver && !isAccepting }">
    <WasteItem v-for="waste in items" :key="waste.id" :waste="waste" />
  </section>
</template>
```

<table>
<thead>
  <tr>
    <th>
      Retorna
    </th>
    
    <th>
      <code>
        true
      </code>
      
       quando
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        isOver
      </code>
    </td>
    
    <td>
      O arraste está sobre este alvo, aceitando ou não o arraste.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isAccepting
      </code>
    </td>
    
    <td>
      Algo está sendo arrastado e este alvo o aceita: destaque os alvos válidos.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        placement
      </code>
    </td>
    
    <td>
      Não é um booleano: <code>
        { top, right, bottom, left }
      </code>
      
      , as metades do alvo em que o ponteiro está, ou <code>
        null
      </code>
      
       quando ele não está sobre o alvo. Use para "antes / depois deste card".
    </td>
  </tr>
</tbody>
</table>

`isOver` sem `isAccepting` significa que o arraste está sobre um alvo que o recusa. Mostre isso,
como as lixeiras acima fazem: um drop ali é cancelado e o item volta ao lugar. As lixeiras que
não podem aceitar o item esmaecem enquanto ele viaja; mais visuais em
[estilização](https://zizigy.github.io/docs/guides/styling#drop-targets-yes-and-no).

<table>
<thead>
  <tr>
    <th>
      Opção
    </th>
    
    <th>
      O que faz
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        id
      </code>
      
      , <code>
        data
      </code>
    </td>
    
    <td>
      Lidos de volta como <code>
        over.id
      </code>
      
       e <code>
        over.data
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        accept
      </code>
      
      , <code>
        acceptMode
      </code>
    </td>
    
    <td>
      Quais arrastes ele aceita (<a href="#which-drags-a-target-takes">
        próxima seção
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      Não aceita nada, e os arrastes passam por cima dele.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        priority
      </code>
    </td>
    
    <td>
      O maior vence quando alvos se sobrepõem sem aninhamento (padrão 0).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
    </td>
    
    <td>
      O arraste entrou ou saiu.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
      
      , <code>
        onDrop
      </code>
    </td>
    
    <td>
      Decidir o drop, depois aplicá-lo (<a href="#the-drop">
        abaixo
      </a>
      
      ).
    </td>
  </tr>
</tbody>
</table>

## Quais arrastes um alvo aceita

O `type` de um draggable é comparado com o `accept` de um alvo:

<table>
<thead>
  <tr>
    <th>
      <code>
        accept
      </code>
    </th>
    
    <th>
      Aceita
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      omitido ou <code>
        '*'
      </code>
    </td>
    
    <td>
      Tudo.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'glass'
      </code>
    </td>
    
    <td>
      Draggables do tipo <code>
        glass
      </code>
      
      , e os sem tipo.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ['paper', 'cardboard']
      </code>
    </td>
    
    <td>
      Qualquer um dos dois tipos, e os sem tipo.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ({ active, items, types }) => boolean
      </code>
    </td>
    
    <td>
      O que a sua função disser.
    </td>
  </tr>
</tbody>
</table>

Um draggable sem `type` se encaixa em qualquer regra de string. `type` também pode ser um array
(`['paper', 'large']`): basta um tipo combinar. Uma função decide com base em qualquer coisa do
arraste. A lixeira de compostagem acima lê os dados dos itens, não o tipo deles:

```ts [waste.ts]
{
  id: 'compost',
  accept: ({ items }) => items.every((item) => (item.data as Waste).compostable),
}
```

`accept` é lido ao vivo, enquanto o arraste procura o seu alvo: passe um ref para mudá-lo.

Quando vários itens são arrastados de uma vez, `acceptMode` diz quantos precisam se encaixar:
`'all'` (padrão) ou `'some'`. Com `'some'`, retorne do `onBeforeDrop` os ids que ficam, e os
outros voltam ao lugar. Veja [decidindo um drop](https://zizigy.github.io/docs/guides/drop-decisions).

## O drop

O `onDrop` de um alvo de drop simples é onde **você** muda os seus dados. A biblioteca não move
nada por conta própria:

```vue [index.vue]
<script setup lang="ts">
/** Where each item is: the tray or a bin. */
const place = reactive<Record<string, string>>(Object.fromEntries(WASTE.map((waste) => [waste.id, 'tray'])));
const itemsIn = (bin: string) => WASTE.filter((waste) => place[waste.id] === bin);
const drop = (bin: string, id: Key) => (place[String(id)] = bin);
</script>

<template>
  <Bin v-for="bin in BINS" :key="bin.id" :bin="bin" :items="itemsIn(bin.id)" @drop="drop(bin.id, $event)" />
</template>
```

<table>
<thead>
  <tr>
    <th>
      Campo do evento
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
      O arraste: <code>
        id
      </code>
      
      , <code>
        ids
      </code>
      
      , <code>
        items
      </code>
      
       (cada um <code>
        { id, data, type, item }
      </code>
      
      ), <code>
        data
      </code>
      
      , <code>
        type
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
    </td>
    
    <td>
      Este alvo: <code>
        id
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        element
      </code>
      
      , <code>
        rect
      </code>
      
      , <code>
        accepted
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointer
      </code>
      
      , <code>
        delta
      </code>
    </td>
    
    <td>
      Onde o ponteiro está, e quanto ele se moveu desde o início.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        position
      </code>
    </td>
    
    <td>
      Onde a caixa arrastada fica dentro deste alvo (<a href="#leave-it-where-it-was-dropped">
        próxima seção
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        source
      </code>
    </td>
    
    <td>
      Definido quando os itens vêm de uma lista ordenável: <code>
        { list, remove() }
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

`active.ids` contém todos os ids arrastados, o pego primeiro. A ordem é `onBeforeDrop`
(decidir), `onDrop` (aplicar), depois o `drag-end` do provider. Para ouvir todo arraste da página
em um só lugar, use `useDnDMonitor` (veja [o provider](https://zizigy.github.io/docs/guides/provider)). Para perguntar
antes de um drop, manter o arraste em andamento ou aceitar só alguns itens, veja
[decidindo um drop](https://zizigy.github.io/docs/guides/drop-decisions).

## Deixar onde foi solto

Uma planta baixa, um canvas, um quadro: o item fica onde você o solta. Todo evento traz
`position`, o `left` / `top` que coloca um item com posicionamento absoluto onde ele foi solto.

<example height="28rem" hint="Arraste móveis para dentro do cômodo, mova-os ou devolva-os" name="room-planner">



</example>

```ts [Planner.vue]
const room = useTemplateRef<HTMLElement>('room');
makeDroppable(room, {
  id: 'room',
  onDrop: ({ active, position }) => {
    const piece = find(active.id);
    if (!piece || !position || !room.value) return;
    // Clamped, so a piece let go half outside stays inside the walls.
    piece.x = clamp(position.x, room.value.clientWidth - piece.width);
    piece.y = clamp(position.y, room.value.clientHeight - piece.height);
    piece.place = 'room';
  },
});
```

```vue [Piece.vue]
<div ref="el" class="piece" :style="{ left: `${piece.x}px`, top: `${piece.y}px` }">…</div>
```

`position` é o canto superior esquerdo da caixa arrastada em `over`, medido a partir da borda do
padding dele, com a rolagem somada: a borda do cômodo, as paredes, não conta. É `null` sobre nada.

<tip>

Não calcule o lugar a partir de `active.rect` e `delta`: isso ignora a borda e a rolagem do alvo.
Grades, limites e travas de eixo para esses quadros estão em
[restrições](https://zizigy.github.io/docs/guides/constraints).

</tip>

## Sem overlay

Por padrão, uma cópia do elemento segue o ponteiro, e o elemento fica no lugar: os móveis no
depósito funcionam assim. Com `overlay: false` não há cópia, e o próprio elemento se move pelo
`transform` que o arraste retorna: os móveis no cômodo.

```ts [Piece.vue]
const inRoom = computed(() => props.piece.place === 'room');
const { isDragging, transform } = makeDraggable(el, {
  id: () => props.piece.id,
  overlay: computed(() => !inRoom.value),   // a value or a ref, read when the drag starts
});

const style = computed(() => ({
  left: `${props.piece.x}px`,
  top: `${props.piece.y}px`,
  ...(transform.value && { transform: `translate3d(${transform.value.x}px, ${transform.value.y}px, 0)` }),
}));
```

- `position` passa a ser o canto do próprio elemento, então o handler do drop continua o mesmo.
- O elemento fica sob o ponteiro enquanto se move; ao procurar o alvo, a biblioteca olha através
dele. Coloque-o acima dos vizinhos enquanto ele é arrastado (`z-index`).
- Ele rola com a página, o overlay não: `transform` desconta o quanto o contêiner dele se moveu
desde o início do arraste, então ele continua sob o ponteiro quando a página rola.
- Ele se move dentro do seu próprio contêiner: um pai com `overflow: hidden` o recorta, e o
contexto de empilhamento dele decide sobre o que ele passa. O overlay não tem nenhum dos dois
problemas.

Para uma prévia personalizada em vez da cópia, veja [o overlay](https://zizigy.github.io/docs/guides/overlay).

## Lixeiras

Um arraste que começa em uma lista ordenável traz `e.source`. Chame `remove()` e a lista
descarta os itens:

<example height="34rem" hint="Arraste uma notificação para Done ou Delete, depois desfaça" name="triage">



</example>

```ts [Triage.vue]
const triage = (bin: 'done' | 'deleted') => (e: DnDEvent) => {
  bins[bin].push(...e.active.items.map((entry) => entry.item as Notice));
  e.source?.remove();
};

makeDroppable(doneZone, { id: 'done', onDrop: triage('done') });
makeDroppable(trashZone, { id: 'trash', onDrop: triage('deleted') });
```

- `e.active.items[i].item` é o próprio item da lista. Guarde-o, e um desfazer o coloca de volta
onde estava.
- O `onDrop` da própria lista então roda com `to.index === -1`, e `e.result` contém a lista sem
os itens.
- O overlay encolhe dentro da zona, já que o item não aparece mais em lugar nenhum.
- Uma lista também pode remover o que é solto fora de tudo: veja
[`dropOutside`](https://zizigy.github.io/docs/guides/shared-lists#dropping-outside).

<note>

Com o teclado, as setas movem o item de uma lista entre as posições da lista e das listas do seu
grupo; depois do fim das listas, a próxima tecla o leva ao alvo de drop naquela direção, aqui a
lixeira, e a seta oposta o traz de volta. Um botão, um menu ou a tecla `Delete` ainda é mais rápido para muita gente: ofereça um
também.

</note>

## Drop dentro de um item ordenável

Uma linha de uma lista ordenável também pode ser um alvo de drop: uma pasta que aceita favoritos,
um grupo que aceita tarefas. Coloque um droppable no elemento do item:

<example height="28rem" hint="Solte um link no meio de uma pasta; perto das bordas ele ordena. Abra uma pasta para arrastar links para fora" name="bookmarks">



</example>

```ts [FolderRow.vue]
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.folder, type: 'folder' });

const { isOver } = makeDroppable(el, {
  accept: 'link',
  onDrop: (e) => {
    emit('add', e.active.items.map((entry) => entry.item as Link)); // Bookmarks adds them
    e.source?.remove();   // take them out of the list they came from
  },
});
```

Uma pasta aberta mostra os seus links como uma lista do mesmo grupo, que só aceita links: ali eles
são ordenados, e podem ser arrastados de volta para o nível de cima ou para outra pasta.

Enquanto a lista ordenaria o arraste, um alvo assim só conta no **meio** do seu item (de 25 a
75% ao longo do eixo da lista). Ali o drop vai para dentro do item, e a lista não se mexe. Perto
das bordas, a lista ordena como sempre.

- Um alvo cujo `accept` recusa o arraste é pulado: a lista ordena sobre o item como sobre
qualquer outro. As pastas só aceitam links, então uma pasta arrastada passa direto pelas outras.
- Um alvo nunca recebe o seu próprio arraste.
- Com o teclado, uma seta para primeiro na pasta; o próximo toque na mesma direção passa por ela.
- O item não aparece mais depois do drop, então o overlay encolhe dentro da pasta em vez de
voltar ao lugar.
- Sobre a pasta, a lista mantém a posição da linha arrastada onde estava, para que nada se
desloque sob o ponteiro. A posição recebe então `data-dnd-placeholder="into"`: o drop não vai
para lá, então esconda-a se quiser (`[data-dnd-placeholder='into'] { opacity: 0 }`).

O [gerenciador de arquivos](https://zizigy.github.io/docs/examples/file-manager) faz o mesmo em uma grade, com pastas
aninhadas.

## Draggables simples em uma lista

Uma lista ordenável recebe itens arrastados com `makeDraggable` quando sabe criar um item a
partir deles:

<example height="26rem" hint="Arraste um bloco para a agenda; os horários acompanham o arraste" name="day-planner">



</example>

```ts [Agenda.vue]
const { items } = makeSortableList(list, {
  items: agenda,
  createItem: (active) => ({ ...(active.data as Block), id: `entry-${++created}` }),
});
```

Enquanto o draggable está sobre a lista, o item criado fica no rascunho e é renderizado pelo seu
template como qualquer outra linha: os horários da agenda já o contam. Ele se torna real no drop
(`mode: 'insert'`, `from.list === null`), e o overlay pousa nele.

- Retorne `undefined` para recusar. Listas sem `createItem` ignoram draggables simples.
- Dê ao novo item uma key própria: o bloco continua na paleta.
- Com o teclado, uma seta em direção à lista traz o draggable para dentro, na altura dele, e as
próximas setas o movem de posição em posição.

## Arquivos do computador

Arquivos arrastados da área de trabalho ou de um gerenciador de arquivos não são arrastes da
biblioteca: quem os carrega é o navegador. Um alvo de drop os aceita com `external`, e o drop os
entrega em `e.external`:

<example height="22rem" hint="Arraste arquivos de imagem ou PDF do seu computador para as zonas" name="file-drop">



</example>

```ts [AvatarDrop.vue]
const { isOver, isAccepting } = makeDroppable(el, {
  external: { files: 'image/*', multiple: false },
  onDrop: (e) => show(e.external!.files[0]!),
});
```

- `files` funciona como `<input accept>`: tipos MIME (`image/*`, `application/pdf`) e
extensões (`.md`). `true` aceita qualquer arquivo, uma função decide arquivo por arquivo.
`links` e `text` aceitam o que outros apps e abas arrastam, `types` qualquer outro tipo MIME.
- O arraste roda como um arraste do provider: `isOver`, `isAccepting`, os eventos e os anúncios
funcionam como em qualquer outro. Alvos sem `external` o ignoram. Não há overlay: o navegador
desenha a imagem arrastada.
- Enquanto os arquivos estão sobre a página, o navegador informa só os seus tipos
(`e.external.fileTypes`). Os nomes, tamanhos e conteúdos chegam com o drop, e as extensões são
verificadas nesse momento. Pastas ficam de fora; com `multiple: false`, um arraste de vários
arquivos é recusado.

Listas também aceitam arquivos, links e texto, e abrem espaço para eles enquanto o arraste
continua. Os itens também podem sair da página, para outro app ou outra janela do seu app: veja
[arquivos e outros apps](https://zizigy.github.io/docs/guides/native).

<tip>

Quem usa teclado e leitor de tela não consegue arrastar arquivos. Ofereça um
`<input type="file">` ao lado da zona, como a demo faz com Browse.

</tip>

## Teclado

Um draggable em foco é pego com <kbd value="Space">



</kbd>

 ou <kbd value="Enter">



</kbd>

, solto com as mesmas
teclas, e <kbd value="Escape">



</kbd>

 cancela. Entre uma coisa e outra, as setas o movem:

<table>
<thead>
  <tr>
    <th>
      <code>
        keyboardMode
      </code>
    </th>
    
    <th>
      Uma seta
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'pixels'
      </code>
      
       (padrão)
    </td>
    
    <td>
      Move 25 px, o <code>
        keyboard.step
      </code>
      
       do provider. Com <kbd value="Shift">
        
      </kbd>
      
      , quatro vezes mais. Os móveis se movem assim.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'droppables'
      </code>
    </td>
    
    <td>
      Pula para o alvo mais próximo naquela direção que o aceita. O lixo pula de lixeira em lixeira, e pula as lixeiras que o recusam.
    </td>
  </tr>
</tbody>
</table>

```ts
makeDraggable(el, { id: () => props.waste.id, type: () => props.waste.type, keyboardMode: 'droppables' });
```

As teclas podem ser redefinidas no provider. Mais em [acessibilidade](https://zizigy.github.io/docs/guides/accessibility).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
