import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: './src/assets/web-components',
    emptyOutDir: true,
    lib: {
      entry: {
        'font-picker-element': resolve(__dirname, 'src/home/adapters/in/web/components/font-picker-element.ts'),
        'pixel-grid-element': resolve(__dirname, 'src/home/adapters/in/web/components/pixel-grid-element.ts'),
        'victory-stars': resolve(__dirname, 'src/home/adapters/in/web/components/victory-stars-element.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].es.js',
      },
    },
  },
});
