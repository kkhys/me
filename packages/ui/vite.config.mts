import { resolve } from 'path';
import react from '@vitejs/plugin-react-swc';
import tailwind from 'tailwindcss';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwind],
    },
  },
  resolve: {
    alias: {
      '#': resolve(__dirname, 'src'),
    },
  },
});
