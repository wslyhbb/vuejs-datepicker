import path from 'path'
import { fileURLToPath } from 'url'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import vue from 'rollup-plugin-vue'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import common from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import alias from '@rollup/plugin-alias'

const __filename = fileURLToPath(import.meta.url)

export default {
  input: path.join(path.dirname(__filename), '../example/main.js'),
  output: {
    file: path.join(path.dirname(__filename), '../example/demo.js'),
    format: 'iife',
    name: 'demo',
    sourcemap: true,
    external: [
      'date-fns'
    ]
  },
  plugins: [
    common(),
    alias({
      entries: [
        {
          find: '@',
          replacement: path.join(path.dirname(fileURLToPath(import.meta.url)), '../src')
        }
      ]
    }),
    vue({
      css: true
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
      preventAssignment: true
    }),
    resolve({
      mainFields: ['module', 'jsnext', 'browser']
    }),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.vue']
    }),
    serve({
      contentBase: path.join(path.dirname(__filename), '../example'),
      host: 'localhost',
      port: 10001
    }),
    livereload({
      verbose: true,
      watch: path.join(path.dirname(__filename), '../example')
    })
  ]
}
