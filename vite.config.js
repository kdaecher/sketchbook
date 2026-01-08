import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default defineConfig({
    root: './',
    publicDir: 'public',
    define: {
        '__DEFINES__': {}
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                p5: resolve(__dirname, 'p5/index.html'),
                svg: resolve(__dirname, 'svg/index.html'),
                webgl: resolve(__dirname, 'webgl/index.html'),
            }
        }
    },
    server: {
        port: 8080,
        open: true,
    }
});
