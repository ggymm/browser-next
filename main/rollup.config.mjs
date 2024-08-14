import terser from '@rollup/plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  external: ['electron'],
  input: 'src/index.js',
  output: {
    file: 'target/main.js',
    format: 'cjs'
  },
  plugins: [commonjs(), resolve(), terser()]
}
