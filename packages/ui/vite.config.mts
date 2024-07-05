import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [require('tailwindcss')],
    },
  },
  // resolve: {
  //   alias: {
  //     '#': resolve(__dirname, 'src'),
  //   },
  // },
});
