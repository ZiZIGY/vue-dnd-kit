# makeDraggable

Makes an element draggable.

```ts
makeDraggable(ref, options?, payload?)
```

- **ref** — template ref of the element
- **options** — `{ modifier?, dragHandle?, activation?, events?, render?, placementMargins? }`
- **payload** — `() => [index, items, dropData?]` — identifies the item in the list
