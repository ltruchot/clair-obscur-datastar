import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  test: {
    coverage: {
      provider: 'v8', // Ou 'c8' selon votre préférence
      reporter: ['text', 'lcov'], // lcov pour le badge
      reportsDirectory: './coverage', // dossier de sortie
    },
  },
  build: {
    sourcemap: true,
    outDir: './dist',
    emptyOutDir: false,
    lib: {
      entry: './src/index.ts',
      name: 'mylib',
      formats: ['es', 'cjs', 'umd', 'iife'],
      fileName: (format) => `index.${format}.js`,
    },
  },
});
