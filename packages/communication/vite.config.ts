import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SnapStudioCommunication',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['@snap-studio/schema'],
      output: {
        globals: {
          '@snap-studio/schema': 'SnapStudioSchema'
        }
      }
    }
  }
});