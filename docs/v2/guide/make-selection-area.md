# makeSelectionArea

Makes a region selectable (box selection with modifier key).

```ts
makeSelectionArea(ref, options?)
```

- **options** — `{ modifier?, groups?, disabled?, events?: { onSelected? } }`
- Returns `{ isSelecting, style }` for the selection box
