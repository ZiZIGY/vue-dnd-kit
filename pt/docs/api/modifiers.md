---
title: "Modificadores e colisão"
description: "Funções que mudam para onde vai o item arrastado, e as que escolhem o alvo sob ele."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/api/modifiers"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="35rem" hint="Ligue ou desligue modificadores, depois arraste a ficha verde" name="api-modifiers">



</example>

## Modificadores

```ts
import { restrictToParent, snapToGrid } from '@vue-dnd-kit/core';

makeSortableList(list, { items, modifiers: [restrictToParent] });
makeDragArea(board, { modifiers: [snapToGrid({ x: 24, y: 24, smooth: true })] });
```

Um modificador recebe o deslocamento do arraste e retorna um novo. Eles rodam em ordem: os
`modifiers` do provider, os de uma área de arraste, os do próprio draggable (ou da lista dele),
depois os limites da área (`restrictToArea`), e a trava de `axis` por último. Veja
[Eixos, limites e grades](https://zizigy.github.io/docs/guides/constraints).

<table>
<thead>
  <tr>
    <th>
      Modificador
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
        restrictToVerticalAxis
      </code>
    </td>
    
    <td>
      Move só na vertical. A opção <code>
        axis: 'y'
      </code>
      
       faz o mesmo, por último. Na horizontal, acompanha o conteúdo onde começou (<code>
        containerShift
      </code>
      
      ), não importa como a página role.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToHorizontalAxis
      </code>
    </td>
    
    <td>
      Move só na horizontal (<code>
        axis: 'x'
      </code>
      
      ) e, na vertical, acompanha o conteúdo onde começou.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToWindowEdges
      </code>
    </td>
    
    <td>
      Mantém o overlay dentro da janela.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToParent
      </code>
    </td>
    
    <td>
      Mantém o overlay dentro do contêiner onde o arraste começou: a lista ordenável, ou o elemento pai de um draggable simples.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToElement(element)
      </code>
    </td>
    
    <td>
      Mantém o overlay dentro de um elemento (um ref, um getter ou o elemento).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToFirstScrollableAncestor
      </code>
    </td>
    
    <td>
      Mantém o overlay dentro do primeiro ancestral rolável do elemento arrastado.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapToGrid(size | options)
      </code>
    </td>
    
    <td>
      Encaixa em uma grade: <code>
        { x, y, origin: 'container' | 'delta', smooth }
      </code>
      
      . Deixe <code>
        x
      </code>
      
       ou <code>
        y
      </code>
      
       de fora para encaixar só um eixo. <code>
        'container'
      </code>
      
       (padrão) coloca o canto superior esquerdo da caixa nas linhas de uma grade que parte do canto superior esquerdo do contêiner; <code>
        'delta'
      </code>
      
       arredonda o deslocamento, mantendo o alinhamento próprio do item. <code>
        smooth
      </code>
      
       faz o overlay deslizar entre as células.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapCenterToCursor
      </code>
    </td>
    
    <td>
      Centraliza o overlay sob o ponteiro em vez de manter o deslocamento de onde ele foi pego.
    </td>
  </tr>
</tbody>
</table>

<api-table name="Modifier">



</api-table>

<api-table name="ModifierArgs">



</api-table>

## Detecção de colisão

```ts
import { closestCorners } from '@vue-dnd-kit/core';
```

```vue
<DnDProvider :collision="closestCorners" />
```

O `collision` do provider escolhe o alvo; o melhor candidato vem primeiro.

<table>
<thead>
  <tr>
    <th>
      Função
    </th>
    
    <th>
      O que escolhe
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
      Padrão: o que está sob o ponteiro, senão o que o overlay sobrepõe.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointerWithin
      </code>
    </td>
    
    <td>
      Alvos sob o ponteiro, testando o que está embaixo dele (respeitando z-order, overlays e shadow roots).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        rectIntersection
      </code>
    </td>
    
    <td>
      Alvos que se sobrepõem ao overlay: maior prioridade, depois aninhamento mais profundo, depois interseção sobre união.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCenter
      </code>
    </td>
    
    <td>
      Todos os alvos, pela distância entre os centros.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCorners
      </code>
    </td>
    
    <td>
      Todos os alvos, pela soma das distâncias entre os cantos (alvos empilhados, como colunas de kanban).
    </td>
  </tr>
</tbody>
</table>

<api-table name="CollisionDetection">



</api-table>

<api-table name="CollisionArgs">



</api-table>

<api-table name="CollisionCandidate">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
