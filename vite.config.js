// import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // tailwindcss(),
  plugins: [react()],
  build: {
    outDir: './dist',
    emptyOutDir: true,
    rollupOptions: {
      input: '/index.html',
    },
  },
});
