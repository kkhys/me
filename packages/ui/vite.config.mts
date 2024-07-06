import react from '@vitejs/plugin-react-swc';
import tailwind from 'tailwindcss';
import { defineConfig } from 'vite';

// @ts-expect-error - I don't know why this is throwing an error
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      // @ts-expect-error - I don't know why this is throwing an error
      plugins: [tailwind],
    },
  },
});
