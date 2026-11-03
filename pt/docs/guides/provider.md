---
title: "O provider"
description: "DnDProvider controla todo arraste abaixo dele. Ele encontra o alvo, inicia arrastes, rola a página e conta ao useDnD e ao useDnDMonitor tudo o que acontece."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/guides/provider"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

## Um provider para o app

```vue [App.vue]
<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
</script>

<template>
  <DnDProvider>
    <RouterView />
  </DnDProvider>
</template>
```

Coloque um `DnDProvider` lá no alto, no `App.vue` ou em um layout, e esqueça dele. Todo
composable (`makeSortableList`, `makeDraggable`, `useDnD`…) procura o provider mais próximo
acima do componente em que roda.

<warning>

Um composable precisa rodar em um componente **renderizado dentro** do provider. Chamá-lo no
componente cujo próprio template contém `<DnDProvider>` lança
`No <DnDProvider> found above this component`: o `inject` do Vue só enxerga ancestrais.

</warning>

## O que ele controla

<table>
<thead>
  <tr>
    <th>
      Parte
    </th>
    
    <th>
      O que o provider faz
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Entrada
    </td>
    
    <td>
      Transforma a entrada por ponteiro, toque e teclado em arrastes (<code>
        sensors
      </code>
      
      , <code>
        activation
      </code>
      
      ), um arraste por vez.
    </td>
  </tr>
  
  <tr>
    <td>
      Encontrar o alvo
    </td>
    
    <td>
      Testa quais alvos de drop estão sob o arraste (<code>
        collision
      </code>
      
      ) e avisa a eles.
    </td>
  </tr>
  
  <tr>
    <td>
      O overlay
    </td>
    
    <td>
      Renderiza a caixa que segue o ponteiro, teleportada para o <code>
        body
      </code>
      
      , e a faz pousar no drop.
    </td>
  </tr>
  
  <tr>
    <td>
      A seleção
    </td>
    
    <td>
      Um único conjunto de ids selecionados, compartilhado por todas as listas e draggables abaixo dele.
    </td>
  </tr>
  
  <tr>
    <td>
      Rolagem automática
    </td>
    
    <td>
      Rola os contêineres e a janela quando um arraste chega perto das bordas deles.
    </td>
  </tr>
  
  <tr>
    <td>
      A live region
    </td>
    
    <td>
      Anuncia aos leitores de tela os inícios de arraste, os movimentos, os drops e os cancelamentos.
    </td>
  </tr>
</tbody>
</table>

Ele não renderiza mais nada: a sua marcação fica como está.

## Opções em resumo

Toda opção tem um padrão que funciona, então em geral o provider não recebe nenhuma. O provider
lê as props quando precisa delas: as demos abaixo trocam `collision`, `activation` e
`autoScroll` ao vivo.

