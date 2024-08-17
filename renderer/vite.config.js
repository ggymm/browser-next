import path from 'path'

import { defineConfig, loadEnv } from 'vite'

import { createVitePlugins } from './plugin/index'

const srcPath = () => {
  return path.resolve(process.cwd(), 'src')
}

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd())

  return {
    server: {
      host: '0.0.0.0'
    },
    resolve: {
      alias: {
        '@': srcPath()
      }
    },
    plugins: createVitePlugins(),
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, 'index.html'),
          newtab: path.resolve(__dirname, 'newtab.html')
        },
        output: {
          format: 'es',
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]'
        }
      }
    },
    optimizeDeps: {
      include: ['@vueuse/core', 'pinia', 'vue']
    }
  }
})
