import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import phaserAssetsRollupPlugin from 'phaser-assets-loader/plugins/rollupPlugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    phaserAssetsRollupPlugin({
      patterns: [
        { type: 'image', dir: '/images/chara', rule: /^[\w-]+\.(webp|png|jpg)$/, prefix: 'chara/' },
        { type: 'image', dir: '/images/bg', rule: /^[\w-]+\.(webp|png|jpg)$/, prefix: 'bg/' }
      ],
      output: './src/assets.json'
    })
  ],
  server: {
    port: 5900
  }
})
