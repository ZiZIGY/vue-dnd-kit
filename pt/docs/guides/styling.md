---
title: "Estilização"
description: "Cada estado de um arraste, estilizado — atributos data para CSS puro, refs para classes, alvos que dizem sim ou não, o overlay e a página durante o arraste, os estilos padrão, Tailwind e UI kits."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/guides/styling"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

A biblioteca estiliza quase nada. Cada estado de um arraste chega até você de duas formas: como
um atributo `data-dnd-*`, para CSS puro, e como um ref que o composable retorna, para classes e
marcação condicional. Use o que combinar com a sua stack, ou os dois.

## Os atributos data

As linhas abaixo não têm nenhuma classe de estado: todo visual vem de um atributo. O painel lista
os atributos da página conforme eles aparecem e somem. Selecione duas linhas com
<kbd value="Ctrl">



</kbd>

 ou <kbd value="Meta">



</kbd>

 e arraste-as: os outros de um multi-drag também
aparecem.

<example height="25rem" hint="Arraste uma linha, depois use Ctrl/⌘-clique em duas e arraste-as" name="dnd-attributes">



</example>

<table>
<thead>
  <tr>
    <th>
      Atributo
    </th>
    
    <th>
      Em
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
        data-dnd-placeholder
      </code>
    </td>
    
    <td>
      um item ordenável
    </td>
    
    <td>
      Ele é a posição em que um item arrastado vai pousar. <code>
        "into"
      </code>
      
       enquanto o arraste está sobre um <a href="/docs/guides/drag-and-drop#drop-into-a-sortable-item">
        alvo de drop dentro de um item
      </a>
      
      : o drop vai para lá, e a posição só guarda o seu lugar.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-dragging
      </code>
    </td>
    
    <td>
      um item ordenável
    </td>
    
    <td>
      Ele é arrastado, mas fica no lugar: os outros itens de um multi-drag no modo <code>
        'gaps'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-dragging="pointer"
      </code>
      
       ou <code>
        "keyboard"
      </code>
    </td>
    
    <td>
      <code>
        <html>
      </code>
    </td>
    
    <td>
      Durante todo o arraste.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-overlay="dragging"
      </code>
      
       ou <code>
        "dropping"
      </code>
    </td>
    
    <td>
      a caixa do overlay
    </td>
    
    <td>
      Sempre. <code>
        dropping
      </code>
      
       enquanto ela pousa, e enquanto um <code>
        onBeforeDrop
      </code>
      
       assíncrono espera.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-overlay-content
      </code>
    </td>
    
    <td>
      o conteúdo do overlay
    </td>
    
    <td>
      Sempre: o elemento que preenche a caixa e contém o que ela mostra. Animá-lo fica por sua conta; ele recebe o <code>
        overlayClass
      </code>
      
       do provider.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-leaving
      </code>
    </td>
    
    <td>
      uma cópia deixada por <code>
        animate
      </code>
    </td>
    
    <td>
      Enquanto um item que saiu desaparece aos poucos.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-no-clone
      </code>
    </td>
    
    <td>
      <strong>
        definido por você
      </strong>
    </td>
    
    <td>
      Deixa o elemento fora da cópia do overlay: um tooltip, um menu, um selo.
    </td>
  </tr>
</tbody>
</table>

```css [TaskRow.vue]
/* The slot a dragged row will land in: a striped gap. */
.row[data-dnd-placeholder] {
  opacity: 1;
  background: repeating-linear-gradient(-45deg, color-mix(in srgb, #42b883 16%, transparent) 0 6px, transparent 6px 12px);
}

.row[data-dnd-placeholder] > * {
  visibility: hidden;   /* an empty slot of the row's exact size */
}

/* Selected rows left in place by a multi-drag (`multiple: 'gaps'`). */
.row[data-dnd-dragging] {
  opacity: 0.4;
}

/* The copy in the overlay, while it travels. */
[data-dnd-overlay='dragging'] .row {
  box-shadow: 0 0 0 1.5px #42b883, 0 14px 24px -10px rgb(0 0 0 / 0.55);
}
```

```vue [TaskRow.vue]
<li ref="el" class="row" :aria-selected="selected">
  <span class="title">{{ task.title }}</span>
  <button type="button" data-dnd-no-clone @click.stop="task.done = !task.done">✓</button>
</li>
```

- A cópia de uma linha no overlay mantém as classes e os atributos dela, incluindo o atributo de
escopo do Vue, então `[data-dnd-overlay] .row` funciona no próprio `<style scoped>` da linha. A
cópia não tem marcas `data-dnd-*` próprias: uma cópia da posição não é uma posição.
- A seleção não tem atributo. Espelhe o ref `selected` em um (`aria-selected` acima), ou use uma
classe.
- Draggables simples e alvos de drop (`makeDraggable`, `makeDroppable`) não recebem atributos de
estado `data-dnd-*`: estilize-os com os refs deles.

