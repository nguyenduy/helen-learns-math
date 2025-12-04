import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pkg from './package.json';

const base = pkg.homepage ? new URL(pkg.homepage).pathname : '/';

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    open: true,
  },
});
