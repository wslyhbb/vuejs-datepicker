import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue2'
import pkg from './package.json'
import { resolve } from 'path'

export default defineConfig(() => {
  const banner =
    '/*!\n' +
    ' * vuejs-datepicker v' + pkg.version + '\n' +
    ' * (c) 2023-' + new Date().getFullYear() + ' Wesley Hobbie\n' +
    ' * Released under the MIT License.\n' +
    ' */'
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      lib: {
        entry: resolve(__dirname, './src/components/Datepicker.vue'),
        name: 'vuejsDatepicker',
        formats: ['es', 'umd', 'iife', 'cjs'],
        fileName: (format) => {
          if (format === 'es') {
            return 'vuejs-datepicker.mjs'
          } else if (format === 'iife') {
            return 'vuejs-datepicker.min.js'
          } else if (format === 'cjs') {
            return 'vuejs-datepicker.common.js'
          } else {
            return `vuejs-datepicker.${format}.js`
          }
        }
      },
      rollupOptions: {
        external: ['vue', 'date-fns'],
        output: {
          banner,
          globals: {
            vue: 'Vue',
            'date-fns': 'dateFns'
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') return 'vuejs-datepicker.css'
            return assetInfo.name
          }
        }
      }
    }
  }
})