## Os refs retornados

Os mesmos estados como refs, mais os que as listas e os alvos têm. Cada linha e cada lista abaixo
mostra os refs que estão `true` agora, e as classes delas vêm deles. O Icebox recusa tarefas
urgentes: arraste uma sobre ele.

<example height="24rem" hint="Arraste uma tarefa para a outra lista; Ctrl/⌘-clique seleciona várias" name="dnd-refs">



</example>

```vue [RefRow.vue]
<script setup lang="ts">
const { isDragging, isPlaceholder, selected } = makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <li ref="el" class="row" :class="{ placeholder: isPlaceholder, dragging: isDragging, selected }">…</li>
</template>

<style scoped>
.row.selected { box-shadow: 0 0 0 1.5px #3b82f6; }
.row.placeholder { opacity: 1; box-shadow: inset 0 0 0 1.5px #42b883; }   /* beats the default 40% */
.row.placeholder .title { visibility: hidden; }
</style>
```

```vue [RefList.vue]
<script setup lang="ts">
const { items, isOver, isAccepting } = makeSortableList(el, { items, group });
</script>

<template>
  <section :class="{ accepting: isAccepting, over: isOver && isAccepting, refused: isOver && !isAccepting }">…</section>
</template>
```

<table>
<thead>
  <tr>
    <th>
      Composable
    </th>
    
    <th>
      Estado
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeSortableItem
      </code>
    </td>
    
    <td>
      <code>
        isDragging
      </code>
      
      , <code>
        isPlaceholder
      </code>
      
      , <code>
        selected
      </code>
      
      , <code>
        indicator
      </code>
      
      , <code>
        index
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSortableList
      </code>
      
      , <code>
        makeSortableTree
      </code>
    </td>
    
    <td>
      <code>
        isOver
      </code>
      
      , <code>
        isAccepting
      </code>
      
      , <code>
        indicator
      </code>
      
      , <code>
        activeKey
      </code>
      
      , <code>
        activeIndex
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDraggable
      </code>
    </td>
    
    <td>
      <code>
        isDragging
      </code>
      
      , <code>
        selected
      </code>
      
      , <code>
        transform
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDroppable
      </code>
    </td>
    
    <td>
      <code>
        isOver
      </code>
      
      , <code>
        isAccepting
      </code>
      
      , <code>
        placement
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDragArea
      </code>
    </td>
    
    <td>
      <code>
        isDragging
      </code>
      
      , <code>
        isAutoScrolling
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnD()
      </code>
    </td>
    
    <td>
      <code>
        status
      </code>
      
      , <code>
        active
      </code>
      
      , <code>
        over
      </code>
      
      , <code>
        pointer
      </code>
      
      , <code>
        activation.progress
      </code>
      
      , <code>
        isAutoScrolling
      </code>
    </td>
  </tr>
</tbody>
</table>

