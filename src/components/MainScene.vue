<script setup lang="ts">
import { Scene, useScene } from 'phavuer'
import assets from '../assets.json'
import { type PhaserAssets } from 'phaser-assets-loader'
import MessageWindow from './MessageWindow.vue'
import { useMessagePlayer } from '../lib/message'
import Stage from './Stage.vue'
import { computed, reactive, ref } from 'vue'
import Background from './Background.vue'
import { stories } from '../story/stories'
import type { SpeakerConfig } from '../story/types'
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
const storyIndex = ref(0)
const story = computed(() => stories[storyIndex.value])
const storyItemIndex = ref(0)
const activeStoryItems = computed(() => story.value.list.slice(0, storyItemIndex.value + 1))
const currentSoryItem = computed(() => activeStoryItems.value[storyItemIndex.value])
const background = computed(() => activeStoryItems.value.slice(0).reverse().find(v => v.type === 'background'))
const speakers = computed(() => activeStoryItems.value.slice(0).reverse().find(v => v.type === 'speakers'))
const messagePlayer = computed(() => {
  if (currentSoryItem.value.type !== 'messages') return
  const messagePlayer = useMessagePlayer(currentSoryItem.value.list)
  messagePlayer.on('end', () => {
    next()
  })
  return messagePlayer
})
const next = () => {
  if (storyItemIndex.value < story.value.list.length - 1) {
    storyItemIndex.value++
    return
  }
  if (storyIndex.value < stories.length - 1) {
    storyItemIndex.value = 0
    storyIndex.value++
    if (storyIndex.value >= stories.length) {
      // ..
    }
  }
}
</script>

<template>
  <Scene name="MainScene" @preload="preload" @update="update">
    <Background v-if="background" :texture="background?.image" @end="next" />
    <Stage v-if="speakers?.list.length" :speakers="speakers.list" @end="next" />
    <MessageWindow v-if="messagePlayer" :text="messagePlayer.current.text" />
  </Scene>
  <button v-if="messagePlayer" @click="messagePlayer.next">next</button>
</template>
