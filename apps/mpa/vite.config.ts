/// <reference types="vitest/config" />
import devServer from '@hono/vite-dev-server';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    devServer({
      entry: 'src/index.ts',
    }),
  ],
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
        'dotenv',
        '@hono/session',
        '@clair-obscur-workspace/funny-animals-generator',
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
});
