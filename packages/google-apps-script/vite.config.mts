import { resolve } from 'node:path';
import rollupPluginGas from 'rollup-plugin-google-apps-script';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [rollupPluginGas()],
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'src', 'main.ts'),
      output: {
        dir: resolve(__dirname, 'dist'),
        entryFileNames: '[name].js',
      },
    },
    minify: false,
  },
  resolve: {
    alias: {
      '#': resolve(__dirname, 'src'),
    },
  },
});
