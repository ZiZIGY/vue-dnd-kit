---
title: "Migrando da v2"
description: "Leve um app da v2 para a v3 — o que mudou e por quê, a atualização, um mapa de cada API da v2 para a substituta na v3, código antes e depois para os casos comuns, e as armadilhas."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/getting-started/migrating-from-v2"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

A v3 é uma reescrita da v2. O modelo continua: um provider, e composables que você chama nos seus
próprios elementos. Mas a maioria dos nomes e das opções mudou, a ordenação passou para dentro da
biblioteca, e o handler de drop que você escrevia para cada lista vai embora. Esta página mapeia cada
parte da v2 para a v3 e depois mostra os casos comuns antes e depois.

## O que mudou

- **A ordenação vem embutida.** Na v2, uma lista era uma zona de drop, as linhas dela eram
draggables com um payload `[index, items]`, e você ordenava no `onDrop` com
`e.helpers.suggestSort()`. Na v3, `makeSortableList` e `makeSortableItem` fazem isso: a lista
renderiza um **rascunho** do seu array que se reordena enquanto você arrasta, e o drop grava o novo
array no seu ref. A maioria dos handlers de drop da v2 é apagada, não portada.
- **As coisas se movem sozinhas.** As linhas deslizam para os novos lugares (FLIP), o overlay pousa na
sua posição no drop e volta ao lugar no cancelamento. O `<TransitionGroup>` vai embora.
- **Continua um pacote só.** `@vue-dnd-kit/core` contém listas, árvores, multi-drag, modificadores,
sensores e as funções de colisão. O módulo do Nuxt continua; `@vue-dnd-kit/actions` (arrastes
programáticos) e `@vue-dnd-kit/devtools` são novos e opcionais.
- **Um overlay de verdade.** Ele é teleportado para o `body` e mostra um clone profundo, do tamanho da
posição onde vai pousar. Componentes de overlay recebem o arraste como props em vez de ler o
funcionamento interno do provider.
- **Ids, não elementos.** A seleção, os eventos e o estado do arraste usam como chave ids dos seus
dados. Não há mapas de elementos do DOM para ler.
- **Tipos e regras de aceitação** substituem `groups` para draggables simples e alvos. As listas
trocam itens pelo nome do `group`.
- **Decisões antes do drop.** `onBeforeDrop` aceita, recusa, mantém o arraste em andamento ou fica
com parte dos itens. `onDrop` só aplica.
- **Sensores.** A entrada de ponteiro e a de teclado são sensores. A ativação é definida por tipo de
ponteiro, e os arrastes por toque começam com um toque longo, então as listas continuam rolando sob
o dedo.
- **Áreas.** `makeDragArea` substitui `makeConstraintArea` e `makeAutoScroll`, e a rolagem
automática funciona em todo contêiner com rolagem, sem código.
- **A acessibilidade vem ligada por padrão**: atributos ARIA, o foco que volta depois do drop e
anúncios para leitores de tela.

## Atualização

<code-group>

```bash [npm]
npm i @vue-dnd-kit/core@^3
```

```bash [yarn]
yarn add @vue-dnd-kit/core@^3
```

```bash [pnpm]
pnpm add @vue-dnd-kit/core@^3
```

```bash [bun]
bun add @vue-dnd-kit/core@^3
```

</code-group>

<table>
<thead>
  <tr>
    <th>
      Pacote
    </th>
    
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        @vue-dnd-kit/core
      </code>
    </td>
    
    <td>
      2.4.x
    </td>
    
    <td>
      3.x
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/nuxt
      </code>
    </td>
    
    <td>
      1.x
    </td>
    
    <td>
      3.x
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/actions
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      1.x, opcional
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/devtools
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      3.x, opcional
    </td>
  </tr>
</tbody>
</table>

- Um app que tem `"@vue-dnd-kit/core": "^2…"` no `package.json` fica na v2 até a faixa de versões
dizer `^3`.
- Vue **3.5** ou mais novo. A v2 não tinha dependências; a v3 tem uma, `@vueuse/core` (14 ou 15).
- Navegadores: Chrome e Edge 104+, Safari 15.4+, Firefox 104+.
- A v2 e a v3 compartilham o nome do pacote, então um app passa para a v3 de uma vez. Não há camada
de compatibilidade. A documentação da v2 continua disponível no menu de versões no topo da página.

Uma boa ordem de trabalho:

