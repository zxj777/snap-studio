import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@snap-studio/core': resolve(__dirname, '../../packages/core/src'),
      '@snap-studio/react': resolve(__dirname, '../../packages/react/src'),
      '@snap-studio/schema': resolve(__dirname, '../../packages/schema/src'),
      '@snap-studio/ui-components': resolve(__dirname, '../../packages/ui-components/src'),
      '@snap-studio/expression-engine': resolve(__dirname, '../../packages/expression-engine/src')
    }
  },
  server: {
    port: 3000,
    open: true
  }
});