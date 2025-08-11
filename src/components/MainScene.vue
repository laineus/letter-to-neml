<script setup lang="ts">
import { Scene } from 'phavuer'
import assets from '../assets.json'
import { type PhaserAssets } from 'phaser-assets-loader'
import Story from './Story.vue'
const phaserAssets = assets as unknown as PhaserAssets
const preload = (scene: Phaser.Scene) => {
  Object.entries(phaserAssets).forEach(([method, list]) => {
    switch (method) {
      case 'image': return list.forEach(([name, path]) => scene.load.image(name, path))
      case 'audio': return list.forEach(([name, path]) => scene.load.audio(name, path))
    }
  })
  Object.keys(localStorage).filter(key => key.startsWith('chara/')).forEach(key => {
    const charaImage = JSON.parse(localStorage.getItem(key)!)
    scene.textures.addBase64(key, charaImage)
  })
}
const update = () => {
}
</script>

<template>
  <Scene name="MainScene" @preload="preload" @update="update">
    <Story />
  </Scene>
</template>
