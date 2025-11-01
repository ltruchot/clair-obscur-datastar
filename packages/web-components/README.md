# Web Components

Vanilla Web Components library with zero dependencies.

## Architecture

- **Modular exports**: Each component is exported separately to allow selective imports
- **TypeScript first**: Fully typed with strict TypeScript configuration
- **ES Modules**: Built as ES modules for modern browsers
- **Shadow DOM**: Components use Shadow DOM for encapsulation
- **CSS Parts**: Styleable via CSS `::part()` selector

## Components

## Adding New Components

1. Create `src/component-name.ts` with your component class
2. Export component class and registration function
3. Add entry to `vite.config.ts` build configuration
4. Add export to `package.json` exports field
5. Create `src/component-name.test.ts` for tests
