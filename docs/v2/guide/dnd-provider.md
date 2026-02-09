# DnDProvider

Root component. Wraps your app and provides drag & drop context.

```vue
<DnDProvider>
  <slot />
  <template #overlay="{ overlay }">
    <component :is="overlay" />
  </template>
</DnDProvider>
```
