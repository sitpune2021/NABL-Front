import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dynamicImport from 'vite-plugin-dynamic-import'

// https://vitejs.dev/config/
export default ({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '') // third param '' keeps the VITE_ prefix

    return defineConfig({
        plugins: [react(), dynamicImport()],
        assetsInclude: ['**/*.md'],
        resolve: {
            alias: {
                '@': path.join(__dirname, 'src'),
            },
        },
        server: {
            proxy: {
                '/api/v1': {
                    target: env.VITE_API_URL, // use the loaded env variable
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
}
