import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  publicDir: '../public',
  server: {
    port: 5902,
    proxy: {
      '/api': {
        target: 'http://localhost:5903',
        changeOrigin: true
      }
    },
    host: true
  }
})
