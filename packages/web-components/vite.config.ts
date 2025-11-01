import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
    },
    environment: 'jsdom',
  },
  plugins: [dts()],
  build: {
    sourcemap: true,
    outDir: './dist',
    emptyOutDir: true,
    lib: {
      entry: {
        'responsive-content': resolve(__dirname, 'src/responsive-content-element.ts'),
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
