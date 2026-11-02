---
title: "Acessibilidade"
description: "Arrastes por teclado, anúncios para leitores de tela e atributos ARIA vêm embutidos. Aqui está o que eles fazem, como escrevê-los em qualquer idioma e como oferecer movimentos sem arrastar."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/guides/accessibility"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Tudo nesta página vem ligado por padrão. Chegue a um item da agenda com Tab, pressione
<kbd value="Space">



</kbd>

, mova-o com as setas e pressione <kbd value="Space">



</kbd>

 de novo, ou
<kbd value="Escape">



</kbd>

 para devolvê-lo. O painel mostra o que é dito a um leitor de tela, no idioma
que você escolher.

<example height="28.5rem" hint="Chegue a um item com Tab: Espaço, setas, Espaço. Troque o idioma" name="a11y-announcer">



</example>

O que normalmente fica por sua conta: textos legíveis para os itens, e botões que os movem para
quem não consegue arrastar.

## O teclado

<table>
<thead>
  <tr>
    <th>
      Tecla
    </th>
    
    <th>
      Ação
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <kbd value="Space">
        
      </kbd>
      
       / <kbd value="Enter">
        
      </kbd>
    </td>
    
    <td>
      Pegar o item em foco; soltá-lo.
    </td>
  </tr>
  
  <tr>
    <td>
      Setas
    </td>
    
    <td>
      Movê-lo: de posição em posição em listas, por linhas e profundidade em árvores, <code>
        keyboard.step
      </code>
      
       pixels em arrastes livres.
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="Escape">
        
      </kbd>
    </td>
    
    <td>
      Cancelar o arraste — arrastes por ponteiro também.
    </td>
  </tr>
</tbody>
</table>

- Em uma lista, uma seta em direção a outra lista do mesmo grupo move o item para lá.
- Em um arraste livre, <kbd value="Shift">



</kbd>

 aumenta os passos. `makeDraggable(el, { keyboard: 'droppables' })`
faz as setas pularem entre os alvos que aceitam o item.
- Um arraste por teclado começa a partir do draggable em foco, ou do handle dele — nunca a partir
de um botão ou de um campo dentro dele, então esses mantêm as suas próprias teclas.
- Arrastes por teclado rolam o item até ficar visível em vez de usar a rolagem automática nas
bordas.
- Depois do drop, o foco volta para o item, mesmo quando a linha dele foi renderizada de novo em
outra lista.

### Outras teclas

```vue
<DnDProvider :keyboard="{ keys: { start: ['KeyD'], drop: ['KeyD', 'Enter'], cancel: ['Escape'] }, step: 10 }">
```

As associações comparam `event.code` (`'Space'`, `'KeyD'`) ou `event.key` (`'Enter'`). `step` é
quantos pixels cada seta move em arrastes livres (25 por padrão). `:keyboard="false"` desliga os
arrastes por teclado, e <kbd value="Escape">



</kbd>

 ainda cancela qualquer arraste. Quando você mudar as
teclas, mude também as `screen-reader-instructions`.

## Atributos ARIA

Foque cada atalho, ou desligue os atributos, e veja o que a biblioteca define. Arraste um para
ver o `aria-pressed` aparecer e sumir no botão.

<example height="27rem" hint="Percorra os atalhos com Tab; ligue e desligue os atributos" name="a11y-attributes">



</example>

Todo draggable e todo item ordenável recebe estes, **a menos que você mesmo os defina**:

