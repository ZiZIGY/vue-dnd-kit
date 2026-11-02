---
title: "DevTools"
description: "Un onglet Vue DnD Kit dans les Vue DevTools et les Nuxt DevTools — une mini-carte en direct, un joystick qui fait vraiment glisser, l'édition des options en direct et un journal de chaque glissement."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/guides/devtools"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

`@vue-dnd-kit/devtools` ajoute un onglet **Vue DnD Kit** aux Vue DevTools
(`vite-plugin-vue-devtools`) et aux Nuxt DevTools. Il montre chaque liste, arbre et cible de
dépôt de la page dans une mini-carte en direct, fait glisser n'importe quel item avec un
joystick, modifie les options pendant que l'application tourne, et journalise ce que chaque
glissement a fait. Il ne fonctionne qu'en développement : rien n'en arrive dans un build de
production.

L'onglet est une page à part entière, servie par votre serveur de développement à côté de votre
application : il ne peut donc pas tourner dans cette documentation. Trois étapes suffisent à le
mettre en place.

## Installation

### 1. Ajouter les paquets

```bash
npm i -D @vue-dnd-kit/devtools @vue-dnd-kit/actions
```

`@vue-dnd-kit/actions` est une peer dependency : les déplacements de l'onglet passent par lui.
npm 7+ et pnpm l'installent d'eux-mêmes ; avec Yarn 1, ajoutez-le.

### 2. Ajouter le plugin

<code-group>

```ts [vite.config.ts]
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { vueDnDKitDevtools } from '@vue-dnd-kit/devtools/vite';

export default defineConfig({
  // Next to the Vue DevTools plugin: the tab joins its sidebar.
  plugins: [vueDevTools(), vueDnDKitDevtools(), vue()],
});
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // With @vue-dnd-kit/devtools installed, the tab appears in development.
  modules: ['@vue-dnd-kit/nuxt'],
});
```

</code-group>

Avec Vite, le plugin fait trois choses sur le serveur de développement (`vite serve`) : il sert
l'onglet à `/__vue-dnd-kit-devtools/` (sous votre `base`), l'ajoute aux Vue DevTools, et fait en
sorte que la page lui rende compte avant le démarrage de votre application. Aucun `app.use()`
n'est nécessaire, et les builds ne sont pas touchés.

Avec Nuxt, le module `@vue-dnd-kit/nuxt` trouve le paquet, sert l'onglet, l'ajoute aux Nuxt
DevTools et installe le côté page avec un plugin client. `vueDndKit: { devtools: false }` le
désactive.

### 3. Lancer l'application en développement

Démarrez le serveur de développement comme d'habitude (`vite`, `nuxt dev`) et ouvrez
l'application : l'onglet est prêt. Chaque provider de la page s'y affiche, quelle que soit
l'application dans laquelle il est rendu.

### Sans les plugins

Pour votre propre serveur de développement, ou une page que Vite ne sert pas à partir d'un
`index.html` (configurations SSR), installez vous-même le côté page :

```ts [main.ts]
import { createApp } from 'vue';
import { DnDDevtools } from '@vue-dnd-kit/devtools';
import App from './App.vue';

const app = createApp(App);
app.use(DnDDevtools); // before mount: providers set up earlier aren't seen
app.mount('#app');
```

Ou importez `@vue-dnd-kit/devtools/auto` en premier dans le fichier d'entrée. Utilisez
`vueDnDKitDevtools({ inject: false })` quand le plugin doit servir l'onglet mais que vous
installez vous-même le côté page ; `serveTab()` de `@vue-dnd-kit/devtools/vite` est le middleware
qui sert l'onglet.

<note>

Dans un build de production, `app.use(DnDDevtools)` et l'import `auto` se réduisent à presque
rien : chaque point d'entrée vérifie d'abord `process.env.NODE_ENV`, et les bundlers éliminent le
reste. Sur le serveur, ils ne font rien.

</note>

## L'ouvrir

- **Vue DevTools** : <kbd value="Alt">



