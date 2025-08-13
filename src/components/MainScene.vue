<script setup lang="ts">
import { Scene } from 'phavuer'
import assets from '../assets.json'
import { type PhaserAssets } from 'phaser-assets-loader'
import Story from './Story.vue'
import { stories } from '../story/stories'
import { useStoryPlayer } from './Story.vue'
const storyPlayer = useStoryPlayer(stories)
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
    <Story
      :stories="storyPlayer.stories"
      :storyIndex="storyPlayer.storyIndex"
      :storyItemIndex="storyPlayer.storyItemIndex"
      :messageIndex="storyPlayer.messageIndex"
      @next="storyPlayer.next"
    />
  </Scene>
</template>