- `isPlaceholder`: este elemento é a posição em que um item arrastado vai pousar. Em um multi-drag
no modo `'group'`, as posições dos itens que viajam junto também são placeholders.
- `isDragging`: o item faz parte do arraste: todos os itens arrastados em um multi-drag.
- `isAccepting`: algo está sendo arrastado, e este alvo o aceita. Destaque os lugares onde um drop
é possível.
- `isOver`: o arraste está sobre este alvo, aceitando-o ou não. `isOver && !isAccepting` é uma
recusa: mostre-a.
- `indicator`: onde fica a linha de drop no [modo indicador](https://zizigy.github.io/docs/guides/sortable-lists#an-insertion-line).
- `activation.progress`: de 0 a 1 enquanto corre um toque longo ou um `delay`. Preencha um anel
com ele.

## Alvos de drop: sim e não

Um alvo tem quatro visuais durante um arraste: ele aceita o arraste; aceita e o ponteiro está
sobre ele; recusa; recusa e o ponteiro está sobre ele. Mostre os quatro, e diga isso também no
item arrastado.

<example height="23rem" hint="Arraste uma cor sobre as paletas: a certa a convida, as outras não" name="drop-highlights">



</example>

```ts [Palette.vue]
const { isOver, isAccepting } = makeDroppable(el, { accept: props.tone, onDrop });

const { active } = useDnD();
const state = computed(() => {
  if (!active.value) return '';
  if (isOver.value) return isAccepting.value ? 'over' : 'refused';
  return isAccepting.value ? 'accepting' : 'refusing';
});
```

```css [Palette.vue]
.palette.accepting { border-style: dashed; border-color: #42b883; }          /* an invitation */
.palette.over { border-color: #42b883; background: color-mix(in srgb, #42b883 14%, Canvas); }
.palette.refusing { opacity: 0.45; }                                          /* out of the way */
.palette.refused { border-color: #f43f5e; animation: shake 0.3s; }            /* a drop here is cancelled */
```

A amostra arrastada é o slot `#overlay` do provider. Ele recebe `over` e `accepted`: `accepted` é
`false` sobre um alvo que recusa o arraste.

```vue [index.vue]
<template #overlay="{ active, over, accepted }">
  <div
    class="lifted"
    :class="{ yes: over && accepted, no: over && !accepted }"
    :style="{ background: (active.data as { color: string }).color }"
  >
    <span v-if="over" class="badge">{{ accepted ? '+' : '✕' }}</span>
  </div>
</template>
```

Fora do overlay, `useDnD().over.value?.accepted` diz o mesmo. Mais sobre componentes de overlay em
[o overlay](https://zizigy.github.io/docs/guides/overlay).

## O overlay e a página

Dois atributos cobrem o resto de um arraste: `data-dnd-overlay` na caixa do overlay, e
`data-dnd-dragging` no `<html>`, `"pointer"` ou `"keyboard"`. A barra acima das notas lê o segundo
e diz quais teclas funcionam. Ligue o salvamento lento: o overlay fica em `dropping` onde você
soltou, até o `onBeforeDrop` resolver, e mostra isso.

<example height="27rem" hint="Arraste uma nota com o mouse, depois com o teclado; ligue o salvamento lento" name="overlay-theme">



</example>

```css [index.vue]
.bar .pointer,
.bar .keyboard,
html[data-dnd-dragging] .bar .idle { display: none; }

html[data-dnd-dragging='pointer'] .bar .pointer,
html[data-dnd-dragging='keyboard'] .bar .keyboard { display: inline; }
```

```css [StickyNote.vue]
[data-dnd-overlay='dragging'] .note {
  box-shadow: 0 0 0 2px #42b883, 0 22px 30px -14px rgb(0 0 0 / 0.6);
}

/* Landing, and waiting for the save. */
[data-dnd-overlay='dropping'] .note { opacity: 0.85; }
[data-dnd-overlay='dropping'] .saving { display: flex; }
```

- `dropping` cobre o pouso e a espera de um `onBeforeDrop` assíncrono. Enquanto ele espera, o
`<html>` sai do modo de arraste: o cursor e a seleção de texto da página voltam, então um diálogo
de confirmação funciona como sempre.
- Estilize o que está **dentro** da caixa. A biblioteca move a própria caixa com `transform` e a
dimensiona com `width` e `height`. O elemento de conteúdo dela, `[data-dnd-overlay-content]`, a
preenche e é seu: erga e incline o overlay inteiro ali (veja
[animações](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle)).
- A raiz da cópia tem `transform: none` inline: gire-a ou aumente-a com `rotate` e `scale`.
Transições e keyframes rodam nela: veja
[animações](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle).
- A cópia mostra o elemento como ele é e não adivinha fundo nenhum. Uma linha que a lista pinta
(um `<li>` em um `<ul>` branco, uma linha de tabela) precisa de um:
`[data-dnd-overlay] .row { background: Canvas; }`.
- A cópia fica em uma `<div>` que carrega as custom properties que o elemento herdava (cores do
tema, `--tw-*`), então elas continuam valendo no overlay, e as regras da própria cópia
(`in-data-[dnd-overlay]:ring-2`) ainda vencem. Selecione a cópia pela classe, não pela
profundidade dela na caixa.

## Estilos padrão

O provider injeta algumas regras uma vez por documento. Elas ficam dentro de `:where()`, então a
especificidade delas é zero e qualquer regra sua vence:

```css
:where([data-dnd-placeholder]) { opacity: 0.4; }
:where([data-dnd-dragging]:not(html)) { opacity: 0.4; }
:where(html[data-dnd-dragging]), :where(html[data-dnd-dragging] *) {
  user-select: none !important;
  overflow-anchor: none !important;
}
:where(html[data-dnd-dragging='pointer']), :where(html[data-dnd-dragging='pointer'] *) {
  cursor: var(--dnd-cursor, grabbing) !important;
  -webkit-touch-callout: none !important;
}
```

<table>
<thead>
  <tr>
    <th>
      Regra
    </th>
    
    <th>
      Por quê
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      A posição a 40%
    </td>
    
    <td>
      Para que uma lista fique certa sem CSS nenhum. Todas as demos acima a sobrescrevem.
    </td>
  </tr>
  
  <tr>
    <td>
      Itens deixados para trás a 40%
    </td>
    
    <td>
      O mesmo, para um multi-drag no modo <code>
        'gaps'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Sem <code>
        user-select
      </code>
    </td>
    
    <td>
      Um arraste não seleciona o texto pelo qual passa.
    </td>
  </tr>
  
  <tr>
    <td>
      Sem <code>
        overflow-anchor
      </code>
    </td>
    
    <td>
      A página não rola para manter uma linha em movimento à vista.
    </td>
  </tr>
  
  <tr>
    <td>
      O cursor do arraste
    </td>
    
    <td>
      Durante um arraste por ponteiro, em todo lugar. <code>
        grabbing
      </code>
      
      , a menos que o elemento pego tenha um cursor próprio: o <code>
        ns-resize
      </code>
      
       de uma alça de redimensionar, um <code>
        move
      </code>
      
      , uma imagem mantêm o seu durante todo o arraste (<code>
        grab
      </code>
      
      , <code>
        pointer
      </code>
      
       e afins ainda viram <code>
        grabbing
      </code>
      
      ). <code>
        cursor: grab
      </code>
      
       nos itens arrastáveis fica por sua conta. Defina <code>
        --dnd-cursor
      </code>
      
       no <code>
        <html>
      </code>
      
       para outro padrão.
    </td>
  </tr>
  
  <tr>
    <td>
      Sem touch callout
    </td>
    
    <td>
      O iOS não abre o menu de link sob um toque longo.
    </td>
  </tr>
</tbody>
</table>

`:default-styles="false"` no provider as deixa de fora. A biblioteca ainda marca o `<html>`, e
ainda limpa a seleção quando um arraste começa e impede novas seleções até ele terminar: só o CSS some. As regras
são injetadas uma vez, pelo primeiro provider que as quer, e ficam: desligue-as em todos os
providers da página.

```vue
<DnDProvider :default-styles="false">
```

## Tailwind CSS

Os atributos funcionam como variantes: `data-[…]` para o próprio elemento, uma variante
arbitrária para um ancestral.

```vue [TaskRow.vue]
<li
  ref="el"
  class="rounded-lg bg-white shadow-sm
         data-[dnd-placeholder]:bg-transparent data-[dnd-placeholder]:opacity-100
         data-[dnd-placeholder]:outline-dashed
         [[data-dnd-overlay=dragging]_&]:shadow-xl"
  :class="{ 'ring-2 ring-emerald-500': selected }"
>
```

```vue [Hint.vue]
<p class="hidden [html[data-dnd-dragging=keyboard]_&]:block">Arrows move · Space drops</p>
```

<note>

Os visuais da biblioteca (as opacidades de 40%) ficam em uma cascade layer própria, `vue-dnd-kit`,
declarada antes de qualquer outra. Os utilitários do Tailwind v4 e os UI kits feitos com ele
também vivem em layers, e as deles vêm depois, então vencem sem `!`. CSS fora de layers vence de
qualquer jeito.

</note>

No Tailwind v4, `in-data-[dnd-overlay=dragging]:shadow-xl` é um jeito mais curto de escrever a
variante de ancestral.

<warning>

No CSS scoped do Vue, `:global()` pega o seletor inteiro: `:global(html[data-dnd-dragging]) .hint`
compila só para `html[data-dnd-dragging]`, e esconde a página. Escreva o ancestral sem ele,
`html[data-dnd-dragging] .hint`: o Vue aplica o escopo só à última parte.

</warning>

## UI kits

- Os composables aceitam um componente assim como um elemento: `useTemplateRef` no card ou no
item de lista de um kit funciona, e a biblioteca lê o elemento raiz dele.
- Passe o estado para as props do próprio kit quando ele as tiver (`:active="selected"`,
`:color="isOver ? 'primary' : undefined"`), e o resto como classes.
- Os itens de lista de um kit muitas vezes não têm fundo próprio: a lista o pinta. A cópia deles
no overlay fica então transparente. Dê um fundo a ela:```css
[data-dnd-overlay] .v-list-item { background: rgb(var(--v-theme-surface)); }
```
- A cópia deixa de fora os ripples de pressão do Vuetify, Quasar, PrimeVue e Naive UI. Marque
qualquer outra coisa que não deve viajar, um tooltip ou um botão de menu, com
`data-dnd-no-clone`.

## O que não fazer

- Não coloque um `transition` CSS em `transform` ou `translate` de itens ordenáveis: a biblioteca
os anima ela mesma, e cancela essas transições enquanto mede.
- Não envolva itens ordenáveis em `<TransitionGroup>`: os movimentos seriam animados duas vezes.
Use o `animate` da lista.
- Não anime `height`, `margin` ou `padding` de linhas em uma [lista virtual](/docs/guides/virtual-lists).
- Desligue as transições que você adiciona em volta dos arrastes sob
`prefers-reduced-motion: reduce`. A biblioteca já desliga as dela.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
