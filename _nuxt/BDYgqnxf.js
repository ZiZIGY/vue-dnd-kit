import{t as e}from"./CRzLMJPS.js";var t={vue:`^3.5.0`,"@vue-dnd-kit/core":`^3.0.0-0`,"@vue-dnd-kit/actions":`^1.0.0-0`,"@vueuse/core":`^15.0.0`,"@tanstack/vue-virtual":`^3.13.0`,"motion-v":`^2.8.0`},n=e=>{let n=new Set([`vue`,`@vue-dnd-kit/core`]);for(let r of e)for(let[,e]of r.code.matchAll(/(?:from|import)\s*\(?\s*'((?:@[\w.-]+\/)?[\w.-]+)[^']*'/g))t[e]&&n.add(e);return Object.fromEntries([...n].map(e=>[e,t[e]]))};async function r(t,r,i){let{default:a}=await e(async()=>{let{default:e}=await import(`./CUc4PH8i.js`);return{default:e}},[],import.meta.url),o=Object.fromEntries(i.map(e=>[`src/${e.name===`index.vue`?`App.vue`:e.name}`,e.code.replaceAll(`'./index.vue'`,`'./App.vue'`)]));await a.openProject({title:`Vue DnD Kit — ${r}`,description:`Example "${t}" from the Vue DnD Kit docs`,template:`node`,files:{...o,"src/main.ts":`import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
`,"index.html":`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue DnD Kit</title>
    <style>body { font-family: system-ui, sans-serif; margin: 2rem; }</style>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"><\/script>
  </body>
</html>
`,"vite.config.ts":`import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({ plugins: [vue()] });
`,"package.json":JSON.stringify({name:`vue-dnd-kit-${t}`,private:!0,type:`module`,scripts:{dev:`vite`,build:`vite build`},dependencies:n(i),devDependencies:{vite:`^7.0.0`,"@vitejs/plugin-vue":`^6.0.0`,typescript:`^5.9.0`}},null,2)}},{openFile:`src/App.vue`,newWindow:!0})}export{r as openStackBlitz};