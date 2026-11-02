import{t as e}from"./CRzLMJPS.js";var t={name:`vue-dnd-kit-docs`,private:!0,type:`module`,scripts:{dev:`nuxt dev`,build:`nuxt build`,generate:`nuxt generate`,preview:`node tools/preview.ts`,postinstall:`nuxt prepare`,typecheck:`nuxt typecheck`,"api:check":`node tools/api-check.ts`},dependencies:{"@iconify-json/lucide":`^1.2.147`,"@iconify-json/simple-icons":`^1.2.70`,"@iconify-json/vscode-icons":`^1.2.94`,"@nuxt/content":`^3.16.2`,"@nuxt/ui":`^4.12.0`,"@nuxtjs/i18n":`^10.6.0`,"@nuxtjs/seo":`^6.0.1`,"@stackblitz/sdk":`^1.11.1`,"@tanstack/vue-virtual":`^3.13.49`,"@vueuse/core":`^15.0.0`,"motion-v":`^2.8.0`,nuxt:`^4.6.2`,tailwindcss:`^4.1.18`,vue:`^3.5.44`,zod:`^4.1.0`},devDependencies:{typescript:`^5.9.3`,"vue-tsc":`^3.1.5`}},n={"@vue-dnd-kit/core":`^3.0.0-0`,"@vue-dnd-kit/actions":`^1.0.0-0`},r=e=>n[e]??t.dependencies[e]??t.devDependencies[e]??`latest`,i=e=>{let t=new Set;for(let n of e)for(let[,e]of n.code.matchAll(/(?:\bfrom|\bimport)\s*\(?\s*['"]([@a-z][^'"]*)['"]/gi)){let n=e.split(`/`);t.add(e.startsWith(`@`)?n.slice(0,2).join(`/`):n[0])}return t},a=(e,t)=>t.has(`@nuxt/ui`)||e.some(e=>e.name.endsWith(`.vue`)&&/<U[A-Z]\w*[\s/>]/.test(e.code)),o=e=>`<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Vue DnD Kit</title>\n    <style>body { font-family: system-ui, sans-serif; margin: 2rem; }</style>\n  </head>\n  <body>\n    ${e}\n    <script type="module" src="/src/main.ts"><\/script>\n  </body>\n</html>\n`,s=()=>({files:{"src/main.ts":`import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
`,"index.html":o(`<div id="app"></div>`),"vite.config.ts":`import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({ plugins: [vue()] });
`},dependencies:[]}),c=()=>({files:{"src/main.ts":`import './main.css';
import { createApp } from 'vue';
import ui from '@nuxt/ui/vue-plugin';
import Root from './Root.vue';

createApp(Root).use(ui).mount('#app');
`,"src/main.css":`@import "tailwindcss";
@import "@nuxt/ui";
`,"src/Root.vue":`<script setup lang="ts">
import App from './App.vue';
<\/script>

<template>
  <UApp>
    <App />
  </UApp>
</template>
`,"index.html":o(`<div id="app" class="isolate p-8"></div>`),"vite.config.ts":`import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ui from '@nuxt/ui/vite';

export default defineConfig({ plugins: [vue(), ui({ router: false })] });
`},dependencies:[`@nuxt/ui`,`tailwindcss`,`@iconify-json/lucide`]});async function l(t,n,o){let{default:l}=await e(async()=>{let{default:e}=await import(`./CUc4PH8i.js`);return{default:e}},[],import.meta.url),u=Object.fromEntries(o.map(e=>[`src/${e.name===`index.vue`?`App.vue`:e.name}`,e.code.replaceAll(`'./index.vue'`,`'./App.vue'`)])),d=i(o),f=a(o,d)?c():s(),p=[...new Set([`vue`,`@vue-dnd-kit/core`,...d,...f.dependencies])];await l.openProject({title:`Vue DnD Kit — ${n}`,description:`Example "${t}" from the Vue DnD Kit docs`,template:`node`,files:{...u,...f.files,"package.json":JSON.stringify({name:`vue-dnd-kit-${t}`,private:!0,type:`module`,scripts:{dev:`vite`,build:`vite build`},dependencies:Object.fromEntries(p.sort().map(e=>[e,r(e)])),devDependencies:{vite:`^7.0.0`,"@vitejs/plugin-vue":`^6.0.0`,typescript:`^5.9.0`}},null,2)}},{openFile:`src/App.vue`,newWindow:!0})}export{l as openStackBlitz};