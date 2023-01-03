import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      // local specific config
      plugins: [vue()],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./example', import.meta.url))
        }
      },
      server: {
        host: 'localhost',
        port: 10001
      }
    }
  } else {
    return {
      // build specific config
      plugins: [vue()]
    }
  }
})