</kbd>

 + <kbd value="Shift">



</kbd>

 + <kbd value="D">



</kbd>

, ou le bouton Vue
en bas de la page, puis l'onglet **Vue DnD Kit**.
- **Nuxt DevTools** : <kbd value="Alt">



</kbd>

 + <kbd value="Shift">



</kbd>

 + <kbd value="D">



</kbd>

, ou le bouton
Nuxt, puis **Vue DnD Kit** (dans la barre latérale ou son menu de débordement).
- **Une fenêtre à part** : ouvrez `http://localhost:5173/__vue-dnd-kit-devtools/` sur votre
serveur de développement, ou le bouton ⧉ de l'onglet. Pratique sur un second écran. Avec
plusieurs pages ouvertes, un sélecteur en haut choisit celle à observer.

<warning>

Gardez l'onglet dans une fenêtre à part, pas dans un onglet de navigateur en arrière-plan de la
même fenêtre : la page doit rester visible, et une page masquée annule les glissements.

</warning>

## L'onglet en un coup d'œil

<table>
<thead>
  <tr>
    <th>
      Partie
    </th>
    
    <th>
      Ce qu'elle contient
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Barre du haut
    </td>
    
    <td>
      Ce que fait le glissement en ce moment (<code>
        dragging card-3 → done (accepts)
      </code>
      
      ), la page observée, <strong>
        ⌖ Pick
      </strong>
      
      , le nombre d'options modifiées avec une réinitialisation, ⧉ (une fenêtre à part) et le thème.
    </td>
  </tr>
  
  <tr>
    <td>
      À gauche : le registre
    </td>
    
    <td>
      Chaque provider sous forme d'arbre : ses listes, arbres, cibles de dépôt et éléments déplaçables. <strong>
        ☰
      </strong>
      
       l'affiche ou le masque.
    </td>
  </tr>
  
  <tr>
    <td>
      Au milieu : <strong>
        Map
      </strong>
      
       et <strong>
        Log
      </strong>
    </td>
    
    <td>
      La mini-carte en direct de la page, ou le journal des glissements.
    </td>
  </tr>
  
  <tr>
    <td>
      À droite : <strong>
        Drive
      </strong>
      
      , <strong>
        Options
      </strong>
      
      , <strong>
        State
      </strong>
    </td>
    
    <td>
      Le joystick et les boutons de déplacement, les options du nœud choisi, et ce que le provider en sait.
    </td>
  </tr>
</tbody>
</table>

Choisissez un nœud dans le registre ou un item sur la carte, et la partie droite le suit.

## La mini-carte

Une carte en direct par liste, arbre et cible de dépôt, avec des copies de leurs items là où ils
sont — les mêmes clones que montrerait l'overlay, avec le CSS de la page. Pendant un glissement,
elle marque :

- les listes et les cibles qui **acceptent** le glissement (en bleu) ou le **refusent** (en
rouge) ;
- le placeholder, et la cible sous le pointeur ;
- le pointeur, la boîte de l'overlay, et la ligne d'insertion des listes en
`placeholder: 'indicator'`.

Un clic choisit un item et le met en évidence sur la page ; un double clic fait défiler la page
jusqu'à lui. Utilisez la carte quand un dépôt ne va pas là où vous l'attendez : elle montre d'un
coup d'œil quelles listes acceptent le glissement.

## Drive : le joystick

Choisissez un item — sur la carte, dans le registre, ou avec **⌖ Pick**, qui prend l'appui
suivant sur un élément déplaçable de la page au lieu de le laisser agir — et poussez le bouton du
joystick. L'item est saisi et se déplace dans ce sens, d'autant plus vite que le bouton est loin
du centre. Relâchez et il s'arrête ; **Drop** et **Cancel** terminent le glissement.

C'est un vrai glissement au pointeur d'un capteur nommé `devtools`, fait avec
l'[API publique des capteurs](https://zizigy.github.io/docs/guides/sensors#a-sensor-of-your-own) : les listes se trient
en dessous, les conteneurs défilent automatiquement à leurs bords, et `onBeforeDrop` et `onDrop`
s'exécutent comme pour n'importe quel glissement. Les items désactivés ne sont pas saisis. Un
glissement au clavier démarré par la page peut aussi être dirigé.

