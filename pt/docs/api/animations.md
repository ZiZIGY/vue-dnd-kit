---
title: "Animações"
description: "As opções e os hooks das animações — a ordenação, o drop e as mudanças que nenhum arraste fez."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/api/animations"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

`animation` (movimentos de layout durante a ordenação), `dropAnimation` (o overlay pousando) e
`animate` (mudanças de dados que nenhum arraste fez) do provider aceitam `false`, opções ou uma
função sua — para GSAP ou motion. Listas e árvores podem sobrescrever `animation` e `animate`;
draggables, itens, listas e alvos de drop podem trazer o seu próprio `dropAnimation`. Veja
[Animações](https://zizigy.github.io/docs/guides/animations).

```vue
<DnDProvider :animation="{ duration: 180, easing: 'ease-out' }" :drop-animation="false" />
```

Cada faixa abaixo é um provider próprio que dá a `animation`, `dropAnimation` e
`animate` o mesmo tipo de valor (`animate` recebe uma função em `move`).

<example height="27rem" hint="Embaralhe, ou arraste uma linha em cada faixa" name="api-animation-shapes">



</example>

## Opções

<api-table name="AnimationOptions">



</api-table>

## Ordenação

<api-table name="LayoutAnimation">



</api-table>

<api-table name="LayoutAnimationContext">



</api-table>

## O drop

<api-table name="DropAnimation">



</api-table>

<api-table name="DropAnimationContext">



</api-table>

## Mudanças de dados

<api-table name="AutoAnimation">



</api-table>

<api-table name="AutoAnimationOptions">



</api-table>

<api-table name="EnterAnimation">



</api-table>

<api-table name="EnterAnimationContext">



</api-table>

<api-table name="LeaveAnimation">



</api-table>

<api-table name="LeaveAnimationContext">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
