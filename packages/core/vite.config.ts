import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SnapStudioCore',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
    },
    rollupOptions: {
      external: [
        '@snap-studio/schema',
        '@snap-studio/expression-engine'
      ]
    }
  },
  resolve: {
    alias: {
      '@snap-studio/schema': resolve(__dirname, '../schema/src'),
      '@snap-studio/expression-engine': resolve(__dirname, '../expression-engine/src'),
      '@snap-studio/communication': resolve(__dirname, '../communication/src')
    }
  }
});