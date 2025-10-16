import devServer from '@hono/vite-dev-server';
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  plugins: [
    devServer({
      entry: 'src/index.ts',
    }),
    {
      name: 'copy-assets-to-subdir',
      closeBundle() {
        const copyRecursive = (src: string, dest: string) => {
          mkdirSync(dest, { recursive: true });
          const entries = readdirSync(src, { withFileTypes: true });
          for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            if (entry.isDirectory()) {
              copyRecursive(srcPath, destPath);
            } else {
              copyFileSync(srcPath, destPath);
            }
          }
        };
        copyRecursive('src/assets/favicon', 'dist/assets/favicon');
        copyRecursive('src/assets/styles', 'dist/assets/styles');
        copyRecursive('src/assets/pixel-grids', 'dist/assets/pixel-grids');
        if (mode === 'production') {
          copyRecursive(
            'src/assets/scripts/datastar-community',
            'dist/assets/scripts/datastar-community',
          );
        } else {
          copyRecursive('src/assets/scripts/datastar-pro', 'dist/assets/scripts/datastar-pro');
        }
      },
    },
  ],
  publicDir: 'src/assets',
  define: {
    __ENV_RELATIVE_PATH__: mode === 'production' ? '"../../../.env"' : '"../../../../../.env"',
  },
  build: {
    target: 'node20',
    outDir: 'dist',
    copyPublicDir: false,
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'node:url',
        'node:path',
        'node:fs',
        'url',
        'path',
        'fs',
        'dotenv',
        'hono',
        '@starfederation/datastar-sdk',
        '@hono/node-server',
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
