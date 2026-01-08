import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Automatically find all HTML files for multi-page support
const htmlFiles = globSync('**/*.html', {
  ignore: ['node_modules/**', 'dist/**'],
  cwd: __dirname
});

const inputEntries = Object.fromEntries(
  htmlFiles.map((file: string) => [
    file.replace(/\.html$/, '').replace(/\//g, '_'),
    resolve(__dirname, file)
  ])
);

export default defineConfig({
  root: './',
  publicDir: 'public',
  define: {
    '__DEFINES__': {}
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: inputEntries
    }
  },
  server: {
    port: 8080,
    open: true,
  }
});