Les items des listes triables ont aussi des boutons : vers le haut, vers le bas, au début, à la
fin, vers une autre liste du groupe. Chacun est un glissement au clavier de
[`moveItem`](https://zizigy.github.io/docs/guides/sensors#programmatic-drags). Sous le joystick, une grande copie de ce
que montre l'overlay.

<table>
<thead>
  <tr>
    <th>
      Touche, dans l'onglet
    </th>
    
    <th>
      Effet
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Flèches ou <kbd value="W">
        
      </kbd>
      
       <kbd value="A">
        
      </kbd>
      
       <kbd value="S">
        
      </kbd>
      
       <kbd value="D">
        
      </kbd>
    </td>
    
    <td>
      Pousse le bouton dans ce sens, à mi-course ; avec <kbd value="Shift">
        
      </kbd>
      
      , jusqu'au bout
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="G">
        
      </kbd>
    </td>
    
    <td>
      Saisit l'item choisi
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="Space">
        
      </kbd>
      
       / <kbd value="Enter">
        
      </kbd>
    </td>
    
    <td>
      Dépose
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="Escape">
        
      </kbd>
    </td>
    
    <td>
      Annule
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="P">
        
      </kbd>
    </td>
    
    <td>
      Choisit sur la page
    </td>
  </tr>
</tbody>
</table>

## Options

Chaque option qui n'est pas un callback peut être modifiée pendant que l'application tourne.
Choisissez le nœud et ouvrez **Options** :

<table>
<thead>
  <tr>
    <th>
      Nœud
    </th>
    
    <th>
      Options
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Provider
    </td>
    
    <td>
      <code>
        overlayFit
      </code>
      
      , <code>
        autoScroll
      </code>
      
      , <code>
        collision
      </code>
      
      , <code>
        modifiers
      </code>
      
       (ceux de la bibliothèque, par nom), <code>
        animation
      </code>
      
      , <code>
        dropAnimation
      </code>
      
      , <code>
        animate
      </code>
      
      , <code>
        activation
      </code>
      
      , <code>
        keyboard
      </code>
      
      , <code>
        haptics
      </code>
      
      , <code>
        copyModifier
      </code>
      
      …
    </td>
  </tr>
  
  <tr>
    <td>
      Liste
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      , <code>
        strategy
      </code>
      
      , <code>
        placeholder
      </code>
      
      , <code>
        behavior
      </code>
      
      , <code>
        multiple
      </code>
      
      , <code>
        sort
      </code>
      
      , <code>
        dropOutside
      </code>
      
      , <code>
        acceptMode
      </code>
      
      , <code>
        animation
      </code>
      
      , <code>
        animate
      </code>
      
      , <code>
        autoScroll
      </code>
      
      , <code>
        modifiers
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      Arbre
    </td>
    
    <td>
      <code>
        placeholder
      </code>
      
      , <code>
        indentation
      </code>
      
      , <code>
        nesting
      </code>
      
      , <code>
        maxDepth
      </code>
      
      …
    </td>
  </tr>
  
  <tr>
    <td>
      Cible de dépôt
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      , <code>
        priority
      </code>
      
      , <code>
        accept
      </code>
      
      , <code>
        acceptMode
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      Item
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      , <code>
        keyboard
      </code>
      
      , <code>
        activation
      </code>
    </td>
  </tr>
</tbody>
</table>

Une modification s'applique tout de suite, à cette page uniquement, et n'est jamais écrite dans
votre code : la bibliothèque lit la nouvelle valeur là où elle lit l'option. Elle dure jusqu'à ce
que vous la réinitialisiez (↺ par option, ou la réinitialisation de la barre du haut), que le
provider soit démonté ou que la page soit rechargée. Une option modifiée affiche à côté d'elle la
valeur de votre code. Les items montés pendant qu'une modification est active — les lignes d'une
liste virtuelle — la reçoivent aussi.

## State

Ce que sait chaque provider, pour le nœud que vous avez choisi :

- la **session de glissement** : le statut, les ids, items et capteur actifs, la cible et si elle
accepte, le pointeur, l'overlay, la session du groupe triable et la ligne d'insertion ;
- une **liste** : son ordre et son brouillon ; un **arbre** : ses lignes ;
- un **item** : son type, ses données et sa position ; une **cible de dépôt** : ses règles.

Les items se montent et se démontent sans événements : le registre se met à jour en moins d'une
seconde.

## Log

Une bande par glissement, dans l'ordre :

<table>
<thead>
  <tr>
    <th>
      Entrée
    </th>
    
    <th>
      Ce qu'elle indique
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        drag start
      </code>
    </td>
    
    <td>
      Les ids, le capteur et s'il s'agit du toucher, la liste d'origine.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
      
      , <code>
        left
      </code>
    </td>
    
    <td>
      Chaque cible où il entre et d'où il sort, et si elle accepte.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        release
      </code>
    </td>
    
    <td>
      La cible au-dessus de laquelle il a été relâché, pendant qu'<code>
        onBeforeDrop
      </code>
      
       décide.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
    </td>
    
    <td>
      Le verdict : accepté, partiellement accepté, refusé par un hook, refusé par l'<code>
        accept
      </code>
      
       de la cible, et le temps qu'ont pris les hooks.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drop
      </code>
    </td>
    
    <td>
      La cible ; pour les listes triables, le déplacement, <code>
        e.result
      </code>
      
      , et si <code>
        preventDefault()
      </code>
      
       a été appelé.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel
      </code>
    </td>
    
    <td>
      Pourquoi : annulé (Escape, <code>
        cancel()
      </code>
      
      ), refusé par un hook, ou refusé par l'<code>
        accept
      </code>
      
       de la cible.
    </td>
  </tr>
</tbody>
</table>

Aussi `auto-scroll on` et `off`, les textes des `announcement` (masqués par défaut) et, en dehors
des glissements, `animate` (les changements des items d'une liste qui ne viennent pas d'un
glissement). Cliquez sur une entrée pour voir ses données. Un onglet ouvert plus tard reçoit les
glissements déjà faits.

## Déboguer un dépôt, pas à pas

Une carte refuse d'aller dans une colonne. Avec l'onglet ouvert :

1. **Reproduisez-le** à la main, ou avec **Drive** pour garder les mains libres pour l'onglet.
2. **Observez la carte** pendant que la carte est au-dessus de la colonne. Du rouge signifie que la
liste refuse la carte : regardez son `group` (`put`) ou l'`accept` de la cible. Du bleu
signifie qu'elle l'accepte, et que le problème vient plus tard.
3. **Lisez le journal** de ce glissement. `onBeforeDrop` dit qui a dit non — un hook, ou
l'`accept` de la cible. Si le dépôt a abouti mais que vos données n'ont pas changé, l'entrée
`drop` indique si `preventDefault()` a été appelé et ce que contenait `e.result` : une liste
contrôlée doit l'appliquer elle-même.
4. **Essayez un correctif en direct** dans **Options** — un `acceptMode` plus souple, une autre
`collision`, `placeholder: 'indicator'` — puis écrivez dans votre code celui qui fonctionne.

## Comment ça marche

Les providers rendent compte à un hook qu'installe le côté page. Tant qu'aucun onglet n'observe
la page, ils sont seulement enregistrés ; ensuite, la page écoute comme n'importe quel moniteur et
envoie à l'onglet ce qu'il affiche — toutes les 40 ms pendant un glissement, deux fois par seconde
sinon — et s'arrête quand aucun onglet ne l'a observée depuis quelques secondes. L'onglet parle à
la page via un `BroadcastChannel` de l'origine de la page. Il ne change rien d'autre que ce que
vous demandez : les glissements, la sélection et les options remplacées.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
