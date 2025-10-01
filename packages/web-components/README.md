# Web Components

Vanilla Web Components library with zero dependencies.

## Architecture

- **Modular exports**: Each component is exported separately to allow selective imports
- **TypeScript first**: Fully typed with strict TypeScript configuration
- **ES Modules**: Built as ES modules for modern browsers
- **Shadow DOM**: Components use Shadow DOM for encapsulation
- **CSS Parts**: Styleable via CSS `::part()` selector

## Components

### list-element

Renders a list from an array of items.

**Usage in Backend (Hono templates):**

```typescript
import { html } from 'hono/html';

// In your page template
const page = html`
  <!DOCTYPE html>
  <html>
    <head>
      <script type="module" src="/web-components/list-element.js"></script>
    </head>
    <body>
      <list-element></list-element>
      <script type="module">
        const element = document.querySelector('list-element');
        element.items = [
          { id: '1', label: 'Item 1' },
          { id: '2', label: 'Item 2' }
        ];
      </script>
    </body>
  </html>
`;
```

**Properties:**

- `items`: Array of `ListItem` objects with `id` and `label` properties

**Styling:**

```css
list-element::part(list) {
  margin: 0;
  padding: 0;
}

list-element::part(item) {
  list-style: none;
  padding: 0.5rem;
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode
pnpm dev:watch

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```

## Adding New Components

1. Create `src/component-name.ts` with your component class
2. Export component class and registration function
3. Add entry to `vite.config.ts` build configuration
4. Add export to `package.json` exports field
5. Create `src/component-name.test.ts` for tests