<table>
<thead>
  <tr>
    <th>
      Prop
    </th>
    
    <th>
      Padrão
    </th>
    
    <th>
      O que define
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        collision
      </code>
    </td>
    
    <td>
      <code>
        pointerFirst
      </code>
    </td>
    
    <td>
      Como o alvo sob o arraste é escolhido. <a href="#finding-the-target">
        Abaixo
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
    </td>
    
    <td>
      mouse 4 px, toque 200 ms
    </td>
    
    <td>
      Quando uma pressão vira arraste, por tipo de ponteiro. <a href="#when-a-press-becomes-a-drag">
        Abaixo
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        autoScroll
      </code>
    </td>
    
    <td>
      ligado
    </td>
    
    <td>
      Rolagem nas bordas: <code>
        { threshold, maxSpeed, acceleration }
      </code>
      
       ou <code>
        false
      </code>
      
      . <a href="#auto-scroll">
        Abaixo
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        haptics
      </code>
    </td>
    
    <td>
      uma vibração curta ao pegar por toque
    </td>
    
    <td>
      Vibrações para arrastes por toque, ou <code>
        false
      </code>
      
      . <a href="#haptics-and-the-copy-key">
        Abaixo
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        copyModifier
      </code>
    </td>
    
    <td>
      <code>
        'Alt'
      </code>
    </td>
    
    <td>
      Tecla que, segurada durante o arraste, transforma um movimento em cópia.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifiers
      </code>
    </td>
    
    <td>
      <code>
        []
      </code>
    </td>
    
    <td>
      Regras de movimento para todo arraste: veja <a href="/docs/guides/constraints">
        restrições
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        animation
      </code>
      
       / <code>
        dropAnimation
      </code>
    </td>
    
    <td>
      ligado
    </td>
    
    <td>
      Itens deslizando durante a ordenação / o overlay pousando: veja <a href="/docs/guides/animations">
        animações
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        animateChanges
      </code>
    </td>
    
    <td>
      desligado
    </td>
    
    <td>
      Padrão para listas e árvores: animar mudanças nos dados que nenhum arraste fez.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard
      </code>
    </td>
    
    <td>
      Space / Enter, Escape
    </td>
    
    <td>
      Teclas e passo do teclado; <code>
        false
      </code>
      
       desliga os arrastes por teclado. Veja <a href="/docs/guides/accessibility#the-keyboard">
        acessibilidade
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        sensors
      </code>
    </td>
    
    <td>
      ponteiro + teclado
    </td>
    
    <td>
      O que transforma a entrada em arrastes: veja <a href="/docs/guides/sensors">
        sensores
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayTo
      </code>
    </td>
    
    <td>
      <code>
        'body'
      </code>
    </td>
    
    <td>
      Para onde o overlay é teleportado.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayFit
      </code>
    </td>
    
    <td>
      <code>
        'slot'
      </code>
    </td>
    
    <td>
      Tamanho do overlay: o da posição em que ele vai pousar, ou o da origem. Veja <a href="/docs/guides/overlay">
        o overlay
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayTransition
      </code>
    </td>
    
    <td>
      um crossfade
    </td>
    
    <td>
      Como o overlay muda de um componente para outro durante o arraste: <code>
        false
      </code>
      
      , ou props de <code>
        <Transition>
      </code>
      
      . Veja <a href="/docs/guides/overlay#targets-that-change-the-overlay">
        alvos que mudam o overlay
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayClass
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      Classes para o conteúdo do overlay (<code>
        [data-dnd-overlay-content]
      </code>
      
      ), o elemento a animar como um todo: erguer quando o arraste começa, assentar quando ele pousa. Veja <a href="/docs/guides/animations#the-overlay-lift-tilt-settle">
        o overlay: erguer, inclinar, assentar
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayPreviews
      </code>
    </td>
    
    <td>
      <code>
        5
      </code>
    </td>
    
    <td>
      Multi-drag: quantos itens arrastados ganham um clone no início do arraste, ou <code>
        'all'
      </code>
      
      . Veja <a href="/docs/guides/multi-drag#the-default-overlay">
        o overlay padrão
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        announcements
      </code>
    </td>
    
    <td>
      embutidos
    </td>
    
    <td>
      Textos para leitores de tela, ou <code>
        false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        screenReaderInstructions
      </code>
    </td>
    
    <td>
      embutido
    </td>
    
    <td>
      O texto que todo draggable aponta com <code>
        aria-describedby
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        defaultStyles
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
    </td>
    
    <td>
      Injeta CSS de especificidade zero para os estados do arraste: veja <a href="/docs/guides/styling">
        estilização
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

