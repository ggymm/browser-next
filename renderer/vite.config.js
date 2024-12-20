import path from 'path'

import { defineConfig, loadEnv } from 'vite'

import { createVitePlugins } from './plugin/index'

const __output = path.join(__dirname, '../app/')

const srcPath = () => {
  return path.resolve(process.cwd(), 'src')
}

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd())

  return {
    server: {
      port: 2333,
      host: '0.0.0.0'
    },
    resolve: {
      alias: {
        '@': srcPath()
      }
    },
    plugins: createVitePlugins(),
    build: {
      outDir: __output + 'renderer',
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'main.html'),
          newtab: path.resolve(__dirname, 'newtab.html')
        },
        output: {
          format: 'esm',
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
