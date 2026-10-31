# Changelog

## [3.0.0-beta.2](https://github.com/ZiZIGY/vue-dnd-kit/compare/core-v3.0.0-beta.1...core-v3.0.0-beta.2) (2026-10-31)


### Features

* **core:** development warnings for shared ids and for input while a drop is decided ([691f4fc](https://github.com/ZiZIGY/vue-dnd-kit/commit/691f4fce3fe5d87c3ffb62d643a63efe89de5685))
* **core:** drags don't wait for landings, a landing box can be caught, every clone can show ([060145c](https://github.com/ZiZIGY/vue-dnd-kit/commit/060145cc0f27497b01d7f1b4cede661ab113bb03))
* **core:** drop targets shape the overlay, and the overlay says where a drop would go ([cfe48fa](https://github.com/ZiZIGY/vue-dnd-kit/commit/cfe48fa2f8dff4ac2467ebe76d4d2bb13695aeb3))


### Bug Fixes

* **core:** a dropped overlay lands on its slot when the page or a container scrolls mid-flight ([cfe48fa](https://github.com/ZiZIGY/vue-dnd-kit/commit/cfe48fa2f8dff4ac2467ebe76d4d2bb13695aeb3))
* **core:** an element dragged without an overlay stays under the pointer when the page scrolls ([cfe48fa](https://github.com/ZiZIGY/vue-dnd-kit/commit/cfe48fa2f8dff4ac2467ebe76d4d2bb13695aeb3))
* **core:** axis locks keep the drag on its row of the content when the page scrolls (`ModifierArgs.containerShift`) ([cfe48fa](https://github.com/ZiZIGY/vue-dnd-kit/commit/cfe48fa2f8dff4ac2467ebe76d4d2bb13695aeb3))
* **core:** keyboard pickups during a landing, a silent end, a provider gone mid-decision ([a42642b](https://github.com/ZiZIGY/vue-dnd-kit/commit/a42642b2265f6161bbe2a716ea191380a9304967))
* **core:** landing overlays no longer jump when drags follow each other quickly ([ad06d32](https://github.com/ZiZIGY/vue-dnd-kit/commit/ad06d320c93549bd3cebcd84dc77fee4a2b23fca))
* **core:** on a cancel the other dragged items stay placeholders until their clones are home ([3166fb7](https://github.com/ZiZIGY/vue-dnd-kit/commit/3166fb72db3b2f597b3ccb3c86d13f0272c4fb59))
* **sortable:** e.source.remove() takes items only out of the lists they came from ([e032593](https://github.com/ZiZIGY/vue-dnd-kit/commit/e032593efe2b233fbebfc42949d0b544d4142c69))


### Performance Improvements

* **core:** less work at pickup, per frame and on tree drops ([5a6d998](https://github.com/ZiZIGY/vue-dnd-kit/commit/5a6d9982d788ec099a85c1e9dbcdc4af45516af2))

## [3.0.0-beta.1](https://github.com/ZiZIGY/vue-dnd-kit/compare/core-v3.0.0-beta.0...core-v3.0.0-beta.1) (2026-10-30)


### Features

* Vue DnD Kit v3, the first beta ([2dc0067](https://github.com/ZiZIGY/vue-dnd-kit/commit/2dc0067c6e04b694730ee26fb016b896bad5bb61))
