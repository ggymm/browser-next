import path from 'path'
import { fileURLToPath } from 'url'

import { defineConfig } from 'rolldown'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const __output = path.join(__dirname, '../app/')

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: __output + 'main.js',
      format: 'cjs',
      minify: true,
      sourcemap: false
    },
    {
      file: __output + 'main.esm.js',
      format: 'esm',
      minify: true,
      sourcemap: false
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '#': path.resolve(__dirname, 'lib')
    }
  },
  plugins: [
    {
      name: 'version',
      generateBundle(outputOptions, bundle) {
        for (const chunkOrAsset of Object.values(bundle)) {
          if (chunkOrAsset.type === 'chunk') {
            const date = new Date()
            const version =
              `${date.getFullYear()}` +
              `-${String(date.getMonth() + 1).padStart(2, '0')}` +
              `-${String(date.getDate()).padStart(2, '0')}` +
              ` ${String(date.getHours()).padStart(2, '0')}` +
              `:${String(date.getMinutes()).padStart(2, '0')}` +
              `:${String(date.getSeconds()).padStart(2, '0')}`
            chunkOrAsset.code = `/*! build version ${version} */\n` + chunkOrAsset.code
          }
        }
      }
    }
  ],
  external: ['os', 'path', 'electron']
})
