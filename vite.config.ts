import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.', // Ensure root is set to your project root
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'src/main.tsx'), // Ensure the entry point is correct
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'test/setupTests.ts',
    include: ['test/**/*.test.tsx', 'test/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
  },
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'src/components'),
      '@services': resolve(__dirname, 'src/services'),
    },
  },
});
