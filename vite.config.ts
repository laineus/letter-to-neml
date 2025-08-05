import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import phaserAssetsRollupPlugin from 'phaser-assets-loader/plugins/rollupPlugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    phaserAssetsRollupPlugin({
      patterns: [
        { type: 'image', dir: '/images', rule: /^\w+\.(webp|png|jpg)$/, prefix: 'image/' }
      ],
      output: './src/assets.json'
    })
  ],
})