<table>
<thead>
  <tr>
    <th>
      Atributo
    </th>
    
    <th>
      Valor
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        tabindex
      </code>
    </td>
    
    <td>
      <code>
        0
      </code>
      
      , quando o elemento ainda não é focável (um <code>
        <div>
      </code>
      
      ; não um <code>
        <a href>
      </code>
      
       ou um <code>
        <button>
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        role
      </code>
    </td>
    
    <td>
      <code>
        button
      </code>
      
      , exceto em um <code>
        <button>
      </code>
      
      , que já é um.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-roledescription
      </code>
    </td>
    
    <td>
      <code>
        draggable
      </code>
      
      , ou <code>
        sortable
      </code>
      
       em itens ordenáveis.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-describedby
      </code>
    </td>
    
    <td>
      As instruções do provider, adicionadas ao lado dos ids que já estão ali (o de um tooltip sobrevive).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-disabled
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       ou <code>
        false
      </code>
      
      : se o item está desativado (também por uma área de arraste desativada).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-pressed
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       enquanto ele é arrastado, em elementos com o papel <code>
        button
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

`attributes: false` em um item remove, ao vivo, o que a biblioteca tinha definido. O painel lê os
atributos de volta: `aria-describedby` aponta para as instruções do provider, que um leitor de
tela lê depois do nome do item.

### Links e botões que são arrastados

`aria-roledescription` substitui o nome do papel: um leitor de tela diz "Inbox, sortable" em vez
de "Inbox, button". Para um elemento cujo papel importa, defina o seu próprio; a biblioteca não
mexe nele:

```vue [Shortcut.vue]
<script setup lang="ts">
makeSortableItem(el, {
  item: () => props.shortcut,
  // Enter follows the link: only Space picks it up.
  canDrag: (event) => !('key' in event && event.key === 'Enter'),
});
</script>

<template>
  <a ref="el" :href="shortcut.href" role="link" aria-roledescription="draggable link">
    {{ shortcut.title }}
  </a>
</template>
```

- Um link continua funcionando: um clique o abre, mas o clique que termina um arraste nunca chega
a ele. <kbd value="Enter">



</kbd>

 iniciaria um arraste, então `canDrag` recusa isso e o navegador segue
o link.
- Um `<button>` também mantém o seu clique, e a biblioteca não adiciona nem `role` nem `tabindex`.
- Botões, links e campos **dentro** de um item não iniciam arrastes por ponteiro, então uma linha
pode ter as suas próprias ações.

### Handles: faça deles botões de verdade

```vue [Track.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ track: { id: string; title: string } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.track, handle: '.grip' });
</script>

<template>
  <li ref="el" class="track">
    {{ track.title }}
    <button type="button" class="grip" :aria-label="`Drag ${track.title}`">⠿</button>
  </li>
</template>
```

Com um `handle`, os atributos vão para o handle, e os arrastes por teclado começam por ele (o
atalho **Archive** acima). Um `<button>` já é focável e já é um botão, então não precisa de
`tabindex` nem de `role`. Dê a ele um `aria-label`: um ícone de alça não tem nome próprio, e "Drag
Midnight Drive" diz mais que "button".

<tip>

O handle mantém o foco durante todo o arraste por teclado, enquanto a linha dele é a posição.
Esvazie a posição com `opacity: 0` em vez de `visibility: hidden` ou `display: none` no handle: um
elemento escondido perde o foco. A biblioteca o devolve depois do drop, mas um leitor de tela pode
dizer "body" no meio do caminho.

</tip>

## Anúncios

Uma live region no provider anuncia cada início de arraste, movimento, drop e cancelamento. As
listas ordenáveis dizem onde o item está: *"Picked up item t2 at position 2 of 5 in list
playlist."* Os movimentos são anunciados depois que o arraste fica parado por 500 ms, para que um
arraste rápido por ponteiro não seja lido posição por posição. O painel da demo registra cada texto
que o provider recebe, incluindo os movimentos pelos quais um arraste por ponteiro passa no
caminho.

Os textos embutidos estão em inglês e chamam as coisas pelos ids delas, a não ser que você dê a
elas um `label`. Itens, listas, árvores e alvos de drop aceitam um:

```ts
makeSortableList(list, { items: tracks, label: 'Playlist' });
makeSortableItem(el, { item: () => props.track, label: () => props.track.title });
makeDroppable(bin, { label: 'Trash', onDrop });
```

*"Picked up Blue in Green at position 2 of 5 in Playlist."* Os labels também chegam aos seus
próprios textos e monitores: `active.label`, `over.label`, cada um de `active.items`, e no context
`position.label` e `partner.label`.

Para outro idioma, ou outras palavras, escreva os textos você mesmo, como faz a agenda. Cada texto
recebe o evento e um `context`: a `position` que o texto embutido falaria (`list`, `index` a partir
de 0, `length`, o `label` da lista), e `count`, `copy` e o `partner` de uma troca.

```ts [index.vue]
const titleOf = (id: Key) => agenda.value.find((item) => item.id === id)?.title ?? String(id);

const announcements = computed<Partial<Announcements>>(() => {
  const t = LANGUAGES[lang.value]!;
  return {
    onDragStart: ({ active }, { position }) => position && t.start(titleOf(active.id), position.index + 1, position.length),
    onDragOver: ({ active }, { position }) => position && t.move(titleOf(active.id), position.index + 1, position.length),
    onDragEnd: ({ active }, { position }) => position && t.drop(titleOf(active.id), position.index + 1, position.length),
    onDragCancel: ({ active }, { position }) => position && t.cancel(titleOf(active.id), position.index + 1),
    onDragResume: ({ active }) => t.resume(titleOf(active.id)),
  };
});
```

```vue [index.vue]
<DnDProvider :announcements="announcements" :screen-reader-instructions="texts.instructions">
```

<table>
<thead>
  <tr>
    <th>
      <code>
        context
      </code>
    </th>
    
    <th>
      No início
    </th>
    
    <th>
      Durante o movimento
    </th>
    
    <th>
      No fim
    </th>
    
    <th>
      No cancelamento
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        position
      </code>
    </td>
    
    <td>
      Onde foi pego
    </td>
    
    <td>
      Onde pousaria; nenhuma fora das listas
    </td>
    
    <td>
      Onde pousou
    </td>
    
    <td>
      Para onde voltou
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        partner
      </code>
    </td>
    
    <td>
      
    </td>
    
    <td>
      Uma troca: o item trocado, e onde ele está agora
    </td>
    
    <td>
      O mesmo, depois do drop
    </td>
    
    <td>
      
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        count
      </code>
      
      , <code>
        copy
      </code>
    </td>
    
    <td>
      Quantos itens, e se o arraste copia
    </td>
    
    <td>
      
    </td>
    
    <td>
      
    </td>
    
    <td>
      
    </td>
  </tr>
</tbody>
</table>

<table>
<thead>
  <tr>
    <th>
      Evento
    </th>
    
    <th>
      Anunciado quando
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        onDragStart
      </code>
    </td>
    
    <td>
      O item é pego.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragOver
      </code>
    </td>
    
    <td>
      O item vai para outro lugar (uma posição de uma lista, outro alvo), depois que o arraste fica parado por 500 ms.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragEnd
      </code>
    </td>
    
    <td>
      Ele é solto. A nova ordem já está gravada.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragCancel
      </code>
    </td>
    
    <td>
      O arraste é cancelado, ou o drop recusado: o item voltou.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragResume
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       respondeu <code>
        'continue'
      </code>
      
      : o arraste continua (veja <a href="/docs/guides/drop-decisions">
        decidindo um drop
      </a>
      
      ).
    </td>
  </tr>
</tbody>
</table>

- Um texto substitui o anúncio do evento; `undefined` mantém o padrão; `''` não diz nada. Os
eventos que você omite mantêm os padrões, como as posições das listas ordenáveis.
- `screenReaderInstructions` é o texto que todo draggable aponta com `aria-describedby`. As duas
props são reativas: a demo troca o idioma ao vivo.
- `:announcements="false"` silencia a região, por exemplo quando você anuncia pela sua própria.

<note>

Para outro idioma, forneça os cinco textos e as instruções: cada um que você omitir é falado em
inglês, incluindo as posições das listas ordenáveis. Defina também o `lang` da página, para que o
leitor de tela escolha a voz certa.

</note>

## Mover sem arrastar

Algumas pessoas não conseguem arrastar. A WCAG 2.5.7 pede uma forma de mover itens com cliques
simples. Use as setas e o visto de cada linha: eles movem os livros sem arrastar, e o foco fica
onde você está.

<example height="27.5rem" hint="Use os botões de seta com o teclado, ou arraste uma alça" name="a11y-move-buttons">



</example>

Um botão muda os dados; a lista desenha o movimento. Com `animate` na lista, as linhas deslizam
como em um arraste (e ficam paradas para quem pede movimento reduzido):

```ts [ReadingList.vue]
const { items } = makeSortableList(list, { id: 'reading', items: books, animate: true });

// Buttons change the data, not a drag: the provider says nothing, so this region does.
const message = ref('');

const move = (from: number, to: number) => {
  const next = [...books.value];
  const [book] = next.splice(from, 1);
  next.splice(to, 0, book!);
  books.value = next;
  message.value = `${book!.title} moved to position ${to + 1} of ${next.length}.`;
};
```

```vue [ReadingList.vue]
<p class="status" role="status">{{ message }}</p>
```

### Manter o foco

Mover um elemento no DOM tira o foco dele, então o botão que acabou de ser pressionado o perde.
Devolva o foco depois que a linha se moveu:

```ts [BookRow.vue]
const move = async (direction: 'up' | 'down') => {
  emit('move', direction === 'up' ? props.index - 1 : props.index + 1);
  await nextTick();
  // Back on the same button, or on the other one when this one is now disabled.
  const same = direction === 'up' ? up.value : down.value;
  const other = direction === 'up' ? down.value : up.value;
  (same?.disabled ? other : same)?.focus();
};
```

Uma linha que sai (o visto marca um livro como lido) leva o foco junto: mova-o para a próxima
linha, ou para a última. Os arrastes não precisam de nada disso: a biblioteca devolve o foco ao
próprio item solto, mesmo quando ele é renderizado de novo em outra lista.

<tip>

`@vue-dnd-kit/actions` transforma cada botão em um arraste por teclado de verdade:
`moveItem(id, { index })` é anunciado, passa por `onBeforeDrop` e `onDrop`, é animado e mantém o
foco no item. Veja [arrastes programáticos](https://zizigy.github.io/docs/guides/sensors#programmatic-drags).

</tip>

## Toque

Arrastes por toque começam depois de um toque longo de 200 ms. Mover mais de 5 px antes disso rola
a página, então as listas continuam roláveis. Ajuste os dois com a `activation` do provider, e
desenhe um anel de toque longo a partir de `useDnD().activation.progress`: veja
[o provider](https://zizigy.github.io/docs/guides/provider#when-a-press-becomes-a-drag). Um arraste por toque vibra
rapidamente quando começa; `:haptics="false"` desliga isso.

## Movimento reduzido

Com `prefers-reduced-motion: reduce`, as animações da própria biblioteca não rodam: os itens pulam
para os seus lugares durante a ordenação, o overlay não voa no drop, e as mudanças de `animate`
aparecem na hora. As suas próprias funções de animação continuam rodando, com
`reducedMotion: true`, então você decide: pulá-las, ou manter um esmaecimento curto. Veja
[animações](https://zizigy.github.io/docs/guides/animations).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
