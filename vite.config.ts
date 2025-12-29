import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dynamicImport from 'vite-plugin-dynamic-import'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), dynamicImport()],
    assetsInclude: ['**/*.md'],
    resolve: {
        alias: {
            '@': path.join(__dirname, 'src'),
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://192.168.1.23:8000',
                changeOrigin: true,
                secure: false,
            },
        },
        host: true, // equivalent to 0.0.0.0
        port: 5175,
    },
    build: {
        outDir: 'build',
    },
})
