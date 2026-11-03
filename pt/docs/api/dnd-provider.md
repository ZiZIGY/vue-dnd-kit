---
title: "DnDProvider"
description: "O componente que controla o arraste — entrada, o overlay, a seleção, a rolagem automática e a live region — para tudo o que é renderizado dentro dele."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/api/dnd-provider"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="DnDProvider">



</api-signature>

```vue [App.vue]
<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
</script>

<template>
  <DnDProvider :animation="{ duration: 200 }" @drag-end="save">
    <RouterView />
    <template #overlay="{ items, over, accepted }">
      <!-- optional: a custom overlay for every drag -->
    </template>
  </DnDProvider>
</template>
```

Todo composable precisa rodar em um componente renderizado **dentro** de um provider. O objetivo
é um único provider para o app inteiro: partes da página ganham regras próprias com
[`makeDragArea`](https://zizigy.github.io/docs/api/make-drag-area). Veja [o guia do provider](https://zizigy.github.io/docs/guides/provider).

A maioria das props é lida quando o provider precisa dela: mude uma, e o próximo arraste já a usa.

<example height="37rem" hint="Troque uma prop, depois arraste uma tarefa: com o mouse, segurando, com Alt ou Shift, ou com Space em uma tarefa focada" name="api-provider-props">



</example>

### Onde o overlay é renderizado

`overlayTo` tira o overlay do `body`: para dentro de um `<dialog>` modal, que fica acima de todo o
resto da página. Desligue a chave, e as linhas que você arrasta somem embaixo do dialog. O
[guia do overlay](https://zizigy.github.io/docs/guides/overlay#where-it-renders-overlayto) explica quando isso é
necessário.

<example height="22rem" hint="Abra o dialog e arraste uma coluna; depois desligue a chave e arraste de novo" name="overlay-dialog">



</example>

## Props

<api-table name="DnDProviderProps">



</api-table>

## Eventos

<table>
<thead>
  <tr>
    <th>
      Evento
    </th>
    
    <th>
      Payload
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
        drag-start
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      Um arraste começou (depois da ativação).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-move
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      O ponteiro se moveu durante um arraste (no máximo uma vez por frame).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-over
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      O alvo sob o arraste mudou.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-end
      </code>
    </td>
    
    <td>
      <code>
        DnDEndEvent
      </code>
    </td>
    
    <td>
      Um drop foi concluído e gravado.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-cancel
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      O arraste foi cancelado ou o drop, recusado.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-resume
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       respondeu <code>
        'continue'
      </code>
      
      : não houve drop, e o arraste continua.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-settle
      </code>
    </td>
    
    <td>
      <code>
        DnDEndEvent
      </code>
      
       ou <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      O overlay do arraste pousou: o que <code>
        drag-end
      </code>
      
       ou <code>
        drag-cancel
      </code>
      
       recebeu.
    </td>
  </tr>
</tbody>
</table>

Os mesmos eventos, mais `onBeforeDrop`, estão disponíveis em qualquer lugar sob o
provider com [`useDnDMonitor`](https://zizigy.github.io/docs/api/use-dnd). Os payloads deles estão na
[página de eventos](https://zizigy.github.io/docs/api/events).

## Slot `#overlay`

Renderiza o que segue o ponteiro, para todo arraste que não tem um componente de overlay próprio
(veja [o guia do overlay](https://zizigy.github.io/docs/guides/overlay)). Se não renderizar nada, volta a usar o clone.

<api-table name="OverlaySlotProps">



</api-table>

## Teclado

<api-table name="KeyboardOptions">



</api-table>

## Rolagem automática

<api-table name="AutoScrollOptions">



</api-table>

## Vibração

<api-table name="HapticsOptions">



</api-table>

<api-table name="HapticPattern">



</api-table>

## Anúncios

<api-table name="Announcements">



</api-table>

<api-table name="AnnouncementContext">



</api-table>

<api-table name="AnnouncedPosition">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
