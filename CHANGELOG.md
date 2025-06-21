# CHANGELOG

All notable changes to the Vue DnD Kit project are documented in this file.

## v1.5.1 (2025-06-12)

### 🐛 Bug Fixes

- **core:** Fixed element detection issue within nested zones with incompatible groups
  - Resolved a critical bug where elements from invalid nested zones (with incompatible groups) could be incorrectly detected
  - Improved element search logic in the `validateCollisionResults` function to account for nested zones group compatibility
  - Added additional validation to the `possibleElement` condition to prevent element detection in zones with incompatible groups

### Core Package

- Added lazyAllowed for all composables
- Added promise support for dropzone

## 2025-05-13

### Core Package

- Added options for plugin, now u can cutomize default overlay styles

## 2025-05-01

### Core Package

- Added DragOverlay transition detection (need to handle it, Example in docs)
- fix bug with isDragging on Draggable element in useDraggable hook

## 2025-04-30 Added payload to all DnD Events

### Core Package

- now onDrop, onHover, and other events return payload (it's array DraggingItems array)

## 2025-04-28 Added transition support for useDragContainer

### Core Package

- added transition support for usedragcontainer

## 2025-04-27 - DevTools Package Release

### DevTools Package

- Initial release of the DevTools package
- Integration with Vue DevTools
- Real-time visualization of drag and drop state
- Store state inspection and monitoring
- Elements and drop zones visualization
- Pointer position tracking
- Container and hover state debugging

## 2025-04-19 - Core Package Stable Release

### Core Package

- Stable API release
- Full drag and drop functionality
- Touch and mouse input support
- Keyboard navigation
- Custom drag handles
- Multiple draggable items support
- TypeScript support with complete type definitions
- ARIA attributes for accessibility
- Sortable list implementation
- Grid layout support
- Auto-scrolling when dragging near viewport edges
- Drop zone validation
- Event hooks for all drag phases

---

This CHANGELOG will be updated as new features and improvements are added to the Vue DnD Kit ecosystem.
