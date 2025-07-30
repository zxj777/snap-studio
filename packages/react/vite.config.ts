import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SnapStudioReact',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@snap-studio/core',
        '@snap-studio/schema',
        '@snap-studio/expression-engine'
      ]
    }
  },
  resolve: {
    alias: {
      '@snap-studio/core': resolve(__dirname, '../core/src'),
      '@snap-studio/schema': resolve(__dirname, '../schema/src'),
      '@snap-studio/expression-engine': resolve(__dirname, '../expression-engine/src')
    }
  }
});