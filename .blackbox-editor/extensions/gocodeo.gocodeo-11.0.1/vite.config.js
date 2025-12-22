import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: './', // Important for VS Code webviews
  build: {
    outDir: 'dist',
    assetsDir: 'assets', // Explicitly put assets in dist/assets
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
  plugins: [react()],
});
