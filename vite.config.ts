import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import phaserAssetsRollupPlugin from 'phaser-assets-loader/plugins/rollupPlugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    phaserAssetsRollupPlugin({
      patterns: [
        { type: 'image', dir: '/images/chara', rule: /^[\w-.]+\.(webp|png|jpg)$/, prefix: 'chara/' },
        { type: 'image', dir: '/images/bg', rule: /^[\w-.]+\.(webp|png|jpg)$/, prefix: 'bg/' },
        { type: 'image', dir: '/images/etc', rule: /^[\w-]+\.(webp|png|jpg)$/, prefix: 'etc/' },
        { type: 'audio', dir: '/audio/bgm', rule: /^[\w-]+\.(mp3|ogg|wav)$/, prefix: 'bgm/' },
        { type: 'audio', dir: '/audio/se', rule: /^[\w-]+\.(mp3|ogg|wav)$/, prefix: 'se/' }
      ],
      output: './src/assets.json'
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        app: 'app.html'
      }
    }
  },
  server: {
    port: 5900,
    proxy: {
      '/api': {
        target: 'http://localhost:5901',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
