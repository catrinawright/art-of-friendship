import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // Matches the GitHub Pages path: catrinawright.github.io/art-of-friendship/
  // Change this to '/' if deploying to a root domain or a different path.
  base: '/art-of-friendship/',

  build: {
    outDir: 'dist',
    sourcemap: false,
    // Chunk size warning threshold (in kB)
    chunkSizeWarningLimit: 600,
  },
});
