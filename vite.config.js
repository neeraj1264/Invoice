import { defineConfig } from 'vite';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig({
  plugins: [
    commonjs(), // Ensures commonjs modules like pdfMake are bundled properly
  ],
  build: {
    sourcemap: true, // Useful for debugging the production build
    rollupOptions: {
      external: ['pdfmake'], // Optionally specify external libraries if needed
    },
  },
});
