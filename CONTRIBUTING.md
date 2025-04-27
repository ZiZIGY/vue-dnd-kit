# Contributing to Vue DnD Kit

Thank you for considering contributing to Vue DnD Kit! This document outlines the standards and processes we follow in this project.

## Development Philosophy

Vue DnD Kit is built with the following principles in mind:

- **Vue 3 Focus**: We leverage Vue 3's Composition API for all components and utilities
- **Minimal Dependencies**: We strive to minimize external dependencies to keep bundle size small
- **Composables-First Approach**: We use composables for reusable logic
- **TypeScript**: All code is written in TypeScript for better type safety and developer experience
- **Performance**: Code is optimized for performance, especially when handling large lists

## Technical Requirements

- Node.js 16+
- yarn (preferred package manager)

## Project Structure

The project is organized as a monorepo with the following packages:

- `packages/core`: Core drag and drop functionality
- `packages/devtools`: DevTools integration for debugging
- (Additional packages)

Each package follows a similar structure:

```
src/
  components/     # Vue components
  composables/    # Vue composables (hooks)
  managers/       # Logic managers
  utils/          # Utility functions
  types/          # TypeScript types
  plugin.ts       # Vue plugin entry point
  index.ts        # Public API
```

## Composables Pattern

When creating new features, follow the existing composables pattern:

- Use function names with the `use` prefix (e.g., `useDraggable`, `useDroppable`)
- Return refs and computed properties that can be used in components
- Keep logic separate from presentation
- Implement cleanup in `onBeforeUnmount`

Example:

```typescript
export const useMyFeature = (options?: IMyOptions) => {
  const someRef = ref<SomeType | null>(null);
  const someComputed = computed(() => {
    // computation logic
  });

  onMounted(() => {
    // setup logic
  });

  onBeforeUnmount(() => {
    // cleanup logic
  });

  return {
    someRef,
    someComputed,
    someMethod,
  };
};
```

## State Management

We use a centralized store approach with the `useDnDStore` composable. When adding new state:

- Add new state to the appropriate store
- Use shallowRef for complex objects when appropriate
- Make state reactive using Vue's reactivity system
- Consider performance implications for frequently changing values

## Component Guidelines

- Keep components focused on presentation
- Use props for configuration
- Use slots for customization
- Use composables for logic
- Include appropriate ARIA attributes for accessibility

## Testing

All new features should include tests:

- Unit tests for utilities and composables
- Component tests for components
- Integration tests for complex interactions

## Pull Request Process

1. Fork the repository
2. Create a new branch from master
3. Implement your changes
4. Add tests for your changes
5. Ensure all tests pass
6. Update documentation
7. Submit a pull request

## Coding Standards

- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Use TypeScript types for all public APIs
- Keep functions small and focused
- Optimize for readability

## Performance Considerations

- Use throttling for frequent events (as seen in useSensor.ts)
- Minimize DOM operations
- Use shallowRef for complex objects
- Be mindful of memory leaks (register/unregister pattern)
- Consider the performance impact on large lists

## Accessibility

- Support keyboard navigation
- Include appropriate ARIA attributes
- Test with screen readers
- Follow WAI-ARIA guidelines for drag and drop

## Documentation

- Include examples in documentation
- Update README.md when adding new features
- Document breaking changes clearly

---

We appreciate your contributions to make Vue DnD Kit better for everyone!
