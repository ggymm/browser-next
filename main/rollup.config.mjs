import path from 'path'
import { fileURLToPath } from 'url'

import alias from '@rollup/plugin-alias'
import terser from '@rollup/plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const __output = path.join(__dirname, '../app/')

export default {
  external: ['electron'],
  input: 'src/index.ts',
  output: [
    {
      file: __output + 'main.js',
      format: 'cjs',
      sourcemap: false
    },
    {
      file: __output + 'main.esm.js',
      format: 'esm',
      sourcemap: false
    }
  ],
  plugins: [
    alias({
      entries: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src')
        },
        {
          find: '#',
          replacement: path.resolve(__dirname, 'lib')
        }
      ]
    }),
    terser(),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: 'tsconfig.json',
      compilerOptions: {
        outDir: __output
      }
    }),
    {
      name: 'insert-version',
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
  ]
}
