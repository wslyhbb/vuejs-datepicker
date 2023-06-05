import path from 'path'
import { fileURLToPath } from 'url'
import vue from 'rollup-plugin-vue'
import babel from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import common from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import node from '@rollup/plugin-node-resolve'
import css from 'rollup-plugin-css-only'
import CleanCSS from 'clean-css'
import alias from '@rollup/plugin-alias'

import fs from 'fs'

import { readFile } from 'fs/promises'
const packageJson = JSON.parse(
  await readFile(
    new URL('../package.json', import.meta.url)
  )
)
const version = packageJson.version
export const banner =
  '/*!\n' +
  ' * vuejs-datepicker v' + version + '\n' +
  ' * (c) 2023-' + new Date().getFullYear() + ' Wesley Hobbie\n' +
  ' * Released under the MIT License.\n' +
  ' */'

export default {
  input: path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/components/Datepicker.vue'),
  plugins: [
    node({
      extensions: ['.js', '.jsx', '.vue']
    }),
    common(),
    css({
      output: (style) => {
        fs.writeFileSync('dist/vuejs-datepicker.css', new CleanCSS().minify(style).styles)
      }
    }),
    alias({
      entries: [
        {
          find: '@',
          replacement: path.join(path.dirname(fileURLToPath(import.meta.url)), '../src')
        }
      ]
    }),
    vue({
      css: false,
      compileTemplate: true,
      template: {
        isProduction: true
      }
    }),
    postcss({
      plugins: [
        autoprefixer()
      ]
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true
    }),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.vue']
    })
  ]
}
