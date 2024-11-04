import path from 'path'
import { fileURLToPath } from 'url'

import terser from '@rollup/plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const __output = path.join(__dirname, '../app/')

export default {
  external: ['electron'],
  input: ['src/main.js', 'src/view.js'],
  output: {
    dir: __output + 'preload',
    format: 'cjs'
  },
  plugins: [terser(), resolve(), commonjs()]
}
