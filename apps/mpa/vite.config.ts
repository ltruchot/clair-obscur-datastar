/// <reference types="vitest/config" />
import devServer from '@hono/vite-dev-server';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  plugins: [
    devServer({
      entry: 'src/index.ts',
    }),
  ],
  define: {
    __ENV_RELATIVE_PATH__: mode === 'production' ? '"../../../.env"' : '"../../../../../../.env"',
  },
  build: {
    target: 'node20',
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'hono',
        '@hono/node-server',
        '@starfederation/datastar-sdk',
        'node:url',
        'node:path',
        'node:fs',
        'url',
        'path',
        'fs',
        'dotenv',
        '@hono/session',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    coverage: {
      provider: 'v8',
    },
  },
}));