A lista completa, com todas as formas, está na [API do DnDProvider](https://zizigy.github.io/docs/api/dnd-provider). O
provider também emite `drag-start`, `drag-move`, `drag-over`, `drag-end`, `drag-cancel`,
`drag-resume` e `drag-settle`, os mesmos eventos que o `useDnDMonitor` ouve.

## Ler o arraste: `useDnD()`

<example height="27rem" hint="Arraste uma tarefa e observe o estado" name="provider-state">



</example>

`useDnD()` retorna o arraste como estado reativo, em qualquer componente abaixo do provider:

```ts
import { useDnD } from '@vue-dnd-kit/core';

const { status, active, over, pointer, activation, isAutoScrolling, selection, cancel } = useDnD();
```

<table>
<thead>
  <tr>
    <th>
      Campo
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
        status
      </code>
    </td>
    
    <td>
      <code>
        'idle'
      </code>
      
      , <code>
        'activating'
      </code>
      
       (uma pressão esperando a ativação), <code>
        'dragging'
      </code>
      
      , <code>
        'dropping'
      </code>
      
       (nenhum arraste em andamento, mas um overlay ainda está pousando, ou um <code>
        onBeforeDrop
      </code>
      
       assíncrono está decidindo), <code>
        'selecting'
      </code>
      
       (um retângulo de seleção).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        active
      </code>
    </td>
    
    <td>
      O que está sendo arrastado: <code>
        id
      </code>
      
      , <code>
        ids
      </code>
      
       (todos os ids arrastados, o pego primeiro), <code>
        items
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        type
      </code>
      
      , <code>
        element
      </code>
      
      , <code>
        rect
      </code>
      
      , <code>
        sensor
      </code>
      
      . <code>
        null
      </code>
      
       quando parado.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
    </td>
    
    <td>
      O alvo sob o arraste: <code>
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
      
       e <code>
        accepted
      </code>
      
      . <code>
        null
      </code>
      
       sobre nada.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointer
      </code>
    </td>
    
    <td>
      O ponteiro em coordenadas da viewport, depois dos modificadores.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation.progress
      </code>
    </td>
    
    <td>
      De <code>
        0
      </code>
      
       a <code>
        1
      </code>
      
       enquanto uma pressão espera a ativação: desenhe um anel com ele.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isAutoScrolling
      </code>
    </td>
    
    <td>
      A rolagem automática está movendo alguma coisa.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selection
      </code>
    </td>
    
    <td>
      A seleção do provider: <code>
        ids
      </code>
      
      , <code>
        has
      </code>
      
      , <code>
        add
      </code>
      
      , <code>
        delete
      </code>
      
      , <code>
        toggle
      </code>
      
      , <code>
        set
      </code>
      
      , <code>
        clear
      </code>
      
      . Veja <a href="/docs/guides/multi-drag">
        multi-drag
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel()
      </code>
    </td>
    
    <td>
      Cancela o arraste em andamento (os itens voltam ao lugar), uma pressão carregando ou um retângulo de seleção.
    </td>
  </tr>
</tbody>
</table>

```vue [DropHint.vue]
<script setup lang="ts">
import { computed } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';

const { status, over } = useDnD();
const refused = computed(() => status.value === 'dragging' && over.value?.accepted === false);
</script>

<template>
  <p v-if="refused" role="status">This list doesn't take that.</p>
</template>
```

Assim que um drop é decidido, `active`, `over` e `pointer` passam a ser `null`, mesmo enquanto o
overlay ainda está pousando (`status` vale `'dropping'`). Uma UI derivada deles nunca mostra o
arraste antigo ao lado dos dados novos. Enquanto um `onBeforeDrop` assíncrono espera, o estado
fica como estava no momento de soltar.

O próximo arraste não espera um pouso: ele começa na hora, e `status` vale `'dragging'`
enquanto o último overlay pousa ao redor dele. Uma pressão sobre um overlay que está pousando o
pega em pleno voo: o arraste continua de onde o overlay está. `onDragSettle` avisa quando o
overlay de um arraste chegou ao seu lugar.

## Ouvir todo arraste: `useDnDMonitor()`

```ts
import { useDnDMonitor } from '@vue-dnd-kit/core';

useDnDMonitor({
  onDragStart: ({ active }) => {},
  onDragMove: ({ pointer, delta }) => {},
  onDragOver: ({ over }) => {},                  // the target changed
  onBeforeDrop: (e) => 'accept',                 // or 'reject', 'continue', some ids; may be async
  onDragEnd: ({ active, over, dropped, accepted, position }) => {},
  onDragCancel: ({ active }) => {},
  onDragResume: ({ active }) => {},              // onBeforeDrop answered 'continue'
  onDragSettle: ({ active, over }) => {},        // its overlay has landed
});
```

Um monitor ouve todo arraste abaixo do seu provider, onde quer que ele comece: o painel acima
registra os arrastes da lista sem importá-la. Ele para quando o componente que o chamou é
desmontado.

<table>
<thead>
  <tr>
    <th>
      Evento
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
        onDragStart
      </code>
    </td>
    
    <td>
      Um arraste começa.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragMove
      </code>
    </td>
    
    <td>
      O arraste se move.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragOver
      </code>
    </td>
    
    <td>
      O alvo sob o arraste muda.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
    </td>
    
    <td>
      O arraste é solto. A resposta decide o drop: veja <a href="/docs/guides/drop-decisions">
        decidindo um drop
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragEnd
      </code>
    </td>
    
    <td>
      O drop foi concluído. As listas ordenáveis já rodaram o <code>
        onDrop
      </code>
      
       delas e gravaram a nova ordem. <code>
        dropped
      </code>
      
       é <code>
        false
      </code>
      
       quando o arraste terminou fora de qualquer alvo.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragCancel
      </code>
    </td>
    
    <td>
      Escape, um drop em um alvo que o recusa, ou um <code>
        onBeforeDrop
      </code>
      
       que respondeu <code>
        'reject'
      </code>
      
      .
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
      
      : nada foi solto, e o arraste continua.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragSettle
      </code>
    </td>
    
    <td>
      O overlay do arraste pousou (ou voltou ao lugar, ou foi pego pelo próximo arraste), com o evento que <code>
        onDragEnd
      </code>
      
       ou <code>
        onDragCancel
      </code>
      
       recebeu. Outros arrastes podem ter começado nesse meio-tempo.
    </td>
  </tr>
</tbody>
</table>

Todo evento traz `active`, `over`, `pointer`, `delta` (o deslocamento desde o início),
`position` (onde a caixa arrastada fica dentro de `over`, veja
[arrastar e soltar](https://zizigy.github.io/docs/guides/drag-and-drop#leave-it-where-it-was-dropped)) e, para itens de
uma lista ordenável, `source`. As formas completas estão na [API de eventos](https://zizigy.github.io/docs/api/events).

<note>

`onDragEnd` é o lugar para o trabalho "depois do drop": salvar, limpar a seleção, analytics. O
`onDrop` de uma lista roda **antes** da gravação dela, então ainda vê a ordem antiga.

</note>

## Encontrar o alvo

Escolha uma função, depois arraste o alfinete ou o card sobre os alvos. Os selos mostram como a
função os classifica neste quadro; o verde é o alvo.

<example height="33rem" hint="Troque a função, arraste sobre os alvos aninhados, pequenos e sobrepostos" name="collision-lab">



</example>

A cada quadro de um arraste, o provider passa para `collision` os alvos de drop em jogo, e ela
retorna os ids deles, do melhor para o pior. Cinco funções vêm com a biblioteca:

<table>
<thead>
  <tr>
    <th>
      Função
    </th>
    
    <th>
      Classifica
    </th>
    
    <th>
      Boa para
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pointerFirst
      </code>
    </td>
    
    <td>
      O que está sob o ponteiro; quando não há nada, o que a caixa arrastada sobrepõe.
    </td>
    
    <td>
      O padrão: preciso sob o ponteiro, tolerante nos vãos.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointerWithin
      </code>
    </td>
    
    <td>
      Só o que está sob o ponteiro, o mais interno primeiro.
    </td>
    
    <td>
      Alvos precisos: um vão não solta em lugar nenhum.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        rectIntersection
      </code>
    </td>
    
    <td>
      Todo alvo que a caixa arrastada sobrepõe: maior <code>
        priority
      </code>
      
      , depois o aninhamento mais profundo, depois a maior sobreposição.
    </td>
    
    <td>
      Itens grandes sobre alvos pequenos, quando o ponteiro está na borda do item.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCenter
      </code>
    </td>
    
    <td>
      Todo alvo, pela distância do centro da caixa até o centro dele.
    </td>
    
    <td>
      Sempre alguém vence, mesmo longe: grades e listas de itens do mesmo tamanho.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCorners
      </code>
    </td>
    
    <td>
      Todo alvo, pelas distâncias entre os quatro cantos.
    </td>
    
    <td>
      Colunas lado a lado (kanban), alvos com alturas muito diferentes.
    </td>
  </tr>
</tbody>
</table>

Sob o ponteiro, o teste respeita o que o usuário vê: de alvos sobrepostos, só o de cima é
atingido (`front`, nunca `back` onde eles se sobrepõem), e de alvos aninhados o mais interno vem
primeiro (`subfolder`, depois `folder`).

### Uma função sua

```ts [magnet.ts]
import type { CollisionDetection, Coordinates, Rect } from '@vue-dnd-kit/core';

/** How far the point is from the rect: 0 inside it. */
const gap = (rect: Rect, point: Coordinates) =>
  Math.hypot(
    Math.max(rect.left - point.x, 0, point.x - rect.right),
    Math.max(rect.top - point.y, 0, point.y - rect.bottom),
  );

/** What is under the pointer; in a gap, the nearest target within 40px. */
export const magnet: CollisionDetection = ({ hits, pointer, candidates }) => {
  if (hits.length) return hits;
  return candidates
    .filter((candidate) => gap(candidate.rect, pointer) <= 40)
    .sort((a, b) => gap(a.rect, pointer) - gap(b.rect, pointer))
    .map((candidate) => candidate.id);
};
```

<table>
<thead>
  <tr>
    <th>
      Argumento
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
        pointer
      </code>
    </td>
    
    <td>
      O ponteiro, depois dos modificadores.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayRect
      </code>
    </td>
    
    <td>
      A caixa arrastada como é mostrada, <code>
        null
      </code>
      
       sem overlay.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        candidates
      </code>
    </td>
    
    <td>
      Todo alvo em jogo: <code>
        id
      </code>
      
      , <code>
        rect
      </code>
      
       (a parte visível dele, recortada pelos contêineres de rolagem), <code>
        priority
      </code>
      
      , <code>
        depth
      </code>
      
       (<code>
        0
      </code>
      
       no topo, maior quando aninhado).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hits
      </code>
    </td>
    
    <td>
      Os alvos sob o ponteiro, segundo o teste, do melhor para o pior.
    </td>
  </tr>
</tbody>
</table>

Retorne um array vazio para "nenhum alvo". Alvos desativados, alvos dentro dos itens arrastados
e alvos escondidos pelos seus contêineres de rolagem nunca chegam à função. Um alvo que recusa o
arraste continua competindo: sobre ele, `over.accepted` é `false` e o drop é recusado (um alvo
dentro de um item ordenável sai do caminho, para que a lista ordene sobre ele). A demo envolve a
função escolhida para registrar a classificação:
`(args) => (ranked.value = detect(args))`.

<note>

O provider amortece as trocas que a função pede. Um alvo que o arraste acabou de deixar não pode
vencer de novo até o ponteiro se mover 10 px, então as fronteiras não piscam. Entre os alvos
aninhados em um pai (os vãos de uma coluna de cards), o último alvo permanece.

</note>

## Quando uma pressão vira arraste

Uma pressão não arrasta na hora. `activation` define, por tipo de ponteiro (`mouse`, `touch`,
`pen`), o que ela espera: uma `distance` em px, um `delay` em ms (com uma `tolerance` além da qual
a pressão desiste, para que a página possa rolar), ou o que vier primeiro dos dois.

```vue
<DnDProvider :activation="{ mouse: { distance: 8 }, touch: { delay: 300, tolerance: 8 } }">
```

<table>
<thead>
  <tr>
    <th>
      Ponteiro
    </th>
    
    <th>
      Padrão
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        mouse
      </code>
      
      , <code>
        pen
      </code>
    </td>
    
    <td>
      <code>
        { distance: 4 }
      </code>
      
      : um clique continua sendo um clique. Uma pressão do mouse em um <code>
        handle
      </code>
      
       começa na hora, e continua sendo um clique se não se mover.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        touch
      </code>
    </td>
    
    <td>
      <code>
        { delay: 200, tolerance: 5 }
      </code>
      
      : um toque longo, para que as listas continuem rolando sob o dedo.
    </td>
  </tr>
</tbody>
</table>

Um tipo que você omite mantém o seu padrão. A `activation` do próprio draggable vence a de uma
[área de arraste](https://zizigy.github.io/docs/guides/constraints), que vence a do provider. Enquanto uma pressão espera,
`useDnD().status` é `'activating'` e `activation.progress` vai de `0` a `1`; Escape ou
`useDnD().cancel()` a cancela. Teste as restrições ao vivo, e desenhe um anel de toque longo a
partir do progresso, em [sensores](https://zizigy.github.io/docs/guides/sensors#activation-constraints).

## Rolagem automática

Arraste um canal em direção ao topo ou ao fim da lista. As faixas verdes são as zonas de borda:
quanto mais fundo em uma delas, mais rápido a lista rola.

<example height="37.5rem" hint="Arraste um canal para dentro das faixas verdes" name="auto-scroll-edges">



</example>

Qualquer elemento com `overflow: auto` ou `scroll` rola sozinho, e a janela também. O provider
rola primeiro o contêiner sob o ponteiro, depois os ancestrais dele, depois a janela.

<table>
<thead>
  <tr>
    <th>
      Opção
    </th>
    
    <th>
      Padrão
    </th>
    
    <th>
      O que define
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        threshold
      </code>
    </td>
    
    <td>
      <code>
        0.2
      </code>
    </td>
    
    <td>
      A zona de borda, como fração do tamanho do contêiner, entre 24 e 96 px.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        acceleration
      </code>
    </td>
    
    <td>
      <code>
        10
      </code>
    </td>
    
    <td>
      A velocidade bem na borda, em px por quadro. Ela cresce com o quadrado da profundidade dentro da zona, então o começo é lento e preciso.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        maxSpeed
      </code>
    </td>
    
    <td>
      <code>
        25
      </code>
    </td>
    
    <td>
      A velocidade máxima. Além da borda (o ponteiro fora do contêiner), a velocidade continua crescendo até ela.
    </td>
  </tr>
</tbody>
</table>

`:auto-scroll="false"` desliga a rolagem. Uma direção só rola depois que o ponteiro se moveu para
aquele lado, então um item pego perto de uma borda não rola sozinho. Listas, árvores e
[áreas de arraste](https://zizigy.github.io/docs/guides/constraints) recebem um `autoScroll` próprio para o seu
contêiner:

```ts
makeSortableList(list, { items: channels, autoScroll: { maxSpeed: 10 } });
```

Arrastes por teclado nunca rolam automaticamente: em vez disso, eles rolam o item até ficar
visível. `isAutoScrolling` (do `useDnD()` ou de uma área de arraste) é `true` enquanto algo rola.

## Vibração e a tecla de cópia

Um arraste por toque vibra rapidamente quando começa. `:haptics="false"` desliga isso; um objeto
define cada vibração:

```vue
<DnDProvider :haptics="{ start: true, enter: 10, drop: 10, refuse: [20, 40, 20] }">
```

<table>
<thead>
  <tr>
    <th>
      Chave
    </th>
    
    <th>
      Vibra quando
    </th>
    
    <th>
      Padrão
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        start
      </code>
    </td>
    
    <td>
      O toque longo vira arraste.
    </td>
    
    <td>
      <code>
        true
      </code>
      
       (10 ms)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        enter
      </code>
    </td>
    
    <td>
      O arraste entra em um alvo que o aceita.
    </td>
    
    <td>
      desligado
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drop
      </code>
    </td>
    
    <td>
      O drop é concluído.
    </td>
    
    <td>
      desligado
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        refuse
      </code>
    </td>
    
    <td>
      O drop é recusado e os itens voltam ao lugar.
    </td>
    
    <td>
      desligado
    </td>
  </tr>
</tbody>
</table>

Cada uma recebe `true` (o padrão), uma duração em ms, um padrão liga/desliga, ou `false`. Só os
arrastes iniciados por toque vibram, e o Safari do iOS não consegue vibrar.

`copyModifier` é a tecla que, segurada durante um arraste entre listas, transforma o movimento em
cópia: `'Alt'` por padrão, qualquer `KeyboardEvent.key`, ou `null` para nenhuma. A lista de onde os
itens vêm precisa de uma função `clone`; veja [listas que compartilham itens](https://zizigy.github.io/docs/guides/shared-lists).

## Vários providers

A maioria dos apps precisa de exatamente um. Coloque a lista de desejos sob um provider próprio, e
tente mover um livro de um lado para o outro: ele não consegue sair do seu provider, e o monitor
externo deixa de ouvir a lista de desejos.

<example height="33.5rem" hint="Mova um livro de um lado para o outro, depois dê à lista de desejos um provider próprio" name="provider-nested">



</example>

```vue
<DnDProvider>
  <Shelf v-model="reading" />
  <DnDProvider>
    <Shelf v-model="wishlist" />
    <EventLog />            <!-- hears the inner provider's drags only -->
  </DnDProvider>
</DnDProvider>
```

- Os providers são independentes: um arraste nunca passa de um para outro.
- Providers aninhados são permitidos. **Vence o dono mais próximo**: um item pertence ao provider
mais próximo acima dele, e o provider externo o ignora.
- Cada provider tem a sua própria seleção, overlay, live region e monitores.

Um segundo provider só faz sentido para uma parte da página que precisa das suas próprias
configurações de provider (colisão, teclas do teclado, anúncios) e cujos itens nunca saem dela.
Se os itens não conseguem se mover entre duas partes da página, verifique se eles não estão sob
dois providers.

<tip>

Regras para uma parte da página (um quadro que encaixa na grade, um feed com um toque mais longo,
um painel onde nada é arrastado) não precisam de um provider próprio:

```ts
makeDragArea(board, { modifiers: [snapToGrid(20)], activation: { touch: { delay: 400 } } });
```

Os itens dela continuam no provider do app e ainda podem ir para qualquer lugar. Veja
[restrições](https://zizigy.github.io/docs/guides/constraints).

</tip>

Um app montado em outro lugar, dentro de uma shadow root ou como um app Vue separado, pode se
juntar a um provider existente: passe `useDnDContext()` para `provideDnDContext(app, context)`
antes de montá-lo. O teste do que está sob o ponteiro e o overlay funcionam através de shadow roots.

## SSR e Nuxt

O provider é seguro para SSR. Listas e itens são renderizados no servidor como qualquer outra
marcação. O overlay e a live region são teleportados e montados só no cliente, então nunca causam
um hydration mismatch. Os ids padrão vêm do `useId()` do Vue e batem entre servidor e cliente.

No Nuxt, o módulo registra o `DnDProvider` globalmente e importa os composables automaticamente:
veja [instalação](https://zizigy.github.io/docs/getting-started/installation#nuxt).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
