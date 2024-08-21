import path from 'path'
import { fileURLToPath } from 'url'

import alias from '@rollup/plugin-alias'
// import terser from '@rollup/plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  external: ['electron'],
  input: 'src/index.ts',
  output: [
    {
      file: 'target/main.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'target/main.esm.js',
      format: 'esm',
      sourcemap: true
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
    // terser(),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json'
    })
  ]
}