1. Atualize os pacotes e renomeie as props do provider ([abaixo](#the-provider)).
2. Transforme cada lista ordenável em `makeSortableList` e `makeSortableItem`, e apague o handler de
drop dela.
3. Porte os draggables simples e as zonas de drop.
4. Porte as prévias personalizadas para componentes de overlay ou para o slot `#overlay` do provider.
5. Substitua `makeConstraintArea` e `makeAutoScroll` por `makeDragArea`, ou por nada.
6. Apague os contornos da v2: `tabindex` e `aria-grabbed` nos draggables, `touch-action: none` em
itens inteiros, `<TransitionGroup>` em volta das linhas, `markRaw` em volta dos componentes de
prévia.

## Do antigo para o novo

**Sem equivalente** em uma tabela quer dizer que a v3 não tem nada com aquele nome; a célula diz o que
usar no lugar.

### Visão geral

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        DnDProvider
      </code>
    </td>
    
    <td>
      <code>
        DnDProvider
      </code>
      
      , com props novas e um slot <code>
        #overlay
      </code>
      
      .
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
        makeDraggable
      </code>
      
       para arraste livre; <code>
        makeSortableItem
      </code>
      
       para as linhas de uma lista.
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
        makeDroppable
      </code>
      
       para alvos de drop simples; <code>
        makeSortableList
      </code>
      
       ou <code>
        makeSortableTree
      </code>
      
       para listas e árvores.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
    </td>
    
    <td>
      <code>
        makeSelectionArea
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeConstraintArea
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeAutoScroll
      </code>
    </td>
    
    <td>
      Nada: a rolagem automática é automática. <code>
        makeDragArea
      </code>
      
       ou o <code>
        autoScroll
      </code>
      
       de uma lista a ajustam.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnDProvider
      </code>
    </td>
    
    <td>
      <code>
        useDnD
      </code>
      
       para o estado, <code>
        useDnDMonitor
      </code>
      
       para os eventos.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        injectionKey
      </code>
    </td>
    
    <td>
      <code>
        useDnDContext()
      </code>
      
       e <code>
        provideDnDContext(app, context)
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        DragPreview
      </code>
    </td>
    
    <td>
      <code>
        DragPreview
      </code>
      
      : agora o clone de um item arrastado, para overlays próprios.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSnappedOverlayPosition
      </code>
      
      , <code>
        <DragPreview :grid>
      </code>
    </td>
    
    <td>
      O modificador <code>
        snapToGrid
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSort
      </code>
      
      , <code>
        suggestSwap
      </code>
      
      , <code>
        suggestCopy
      </code>
      
      , <code>
        suggestRemove
      </code>
    </td>
    
    <td>
      Embutidos nas listas: veja <a href="#sorting">
        ordenação
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

### O provider

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        autoScrollViewport
      </code>
      
      , desligado a menos que definido
    </td>
    
    <td>
      <code>
        autoScroll
      </code>
      
      : <strong>
        ligado por padrão
      </strong>
      
      , para a janela e todo contêiner com rolagem. <code>
        { threshold, maxSpeed, acceleration }
      </code>
      
      , ou <code>
        false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        previewTo
      </code>
      
      , por padrão renderizado dentro do provider
    </td>
    
    <td>
      <code>
        overlayTo
      </code>
      
      : um seletor ou um elemento, <code>
        'body'
      </code>
      
       por padrão.
    </td>
  </tr>
  
  <tr>
    <td>
      Slot <code>
        #preview="{ preview }"
      </code>
    </td>
    
    <td>
      Slot <code>
        #overlay
      </code>
      
      , com o arraste como props: <code>
        items
      </code>
      
      , <code>
        active
      </code>
      
      , <code>
        over
      </code>
      
      , <code>
        accepted
      </code>
      
      , <code>
        status
      </code>
      
      , <code>
        mode
      </code>
      
      , <code>
        to
      </code>
      
      . Veja <a href="#the-overlay">
        o overlay
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.keys.forDrag
      </code>
      
      , <code>
        forDrop
      </code>
      
      , <code>
        forCancel
      </code>
      
       (definidos em <code>
        useDnDProvider()
      </code>
      
      )
    </td>
    
    <td>
      <code>
        :keyboard="{ keys: { start, drop, cancel } }"
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.step
      </code>
    </td>
    
    <td>
      <code>
        :keyboard="{ step }"
      </code>
      
      : 25 px por padrão, para arrastes livres.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.keys.forMove
      </code>
      
      , <code>
        forMoveFaster
      </code>
      
      , <code>
        keyboard.moveFaster
      </code>
    </td>
    
    <td>
      <strong>
        Sem equivalente.
      </strong>
      
       As setas movem; <kbd value="Shift">
        
      </kbd>
      
       deixa os passos de um arraste livre quatro vezes maiores.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        collision.throttle
      </code>
    </td>
    
    <td>
      <strong>
        Sem equivalente.
      </strong>
      
       <code>
        collision
      </code>
      
       escolhe como o alvo é encontrado: <code>
        pointerFirst
      </code>
      
       (padrão), <code>
        pointerWithin
      </code>
      
      , <code>
        rectIntersection
      </code>
      
      , <code>
        closestCenter
      </code>
      
      , <code>
        closestCorners
      </code>
      
       ou uma função sua.
    </td>
  </tr>
  
  <tr>
    <td>
      Um provider por página, nunca aninhado
    </td>
    
    <td>
      Aninhar funciona: o provider mais próximo controla cada item. Um provider para o app inteiro continua sendo o objetivo.
    </td>
  </tr>
</tbody>
</table>

Props novas sem correspondente na v2: `activation`, `modifiers`, `sensors`, `animation`,
`dropAnimation`, `animateChanges`, `haptics`, `copyModifier`, `overlayFit`, `overlayClass`,
`overlayTransition`, `overlayPreviews`, `announcements`, `screenReaderInstructions` e
`defaultStyles`. O provider também emite `drag-start`, `drag-move`, `drag-over`, `drag-end`,
`drag-cancel`, `drag-resume` e `drag-settle`. Tudo isso está no [guia do provider](https://zizigy.github.io/docs/guides/provider).

### Lendo o estado: `useDnD`

<table>
<thead>
  <tr>
    <th>
      <code>
        useDnDProvider()
      </code>
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        state
      </code>
      
      : <code>
        'dragging'
      </code>
      
      , <code>
        'activating'
      </code>
      
      , <code>
        'selecting'
      </code>
      
      , <code>
        'pending'
      </code>
      
       ou <code>
        null
      </code>
    </td>
    
    <td>
      <code>
        useDnD().status
      </code>
      
      : <code>
        'idle'
      </code>
      
      , <code>
        'activating'
      </code>
      
      , <code>
        'dragging'
      </code>
      
      , <code>
        'dropping'
      </code>
      
       ou <code>
        'selecting'
      </code>
      
      . <code>
        'pending'
      </code>
      
       (um drop assíncrono) é <code>
        'dropping'
      </code>
      
      ; <code>
        null
      </code>
      
       é <code>
        'idle'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointer.value.current
      </code>
    </td>
    
    <td>
      <code>
        useDnD().pointer
      </code>
      
      , depois dos modificadores. Todo evento também tem <code>
        delta
      </code>
      
      , o deslocamento desde o início.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.draggingMap
      </code>
    </td>
    
    <td>
      <code>
        useDnD().active
      </code>
      
      : <code>
        id
      </code>
      
      , <code>
        ids
      </code>
      
      , <code>
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
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.selectedSet
      </code>
      
       (elementos)
    </td>
    
    <td>
      <code>
        useDnD().selection
      </code>
      
       (ids): <code>
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
      
      , <code>
        ids
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hovered.droppable
      </code>
      
      , <code>
        hovered.draggable
      </code>
    </td>
    
    <td>
      <code>
        useDnD().over
      </code>
      
      : <code>
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
        delay.progress
      </code>
      
      , <code>
        distanceProgress
      </code>
    </td>
    
    <td>
      <code>
        useDnD().activation.progress
      </code>
      
      , de <code>
        0
      </code>
      
       a <code>
        1
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        preview.position
      </code>
      
      , <code>
        preview.size
      </code>
      
      , <code>
        preview.render
      </code>
      
      , <code>
        preview.to
      </code>
    </td>
    
    <td>
      <strong>
        Sem equivalente.
      </strong>
      
       A biblioteca posiciona e dimensiona o overlay. Use <code>
        overlayTo
      </code>
      
      , o slot <code>
        #overlay
      </code>
      
       ou componentes de overlay.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.draggableMap
      </code>
      
      , <code>
        droppableMap
      </code>
      
      , os <code>
        visible…Set
      </code>
      
      , <code>
        scrollPosition
      </code>
    </td>
    
    <td>
      <strong>
        Sem equivalente.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Novo: <code>
        useDnD().cancel()
      </code>
      
      , <code>
        position
      </code>
      
      , <code>
        isAutoScrolling
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Os eventos foram para o `useDnDMonitor`: veja [eventos e decisões de drop](#events-and-drop-decisions).
As formas completas estão na [API do useDnD](https://zizigy.github.io/docs/api/use-dnd).

### `makeDraggable`

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDraggable(ref, options, payload)
      </code>
    </td>
    
    <td>
      <code>
        makeDraggable(ref, options)
      </code>
      
      : sem terceiro argumento. As linhas de uma lista usam <code>
        makeSortableItem(ref, { item })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        id
      </code>
      
      , necessário em listas virtuais
    </td>
    
    <td>
      <code>
        id
      </code>
      
      : passe-o a partir dos seus dados, como getter. O padrão vem de <code>
        useId()
      </code>
      
       e é novo a cada instância do componente.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data: () => card
      </code>
    </td>
    
    <td>
      <code>
        data
      </code>
      
      : um valor, um ref ou um getter. Lido de volta como <code>
        active.data
      </code>
      
       e <code>
        active.items[i].data
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups: ['dev']
      </code>
    </td>
    
    <td>
      <code>
        type: 'dev'
      </code>
      
      , comparado com o <code>
        accept
      </code>
      
       dos alvos. Veja <a href="#groups">
        grupos
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        dragHandle: '.handle'
      </code>
    </td>
    
    <td>
      <code>
        handle
      </code>
      
      : um seletor ou um ref de elemento.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifier: { keys, method }
      </code>
    </td>
    
    <td>
      <code>
        canDrag: (event) => event.altKey
      </code>
      
      : um filtro para cada pressionamento.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation: { distance, delay }
      </code>
    </td>
    
    <td>
      <code>
        activation
      </code>
      
       por tipo de ponteiro: <code>
        { mouse: { distance }, touch: { delay, tolerance }, pen }
      </code>
      
      . Com <code>
        distance
      </code>
      
       e <code>
        delay
      </code>
      
       juntos, o arraste começa no que vier primeiro.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation.distance: { x, y, condition }
      </code>
    </td>
    
    <td>
      <strong>
        Sem equivalente.
      </strong>
      
       Uma <code>
        distance
      </code>
      
       por tipo de ponteiro.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        render: markRaw(Preview)
      </code>
    </td>
    
    <td>
      <code>
        overlay: Preview
      </code>
      
      : o componente recebe o arraste como props. Veja <a href="#the-overlay">
        o overlay
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        placementMargins
      </code>
    </td>
    
    <td>
      <strong>
        Sem equivalente.
      </strong>
      
       Um alvo de drop em um item ordenável conta no meio dele (de 25 a 75%); árvores aninham com <code>
        nesting: 'hover'
      </code>
      
      . Veja <a href="/docs/guides/drag-and-drop#drop-into-a-sortable-item">
        drop dentro de um item ordenável
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onSelfDragStart
      </code>
      
      , <code>
        onSelfDragMove
      </code>
      
      , <code>
        onSelfDragEnd
      </code>
      
      , <code>
        onSelfDragCancel
      </code>
    </td>
    
    <td>
      <strong>
        Sem equivalente
      </strong>
      
       no draggable: <code>
        useDnDMonitor
      </code>
      
      , ou <code>
        watch(isDragging)
      </code>
      
      . Veja <a href="#events-and-drop-decisions">
        eventos
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onHover
      </code>
      
      , <code>
        onLeave
      </code>
      
      , e o <code>
        onDragStart
      </code>
      
       dele… para arrastes sobre ele
    </td>
    
    <td>
      Um <code>
        makeDroppable
      </code>
      
       no mesmo elemento: <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Retorna <code>
        isDragging
      </code>
      
      , <code>
        selected
      </code>
    </td>
    
    <td>
      O mesmo.
    </td>
  </tr>
  
  <tr>
    <td>
      Retorna <code>
        isDragOver
      </code>
    </td>
    
    <td>
      Itens ordenáveis retornam <code>
        indicator
      </code>
      
       (com <code>
        placeholder: 'indicator'
      </code>
      
      ) e <code>
        isPlaceholder
      </code>
      
      ; alvos retornam <code>
        placement
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Retorna <code>
        isAllowed
      </code>
    </td>
    
    <td>
      <strong>
        Sem equivalente
      </strong>
      
       nos draggables. Alvos retornam <code>
        isAccepting
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Novo: <code>
        label
      </code>
      
      , <code>
        axis
      </code>
      
      , <code>
        modifiers
      </code>
      
      , <code>
        keyboardMode
      </code>
      
      , <code>
        overlay: false
      </code>
      
       com o <code>
        transform
      </code>
      
       retornado, <code>
        dropAnimation
      </code>
      
      , <code>
        attributes
      </code>
      
      , <code>
        native
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### `makeDroppable`

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDroppable(ref, options, () => items)
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable(ref, options)
      </code>
      
      . Uma zona que contém uma lista é um <code>
        makeSortableList
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      : <code>
        '*'
      </code>
      
      , um tipo, uma lista de tipos ou uma função.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groupMatch: 'every'
      </code>
      
      , <code>
        'some'
      </code>
    </td>
    
    <td>
      <code>
        acceptMode: 'all'
      </code>
      
      , <code>
        'some'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onEnter
      </code>
      
      , <code>
        events.onLeave
      </code>
    </td>
    
    <td>
      <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      : opções próprias, sem objeto <code>
        events
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onDrop
      </code>
      
      , que podia retornar <code>
        false
      </code>
      
       ou uma promise
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       decide, <code>
        onDrop
      </code>
      
       aplica. Veja <a href="#events-and-drop-decisions">
        decisões de drop
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onValidate
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
      , retornando os ids que ficam.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data
      </code>
    </td>
    
    <td>
      <code>
        data
      </code>
      
      , lido de volta como <code>
        over.data
      </code>
      
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
      <code>
        disabled
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Retorna <code>
        isAllowed
      </code>
    </td>
    
    <td>
      <code>
        isAccepting
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Retorna <code>
        isDragOver
      </code>
      
      : <code>
        { top, right, bottom, left, center }
      </code>
    </td>
    
    <td>
      <code>
        isOver
      </code>
      
       (um booleano), e <code>
        placement
      </code>
      
      : <code>
        { top, right, bottom, left }
      </code>
      
      , as metades em que o ponteiro está. Não há <code>
        center
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Novo: <code>
        id
      </code>
      
      , <code>
        label
      </code>
      
      , <code>
        priority
      </code>
      
      , <code>
        overOverlay
      </code>
      
      , <code>
        overDropAnimation
      </code>
      
      , <code>
        external
      </code>
      
       (arquivos do computador).
    </td>
  </tr>
</tbody>
</table>

### O evento de drop

<table>
<thead>
  <tr>
    <th>
      <code>
        IDragEvent
      </code>
      
       da v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        e.draggedItems
      </code>
    </td>
    
    <td>
      <code>
        e.active.items
      </code>
      
      : <code>
        { id, item, data, label, type }
      </code>
      
       cada um, começando pelo que foi pego. Listas recebem <code>
        e.items
      </code>
      
       e <code>
        e.keys
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.draggedItems[0].data
      </code>
    </td>
    
    <td>
      <code>
        e.active.data
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.draggedItems[i].index
      </code>
      
      , <code>
        .items
      </code>
    </td>
    
    <td>
      Listas: <code>
        e.from
      </code>
      
      , <code>
        { list, index }
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.dropZone
      </code>
      
      : <code>
        items
      </code>
      
      , <code>
        placement
      </code>
      
      , <code>
        data
      </code>
    </td>
    
    <td>
      <code>
        e.over
      </code>
      
      : <code>
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
      
      . Listas: <code>
        e.to
      </code>
      
      , <code>
        { list, index }
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.hoveredDraggable
      </code>
    </td>
    
    <td>
      <strong>
        Sem equivalente
      </strong>
      
      : as listas calculam <code>
        e.to.index
      </code>
      
       sozinhas.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSort()
      </code>
    </td>
    
    <td>
      As listas gravam o drop; <code>
        e.result
      </code>
      
       contém o novo array de cada lista que ele muda.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSwap()
      </code>
    </td>
    
    <td>
      <code>
        behavior: 'swap'
      </code>
      
       na lista; <code>
        e.partner
      </code>
      
       é o item com que ele trocou de lugar.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestCopy()
      </code>
    </td>
    
    <td>
      <code>
        group: { name, pull: 'clone' }
      </code>
      
       ou a tecla de cópia (<kbd value="Alt">
        
      </kbd>
      
      ), com o <code>
        clone
      </code>
      
       da lista; <code>
        e.mode
      </code>
      
       é <code>
        'copy'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestRemove()
      </code>
    </td>
    
    <td>
      <code>
        e.source.remove()
      </code>
      
       em um alvo de drop, ou o <code>
        dropOutside: 'remove'
      </code>
      
       da lista.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        result.sameList
      </code>
    </td>
    
    <td>
      <code>
        e.sameList
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.insertAt
      </code>
      
      , <code>
        removeAt
      </code>
      
      , <code>
        removeIndexes
      </code>
      
      , <code>
        swapAt
      </code>
      
      , <code>
        getInsertSide
      </code>
      
      , <code>
        isAtZoneStart
      </code>
      
      , <code>
        isAtZoneEnd
      </code>
    </td>
    
    <td>
      <strong>
        Sem equivalente.
      </strong>
      
       As listas não precisam deles; para um alvo simples, mude os seus dados como quiser.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.provider
      </code>
    </td>
    
    <td>
      <code>
        useDnD()
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Novo: <code>
        e.pointer
      </code>
      
      , <code>
        e.delta
      </code>
      
      , <code>
        e.position
      </code>
      
       (onde colocar um item solto em um quadro), <code>
        e.mode
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### Ordenação

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Uma lista <code>
        makeDroppable
      </code>
      
       com <code>
        () => items
      </code>
    </td>
    
    <td>
      <code>
        makeSortableList(listRef, { items })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Uma linha <code>
        makeDraggable
      </code>
      
       com <code>
        () => [index, items]
      </code>
    </td>
    
    <td>
      <code>
        makeSortableItem(el, { item: () => props.task })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Renderizar o seu array
    </td>
    
    <td>
      Renderizar os <code>
        items
      </code>
      
       retornados: o rascunho que se reordena enquanto você arrasta.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestSort('vertical')
      </code>
      
      , <code>
        suggestSort('horizontal')
      </code>
    </td>
    
    <td>
      <code>
        strategy: 'vertical'
      </code>
      
       (padrão), <code>
        'horizontal'
      </code>
      
       ou <code>
        'grid'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Comparações de identidade para achar os arrays de origem e de destino, e depois atribuir <code>
        sourceItems
      </code>
      
       e <code>
        targetItems
      </code>
    </td>
    
    <td>
      Nada: o drop grava cada lista que ele muda.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <TransitionGroup>
      </code>
    </td>
    
    <td>
      Embutido. <code>
        animateChanges: true
      </code>
      
       anima as mudanças que nenhum arraste fez (adicionar, remover, embaralhar).
    </td>
  </tr>
  
  <tr>
    <td>
      Uma linha de inserção a partir de <code>
        isDragOver.top
      </code>
      
      , <code>
        .bottom
      </code>
    </td>
    
    <td>
      <code>
        placeholder: 'indicator'
      </code>
      
       e o <code>
        indicator.side
      </code>
      
       do item. Veja <a href="/docs/guides/sortable-lists#an-insertion-line">
        uma linha de inserção
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestSwap()
      </code>
    </td>
    
    <td>
      <code>
        behavior: 'swap'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Uma paleta que só copia (<code>
        suggestCopy()
      </code>
      
       e uma flag <code>
        copyOnly
      </code>
      
      )
    </td>
    
    <td>
      <code>
        group: { name, pull: 'clone', put: false }
      </code>
      
      , <code>
        sort: false
      </code>
      
       e <code>
        clone
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Uma lixeira com <code>
        suggestRemove()
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable(trash, { onDrop: (e) => e.source?.remove() })
      </code>
      
      , ou <code>
        dropOutside: 'remove'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Pinia ou dados imutáveis: atribuir o resultado você mesmo
    </td>
    
    <td>
      <code>
        items
      </code>
      
       como getter, depois <code>
        e.preventDefault()
      </code>
      
       no <code>
        onDrop
      </code>
      
       e aplicar <code>
        e.result
      </code>
      
      . Veja <a href="/docs/guides/shared-lists#controlled-lists">
        listas controladas
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Uma árvore recursiva: um droppable por pasta e <code>
        applyToTree
      </code>
    </td>
    
    <td>
      <code>
        makeSortableTree
      </code>
      
      : um contêiner só, linhas renderizadas de forma plana com a profundidade delas. Veja <a href="/docs/guides/trees">
        árvores
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Grupos aninhados com <code>
        v-model
      </code>
      
       (um droppable por grupo)
    </td>
    
    <td>
      Uma lista dentro de uma lista, todas em um mesmo <code>
        group
      </code>
      
      , cada uma com <code>
        items: defineModel()
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Listas virtuais: <code>
        id
      </code>
      
       em todo draggable
    </td>
    
    <td>
      Passe o rascunho para o virtualizador, <code>
        id: () => props.item.id
      </code>
      
       nas linhas. Veja <a href="/docs/guides/virtual-lists">
        listas virtuais
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

O código antes e depois está [abaixo](#a-sortable-list). Tudo sobre listas está em
[listas ordenáveis](https://zizigy.github.io/docs/guides/sortable-lists) e [listas que compartilham itens](https://zizigy.github.io/docs/guides/shared-lists).

### Grupos

A v2 tinha uma opção `groups` para tudo. A v3 a divide em duas:

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDraggable(el, { groups: ['dev'] })
      </code>
    </td>
    
    <td>
      <code>
        makeDraggable(el, { type: 'dev' })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDroppable(el, { groups: ['dev'] })
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable(el, { accept: 'dev' })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups: ['dev', 'ops']
      </code>
      
       em uma zona
    </td>
    
    <td>
      <code>
        accept: ['dev', 'ops']
      </code>
      
      , ou uma função: <code>
        ({ active, items, types }) => boolean
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups: []
      </code>
      
      , ou nenhum
    </td>
    
    <td>
      <code>
        type
      </code>
      
       ou <code>
        accept
      </code>
      
       deixados de fora. As regras da v2 valem: um draggable sem tipo se encaixa em qualquer regra, e um alvo sem <code>
        accept
      </code>
      
       aceita tudo.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groupMatch: 'every'
      </code>
      
      , <code>
        'some'
      </code>
    </td>
    
    <td>
      <code>
        acceptMode: 'all'
      </code>
      
      , <code>
        'some'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
      
       na zona de uma lista e nas linhas dela
    </td>
    
    <td>
      <code>
        group: 'board'
      </code>
      
       no <code>
        makeSortableList
      </code>
      
      . <code>
        group: { name, pull, put }
      </code>
      
       diz o que pode sair e entrar.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
      
       no <code>
        makeSelectionArea
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Uma lista sem `group` é um grupo próprio e não troca itens com nenhuma outra lista. Na v2, uma zona
sem grupos aceitava tudo. Veja [quais arrastes um alvo aceita](https://zizigy.github.io/docs/guides/drag-and-drop#which-drags-a-target-takes).

### O overlay

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Uma prévia renderizada no provider, teleportada com <code>
        previewTo
      </code>
    </td>
    
    <td>
      Sempre teleportado, para o <code>
        body
      </code>
      
       ou para <code>
        overlayTo
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Um clone: a mesma tag, o <code>
        innerHTML
      </code>
      
       e o tamanho
    </td>
    
    <td>
      Um clone profundo: valores de formulário, pixels de <code>
        <canvas>
      </code>
      
      , estilos herdados e células de tabela vêm junto. Marque o que fica para trás com <code>
        data-dnd-no-clone
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        render: markRaw(Preview)
      </code>
      
      , que lê <code>
        useDnDProvider().entities
      </code>
    </td>
    
    <td>
      <code>
        overlay: Preview
      </code>
      
      , que recebe <code>
        items
      </code>
      
      , <code>
        active
      </code>
      
      , <code>
        over
      </code>
      
      , <code>
        accepted
      </code>
      
      , <code>
        status
      </code>
      
      , <code>
        mode
      </code>
      
       e <code>
        to
      </code>
      
       como props. Sem <code>
        markRaw
      </code>
      
      ; use um <code>
        shallowRef
      </code>
      
       para trocá-lo.
    </td>
  </tr>
  
  <tr>
    <td>
      O slot <code>
        #preview
      </code>
      
      , posicionado a partir de <code>
        preview.position
      </code>
    </td>
    
    <td>
      O slot <code>
        #overlay
      </code>
      
      : a biblioteca posiciona e dimensiona a caixa. Se não renderizar nada, volta a usar o clone.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnDProvider().preview.render.value = …
      </code>
    </td>
    
    <td>
      O slot <code>
        #overlay
      </code>
      
      , ou um <code>
        shallowRef
      </code>
      
       passado como <code>
        overlay
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Uma aparência nova sobre uma zona, a partir de <code>
        onEnter
      </code>
      
       e <code>
        onLeave
      </code>
    </td>
    
    <td>
      <code>
        overOverlay
      </code>
      
       no <code>
        makeDroppable
      </code>
      
       ou em uma lista, ou ler <code>
        over
      </code>
      
       no componente de overlay. Veja <a href="/docs/guides/overlay#targets-that-change-the-overlay">
        alvos que mudam o overlay
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview v-slot="{ draggingMap }">
      </code>
    </td>
    
    <td>
      Os <code>
        items
      </code>
      
       das props do overlay; <code>
        <DragPreview :id="item.id" />
      </code>
      
       renderiza um clone.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview :grid>
      </code>
      
      , <code>
        makeSnappedOverlayPosition
      </code>
    </td>
    
    <td>
      O modificador <code>
        snapToGrid
      </code>
      
      . Ele encaixa onde os alvos são encontrados e também a <code>
        position
      </code>
      
       do drop, não só a imagem.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <Transition>
      </code>
      
       ou o <code>
        AnimatePresence
      </code>
      
       do motion em volta do <code>
        DragPreview
      </code>
    </td>
    
    <td>
      <code>
        overlay-class
      </code>
      
       com <code>
        @starting-style
      </code>
      
       para o início do arraste, <code>
        dropAnimation
      </code>
      
       para o pouso, <code>
        overlayTransition
      </code>
      
       entre componentes. Veja <a href="/docs/guides/animations#the-overlay-lift-tilt-settle">
        erguer, inclinar, assentar
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        .dnd-kit-preview
      </code>
    </td>
    
    <td>
      <code>
        [data-dnd-overlay]
      </code>
      
       (<code>
        "dragging"
      </code>
      
      , <code>
        "dropping"
      </code>
      
      ) na caixa, <code>
        [data-dnd-overlay-content]
      </code>
      
       dentro dela.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        preview.size
      </code>
      
      , mantido atualizado à mão
    </td>
    
    <td>
      A caixa assume o tamanho da posição onde vai pousar (<code>
        overlayFit
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      A prévia some no drop
    </td>
    
    <td>
      Ela pousa na sua posição, ou volta ao lugar no cancelamento.
    </td>
  </tr>
</tbody>
</table>

Mais no [guia do overlay](https://zizigy.github.io/docs/guides/overlay).

### Seleção e multi-drag

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        selected
      </code>
      
      , retornado por <code>
        makeDraggable
      </code>
    </td>
    
    <td>
      <code>
        selected
      </code>
      
      , retornado por <code>
        makeDraggable
      </code>
      
       e <code>
        makeSortableItem
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.selectedSet
      </code>
      
      , um conjunto de elementos
    </td>
    
    <td>
      <code>
        useDnD().selection
      </code>
      
      , com ids como chave.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
      
      : Ctrl (<code>
        ControlLeft
      </code>
      
      ) pressionado por padrão
    </td>
    
    <td>
      Nenhuma tecla por padrão: pressionar o espaço vazio da área desenha o retângulo. <code>
        modifier: { keys: ['Control'], method: 'every' }
      </code>
      
       traz o Ctrl de volta.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifier.keys
      </code>
      
       como <code>
        KeyboardEvent.code
      </code>
    </td>
    
    <td>
      <code>
        KeyboardEvent.key
      </code>
      
       (<code>
        'Control'
      </code>
      
      , <code>
        'Shift'
      </code>
      
      ) ou <code>
        .code
      </code>
      
       (<code>
        'ControlLeft'
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        strategy: 'toggle'
      </code>
      
      , <code>
        'select'
      </code>
    </td>
    
    <td>
      O mesmo.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onSelected(elements)
      </code>
    </td>
    
    <td>
      <code>
        onSelected(ids)
      </code>
      
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
      O mesmo.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestSort()
      </code>
      
       movendo a seleção em bloco
    </td>
    
    <td>
      As listas a movem. <code>
        multiple: 'group'
      </code>
      
       (padrão), <code>
        'gaps'
      </code>
      
       ou <code>
        'stack'
      </code>
      
       diz o que os outros itens fazem no caminho.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onValidate
      </code>
      
       para seleções mistas
    </td>
    
    <td>
      <code>
        acceptMode: 'some'
      </code>
      
       e <code>
        onBeforeDrop
      </code>
      
       retornando ids. Veja <a href="/docs/guides/multi-drag#taking-only-some">
        aceitar só alguns
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

Mais em [multi-drag e seleção](https://zizigy.github.io/docs/guides/multi-drag).

### Eixos, limites e encaixe

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeConstraintArea(el, { axis: 'x' })
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea(el, { axis: 'x' })
      </code>
      
      , para os arrastes que começam dentro dela. <code>
        axis
      </code>
      
       também funciona em um draggable, uma lista, uma árvore ou um item.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        axis: 'both'
      </code>
    </td>
    
    <td>
      <code>
        axis
      </code>
      
       deixado de fora.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToArea: true
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea(el, { restrictToArea: true })
      </code>
      
      , ou os modificadores <code>
        restrictToParent
      </code>
      
       e <code>
        restrictToElement(el)
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Um provider por região, para manter as regras separadas
    </td>
    
    <td>
      Um provider e um <code>
        makeDragArea
      </code>
      
       por região. Os itens dela ainda podem ir para qualquer lugar.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview :grid="20">
      </code>
      
      , <code>
        makeSnappedOverlayPosition
      </code>
    </td>
    
    <td>
      <code>
        snapToGrid(20)
      </code>
      
       ou <code>
        snapToGrid({ x, y, origin, smooth })
      </code>
      
      , nos <code>
        modifiers
      </code>
      
       do provider, de uma área, de uma lista ou de um draggable.
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Novo: <code>
        restrictToWindowEdges
      </code>
      
      , <code>
        restrictToFirstScrollableAncestor
      </code>
      
      , <code>
        snapCenterToCursor
      </code>
      
       e modificadores seus.
    </td>
  </tr>
</tbody>
</table>

Mais em [eixos, limites e grades](https://zizigy.github.io/docs/guides/constraints).

### Rolagem automática

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        <DnDProvider :autoScrollViewport="true">
      </code>
      
      , desligado por padrão
    </td>
    
    <td>
      Ligado por padrão, para a janela e todo contêiner com rolagem. <code>
        :auto-scroll="false"
      </code>
      
       a desliga.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeAutoScroll(el, { threshold, speed })
      </code>
    </td>
    
    <td>
      Nada: qualquer elemento com <code>
        overflow: auto
      </code>
      
       ou <code>
        scroll
      </code>
      
       rola. Para ajustar um: <code>
        makeDragArea(el, { autoScroll: { … } })
      </code>
      
       ou o <code>
        autoScroll
      </code>
      
       da lista.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        threshold
      </code>
      
       em px, ou por lado
    </td>
    
    <td>
      <code>
        threshold
      </code>
      
      : uma fração do tamanho do contêiner (<code>
        0.2
      </code>
      
      ), entre 24 e 96 px. <strong>
        Sem equivalente
      </strong>
      
       para limiares por lado.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        speed
      </code>
      
      , um multiplicador
    </td>
    
    <td>
      <code>
        maxSpeed
      </code>
      
       (25 px por frame) e <code>
        acceleration
      </code>
      
       (10).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled: true
      </code>
    </td>
    
    <td>
      <code>
        autoScroll: false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isScrolling
      </code>
    </td>
    
    <td>
      <code>
        isAutoScrolling
      </code>
      
      , de <code>
        makeDragArea
      </code>
      
       ou de <code>
        useDnD()
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### Teclado e acessibilidade

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        tabindex="0"
      </code>
      
       em todo draggable
    </td>
    
    <td>
      Definido para você, com <code>
        role
      </code>
      
      , <code>
        aria-roledescription
      </code>
      
      , <code>
        aria-describedby
      </code>
      
      , <code>
        aria-disabled
      </code>
      
       e <code>
        aria-pressed
      </code>
      
      . Os seus próprios atributos prevalecem.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        :aria-grabbed="isDragging"
      </code>
      
       à mão
    </td>
    
    <td>
      Remova: <code>
        aria-pressed
      </code>
      
       acompanha o arraste.
    </td>
  </tr>
  
  <tr>
    <td>
      Teclas definidas em <code>
        useDnDProvider().keyboard.keys
      </code>
    </td>
    
    <td>
      A prop <code>
        keyboard
      </code>
      
       do provider. As combinações batem com <code>
        event.code
      </code>
      
       ou <code>
        event.key
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      As setas movem a prévia em <code>
        keyboard.step
      </code>
    </td>
    
    <td>
      Arrastes livres: <code>
        keyboard.step
      </code>
      
       px. Listas: de posição em posição, e para a próxima lista do grupo. <code>
        keyboardMode: 'droppables'
      </code>
      
       salta entre alvos.
    </td>
  </tr>
  
  <tr>
    <td>
      Remapear as setas (<code>
        forMove
      </code>
      
      , <code>
        forMoveFaster
      </code>
      
      )
    </td>
    
    <td>
      <strong>
        Sem equivalente.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      Sem anúncios
    </td>
    
    <td>
      Uma live region anuncia cada início de arraste, movimento, drop e cancelamento. <code>
        label
      </code>
      
       dá nome às coisas; <code>
        announcements
      </code>
      
       e <code>
        screenReaderInstructions
      </code>
      
       mudam o texto.
    </td>
  </tr>
</tbody>
</table>

Mais em [acessibilidade](https://zizigy.github.io/docs/guides/accessibility).

### Eventos e decisões de drop

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        events.onSelfDragStart
      </code>
      
       do draggable
    </td>
    
    <td>
      <code>
        useDnDMonitor({ onDragStart })
      </code>
      
      , verificando <code>
        active.ids
      </code>
      
      . Para uma classe, <code>
        isDragging
      </code>
      
       basta.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragMove
      </code>
    </td>
    
    <td>
      O <code>
        onDragMove
      </code>
      
       do monitor.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragEnd
      </code>
      
      , solto ou cancelado
    </td>
    
    <td>
      O <code>
        onDragEnd
      </code>
      
       do monitor (um drop) e <code>
        onDragCancel
      </code>
      
      . <code>
        onDragSettle
      </code>
      
       ouve os dois, depois que o overlay pousou.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragCancel
      </code>
    </td>
    
    <td>
      O <code>
        onDragCancel
      </code>
      
       do monitor.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onHover
      </code>
      
      , <code>
        onLeave
      </code>
      
       do draggable, e o <code>
        onDragStart
      </code>
      
       dele… para arrastes sobre ele
    </td>
    
    <td>
      <code>
        makeDroppable
      </code>
      
       no elemento: <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      . As linhas de uma lista não precisam de nada.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onEnter
      </code>
      
      , <code>
        onLeave
      </code>
      
       do droppable
    </td>
    
    <td>
      <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onDrop
      </code>
      
       do droppable
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       decide, depois <code>
        onDrop
      </code>
      
       aplica. <code>
        onDrop
      </code>
      
       é síncrono, e o que ele retorna é ignorado.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onValidate
      </code>
      
       do droppable
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
      , com <code>
        acceptMode: 'some'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Novo: <code>
        @drag-start
      </code>
      
       … <code>
        @drag-settle
      </code>
      
       do provider, e <code>
        onDragOver
      </code>
      
      , <code>
        onBeforeDrop
      </code>
      
       e <code>
        onDragResume
      </code>
      
       do monitor.
    </td>
  </tr>
</tbody>
</table>

Um `onDrop` da v2 podia retornar um valor, ou uma promise de um valor, para decidir o drop. Na v3 esse
é o papel do `onBeforeDrop`, em listas, árvores, alvos de drop e monitores:

<table>
<thead>
  <tr>
    <th>
      O <code>
        onDrop
      </code>
      
       da v2 retorna
    </th>
    
    <th>
      O <code>
        onBeforeDrop
      </code>
      
       da v3 retorna
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Nada, ou <code>
        true
      </code>
      
      : o drop é concluído
    </td>
    
    <td>
      <code>
        'accept'
      </code>
      
      , <code>
        true
      </code>
      
       ou nada.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        false
      </code>
      
      : este drop é descartado, o arraste continua ativo
    </td>
    
    <td>
      <code>
        'continue'
      </code>
      
      . <strong>
        <code>
          false
        </code>
        
         agora recusa o drop.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      Uma promise rejeitada, ou um throw: o arraste é cancelado
    </td>
    
    <td>
      <code>
        'reject'
      </code>
      
       ou <code>
        false
      </code>
      
      . Um throw também rejeita.
    </td>
  </tr>
  
  <tr>
    <td>
      Uma promise; enquanto isso <code>
        state
      </code>
      
       é <code>
        'pending'
      </code>
    </td>
    
    <td>
      Uma promise; enquanto isso <code>
        status
      </code>
      
       é <code>
        'dropping'
      </code>
      
       e o overlay espera com <code>
        data-dnd-overlay="dropping"
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onValidate
      </code>
      
       retorna <code>
        IDragItem[]
      </code>
    </td>
    
    <td>
      Um array de ids: só esses são soltos, os outros voltam ao lugar.
    </td>
  </tr>
</tbody>
</table>

Os monitores respondem primeiro, depois o alvo. Então o `onDrop` do alvo roda, uma lista grava os
novos arrays, e o `onDragEnd` vem em seguida. Mais em [decidindo um drop](https://zizigy.github.io/docs/guides/drop-decisions)
e na [API de eventos](https://zizigy.github.io/docs/api/events).

### Tipos

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        IDragEvent
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
      
       (alvos, monitores), <code>
        SortableDropEvent
      </code>
      
       (listas), <code>
        DnDEndEvent
      </code>
      
       (<code>
        onDragEnd
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDragItem
      </code>
    </td>
    
    <td>
      <code>
        DragItem
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDropZoneContext
      </code>
    </td>
    
    <td>
      <code>
        Over
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IHoveredDraggableContext
      </code>
    </td>
    
    <td>
      <strong>
        Sem equivalente.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ISuggestSortResult
      </code>
      
      , <code>
        ISuggestSwapResult
      </code>
      
      , <code>
        ISuggestCopyResult
      </code>
      
      , <code>
        ISuggestRemoveResult
      </code>
    </td>
    
    <td>
      <code>
        SortableDropEvent
      </code>
      
      : <code>
        result
      </code>
      
      , <code>
        to
      </code>
      
      , <code>
        mode
      </code>
      
      , <code>
        partner
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDropValidateEvent
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
      
      , no <code>
        onBeforeDrop
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IPlacement
      </code>
    </td>
    
    <td>
      <code>
        Placement
      </code>
      
      , sem <code>
        center
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ICoordinates
      </code>
    </td>
    
    <td>
      <code>
        Coordinates
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDragActivationOptions
      </code>
    </td>
    
    <td>
      <code>
        ActivationOptions
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IAutoScrollOptions
      </code>
    </td>
    
    <td>
      <code>
        AutoScrollOptions
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        TDnDState
      </code>
    </td>
    
    <td>
      <code>
        DnDStatus
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDnDProviderExternal
      </code>
    </td>
    
    <td>
      <code>
        DnDState
      </code>
      
      , o que <code>
        useDnD()
      </code>
      
       retorna.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDraggableEvents
      </code>
      
      , <code>
        IDroppableEvents
      </code>
    </td>
    
    <td>
      Callbacks em <code>
        DraggableOptions
      </code>
      
      , <code>
        DroppableOptions
      </code>
      
       e <code>
        DnDMonitor
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### Nuxt

```bash
npm i @vue-dnd-kit/nuxt@^3 @vue-dnd-kit/core@^3
```

<table>
<thead>
  <tr>
    <th>
      v2 (<code>
        @vue-dnd-kit/nuxt
      </code>
      
       1.x)
    </th>
    
    <th>
      v3 (<code>
        @vue-dnd-kit/nuxt
      </code>
      
       3.x)
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Importa automaticamente <code>
        makeDraggable
      </code>
      
      , <code>
        makeDroppable
      </code>
      
      , <code>
        makeSelectionArea
      </code>
      
      , <code>
        makeConstraintArea
      </code>
      
      , <code>
        makeAutoScroll
      </code>
      
      , <code>
        useDnDProvider
      </code>
    </td>
    
    <td>
      Importa automaticamente <code>
        makeDraggable
      </code>
      
      , <code>
        makeDroppable
      </code>
      
      , <code>
        makeSortableList
      </code>
      
      , <code>
        makeSortableItem
      </code>
      
      , <code>
        makeSortableTree
      </code>
      
      , <code>
        makeSelectionArea
      </code>
      
      , <code>
        makeDragArea
      </code>
      
      , <code>
        useDnD
      </code>
      
      , <code>
        useDnDMonitor
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Nenhum tipo importado automaticamente
    </td>
    
    <td>
      Os tipos principais são (<code>
        DnDEvent
      </code>
      
      , <code>
        SortableDropEvent
      </code>
      
      , <code>
        OverlayProps
      </code>
      
      …). Os genéricos (<code>
        Key
      </code>
      
      , <code>
        Active
      </code>
      
      , <code>
        Over
      </code>
      
      ) são importados à mão.
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Modificadores, funções de colisão e sensores sob demanda: <code>
        vueDndKit: { autoImports: { modifiers: true, collision: true, sensors: true } }
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        DnDProvider
      </code>
      
       e <code>
        DragPreview
      </code>
      
       globais
    </td>
    
    <td>
      O mesmo, com uma opção <code>
        prefix
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview />
      </code>
      
       no layout, dentro do provider
    </td>
    
    <td>
      Remova: o provider renderiza o overlay. <code>
        DragPreview
      </code>
      
       recebe um <code>
        id
      </code>
      
       e fica dentro de componentes de overlay.
    </td>
  </tr>
  
  <tr>
    <td>
      Peer <code>
        @vue-dnd-kit/core
      </code>
      
       2
    </td>
    
    <td>
      Peer <code>
        @vue-dnd-kit/core
      </code>
      
       3; Nuxt 4.
    </td>
  </tr>
</tbody>
</table>

`modules: ['@vue-dnd-kit/nuxt']` no `nuxt.config.ts` continua como estava. Veja
[instalação](https://zizigy.github.io/docs/getting-started/installation#nuxt).

## Antes e depois

### Um draggable e uma zona de drop

**v2**

```vue [Card.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ card: Card }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  groups: ['task'],
  dragHandle: '.handle',
  data: () => props.card,
});
</script>

<template>
  <div ref="el" tabindex="0" :class="{ dragging: isDragging }">
    <span class="handle">⋮⋮</span>
    {{ card.title }}
  </div>
</template>
```

```vue [Zone.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable } from '@vue-dnd-kit/core';

const emit = defineEmits<{ drop: [cards: Card[]] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragOver, isAllowed } = makeDroppable(el, {
  groups: ['task'],
  events: {
    onDrop: (e) => emit('drop', e.draggedItems.map((item) => item.data as Card)),
  },
});
</script>

<template>
  <div ref="el" :class="{ over: isDragOver && isAllowed }"><slot /></div>
</template>
```

**v3**

```vue [Card.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ card: Card }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  id: () => props.card.id,   // read back as `active.id`
  type: 'task',              // matched by the targets' `accept`
  handle: '.handle',
  data: () => props.card,
});
</script>

<template>
  <div ref="el" :class="{ dragging: isDragging }">
    <button type="button" class="handle" :aria-label="`Move ${card.title}`">⋮⋮</button>
    {{ card.title }}
  </div>
</template>
```

```vue [Zone.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable } from '@vue-dnd-kit/core';

const emit = defineEmits<{ drop: [cards: Card[]] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isOver, isAccepting } = makeDroppable(el, {
  accept: 'task',
  onDrop: (e) => emit('drop', e.active.items.map((item) => item.data as Card)),
});
</script>

<template>
  <div ref="el" :class="{ over: isOver && isAccepting }"><slot /></div>
</template>
```

- O card recebe `tabindex`, `role` e os atributos `aria-*` sozinho. Um handle `<button>` pode receber
foco, e os arrastes por teclado começam a partir dele.
- `groups` virou `type` no draggable e `accept` no alvo. Os callbacks saíram do objeto `events`.
- `isOver` sem `isAccepting` é um alvo que recusa o arraste: um drop ali volta ao lugar.

### Uma lista ordenável

**v2**

```vue [TaskList.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable, type IDragEvent } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const tasks = defineModel<Task[]>({ required: true });
const el = useTemplateRef<HTMLElement>('el');

makeDroppable(
  el,
  {
    events: {
      onDrop(e: IDragEvent) {
        const r = e.helpers.suggestSort('vertical');
        if (r) tasks.value = r.targetItems as Task[];
      },
    },
  },
  () => tasks.value,
);
</script>

<template>
  <div ref="el">
    <TransitionGroup name="list">
      <TaskItem v-for="(task, index) in tasks" :key="task.id" :task="task" :index="index" :tasks="tasks" />
    </TransitionGroup>
  </div>
</template>
```

```vue [TaskItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ task: Task; index: number; tasks: Task[] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, { id: props.task.id }, () => [props.index, props.tasks]);
</script>

<template>
  <div ref="el" :class="{ 'is-dragging': isDragging }">{{ task.title }}</div>
</template>
```

**v3**

```vue [TaskList.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const tasks = defineModel<Task[]>({ required: true });
const el = useTemplateRef<HTMLElement>('el');

const { items } = makeSortableList(el, { items: tasks });
</script>

<template>
  <ul ref="el">
    <TaskItem v-for="task in items" :key="task.id" :task="task" />
  </ul>
</template>
```

```vue [TaskItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ task: Task }>();
const el = useTemplateRef<HTMLElement>('el');

const { isPlaceholder } = makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <li ref="el" :class="{ slot: isPlaceholder }">{{ task.title }}</li>
</template>
```

- Renderize `items`, o rascunho: ele se reordena enquanto você arrasta. `tasks` recebe a nova ordem no
drop, e `defineModel` emite `update:modelValue`.
- Sem índice, sem payload, sem `onDrop`, sem `<TransitionGroup>`: as linhas deslizam sozinhas.
- A linha arrastada fica na lista como a posição onde vai pousar. Estilize-a com `isPlaceholder` ou
`[data-dnd-placeholder]` em vez de escondê-la.

### Listas que compartilham itens

**v2**

```ts [Board.vue]
// Each column's makeDroppable calls this from its onDrop, with its array as the payload.
function applySort(e: IDragEvent) {
  const r = e.helpers.suggestSort('vertical');
  if (!r) return;

  const src = e.draggedItems[0]?.items;
  const tgt = e.hoveredDraggable?.items ?? e.dropZone?.items;

  if (src === todo.value) todo.value = r.sourceItems as Task[];
  else if (src === done.value) done.value = r.sourceItems as Task[];

  if (!r.sameList) {
    if (tgt === todo.value) todo.value = r.targetItems as Task[];
    else if (tgt === done.value) done.value = r.targetItems as Task[];
  }
}
```

**v3**

```vue [Column.vue]
<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const props = defineProps<{ column: { id: string; tasks: Task[] } }>();
const el = useTemplateRef<HTMLElement>('el');

const { items } = makeSortableList(el, {
  id: props.column.id,                   // `from.list` and `to.list` in drop events
  items: toRef(props.column, 'tasks'),   // writable: the parent passes a reactive column
  group: 'board',                        // same name: tasks move between these lists
});
</script>

<template>
  <ul ref="el">
    <TaskItem v-for="task in items" :key="task.id" :task="task" />
  </ul>
</template>
```

```vue [Board.vue]
<script setup lang="ts">
import { reactive } from 'vue';
import Column from './Column.vue';

const columns = reactive([
  { id: 'todo', tasks: [{ id: 't1', title: 'Write the docs' }] },
  { id: 'done', tasks: [] },
]);
</script>

<template>
  <Column v-for="column in columns" :key="column.id" :column="column" />
</template>
```

O drop grava os dois arrays, o que a tarefa deixou e o em que ela entrou. `TaskItem.vue` é o da lista
ordenável acima. Uma paleta que distribui cópias era `suggestCopy()` e uma flag `copyOnly`; agora é
uma lista:

```ts [Palette.vue]
makeSortableList(el, {
  items: blocks,
  group: { name: 'board', pull: 'clone', put: false },  // copies go out, nothing comes in
  sort: false,                                          // its own order stays
  clone: (block) => ({ ...block, id: crypto.randomUUID() }),
});
```

Para um store Pinia ou outro estado que você não grava diretamente, passe `items` como getter, chame
`e.preventDefault()` no `onDrop` e aplique `e.result`: veja
[listas controladas](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists).

### Um overlay personalizado

**v2**

```ts [TaskItem.vue]
makeDraggable(el, {
  render: markRaw(TaskOverlay),
  data: () => props.task,
});
```

```vue [TaskOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import { useDnDProvider } from '@vue-dnd-kit/core';

const { entities } = useDnDProvider();
const task = computed(() => {
  const [node] = entities.draggingMap.keys();
  return node ? (entities.draggableMap.get(node)?.data?.() as Task) : null;
});
</script>

<template>
  <div class="task-preview">{{ task?.title }}</div>
</template>
```

**v3**

```ts [TaskItem.vue]
makeDraggable(el, {
  id: () => props.task.id,
  overlay: TaskOverlay,
  data: () => props.task,
});
```

```vue [TaskOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, Over } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean }>();
const task = computed(() => props.items[0]!.data as Task);
</script>

<template>
  <!-- Fills the overlay box, which takes the size of the slot. -->
  <div class="task-preview" :class="{ refused: over && !accepted }">
    {{ task.title }}
    <span v-if="items.length > 1" class="count">{{ items.length }}</span>
  </div>
</template>

<style scoped>
.task-preview { width: 100%; height: 100%; }
</style>
```

- O componente recebe o arraste como props: `items` (cada item arrastado, começando pelo que foi
pego), `over`, `accepted`, `status`, `mode` e `to`. Declare só as que você lê. Para as linhas de uma
lista, o item da lista é `items[0].item`.
- Passe-o como está. Troque-o com um `shallowRef`, nunca com um `ref` profundo.

O slot do provider muda do mesmo jeito, e o seu componente não se posiciona mais sozinho:

**v2**

```vue [App.vue]
<DnDProvider>
  <RouterView />
  <template #preview>
    <MyOverlay />  <!-- moved itself with useDnDProvider().preview.position -->
  </template>
</DnDProvider>
```

**v3**

```vue [App.vue]
<DnDProvider>
  <RouterView />
  <template #overlay="{ items, over, accepted }">
    <MyOverlay :items="items" :over="over" :accepted="accepted" />
  </template>
</DnDProvider>
```

Uma entrada animada que envolvia o `DragPreview` em um `<Transition>` vira `overlay-class` com
`@starting-style`: veja [erguer, inclinar, assentar](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle).

### Um drop que você confirma

**v2**

```ts [Zone.vue]
makeDroppable(el, {
  events: {
    onDrop: (e) =>
      new Promise<void | boolean>((resolve) => {
        if (!window.confirm('Drop here?')) return resolve(false); // keep dragging
        place(e.draggedItems);
        resolve();
      }),
  },
});
```

**v3**

```ts [Zone.vue]
makeDroppable(el, {
  onBeforeDrop: () => (window.confirm('Drop here?') ? 'accept' : 'continue'),
  onDrop: (e) => place(e.active.items),
});
```

Uma lista pergunta do mesmo jeito, e uma promise permite abrir um diálogo seu. O overlay espera onde
foi solto até a promise terminar:

```ts [Column.vue]
makeSortableList(el, {
  items: toRef(props.column, 'tasks'),
  group: 'board',
  // `ask` opens a dialog and resolves 'accept', 'continue' or 'reject'.
  onBeforeDrop: (e) => (e.sameList ? 'accept' : ask(e)),
});
```

Uma zona que aceitava só a parte correspondente de uma seleção mista (`groupMatch: 'some'`):

**v2**

```ts [Zone.vue]
makeDroppable(el, {
  groups: ['frontend'],
  groupMatch: 'some',
  events: {
    onDrop: (e) => place(e.draggedItems), // only the items of the group arrive
  },
});
```

**v3**

```ts [Zone.vue]
import type { DragItem } from '@vue-dnd-kit/core';

const fits = (item: DragItem) => item.type.length === 0 || item.type.includes('frontend');

makeDroppable(el, {
  accept: 'frontend',
  acceptMode: 'some',
  onBeforeDrop: (e) => e.active.items.filter(fits).map((item) => item.id), // the others fly back
  onDrop: (e) => place(e.active.items.filter(fits)), // `active.items` still lists every dragged item
});
```

As listas fazem isso sem código: com `acceptMode: 'some'`, os itens que o `group.put` delas aceita
pousam, e os outros voltam ao lugar.

## Armadilhas ao atualizar

- **Instale a v3 com a faixa dela.** `^3` no `package.json`: um `npm update` mantém `^2` na v2.
- **Renderize o rascunho.** Uma lista renderiza os `items` que `makeSortableList` retorna, não o seu
array. Renderizando o seu array, nada se move até o drop.
- **Não ordene duas vezes.** Apague o código de `suggestSort` das listas: uma lista grava cada drop em
um ref `items` gravável depois do `onDrop` dela. Para aplicá-lo você mesmo, chame
`e.preventDefault()` e use `e.result`.
- **false recusa o drop.** Na v2, um `onDrop` que resolvia `false` mantinha o arraste em andamento.
Na v3, retorne `'continue'` do `onBeforeDrop`. Uma promise retornada do `onDrop` é ignorada.
- **Listas só compartilham dentro de um group.** Uma lista sem um não troca itens com nenhuma outra
lista.
- **Use ids como key das linhas.** `:key="index"` anima as linhas erradas. Passe ids a partir dos seus
dados também: um id padrão é novo a cada instância do componente.
- **Nada de <TransitionGroup>, nada de transition em transform.** A biblioteca move as linhas
ela mesma, e os movimentos seriam animados duas vezes.
- **Desfaça o contorno para toque.** `touch-action: none` em um item inteiro impede a página de rolar
sob o dedo; a v3 começa os arrastes por toque com um toque longo. Mantenha-o em um handle que deve
arrastar na hora, com `activation: { touch: { distance: 4 } }`.
- **Remova atributos obsoletos.** A biblioteca define o `tabindex`, o `role` e os `aria-*` de que
precisa e nunca sobrescreve os seus, então um `role` ou um `aria-grabbed` que sobrou fica como você
o deixou.
- **Refaça o estilo do overlay.** `.dnd-kit-preview` não existe mais: estilize o que está dentro de
`[data-dnd-overlay='dragging']`, nunca o `transform` da caixa. Dê `width: 100%; height: 100%` à
raiz de um componente de overlay, e tire `<DragPreview />` dos seus layouts.
- **A rolagem automática está ligada.** Passe `:auto-scroll="false"` onde a v2 nunca rolava.
- **Um retângulo de seleção não precisa de tecla.** `makeSelectionArea` desenha a partir de um simples
pressionar no espaço vazio dela. Adicione um `modifier` para manter o Ctrl da v2.
- **Um provider, áreas dentro dele.** Itens não podem passar de um provider para outro. Uma página que
usava um provider por região para manter as regras separadas precisa de um provider e de um
`makeDragArea` por região.
- **Dois argumentos.** `makeDraggable` e `makeDroppable` recebem um ref e um objeto de opções, sem
payload.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
