<script setup lang="ts">
import { Scene } from 'phavuer'
import assets from '../assets.json'
import { type PhaserAssets } from 'phaser-assets-loader'
import MessageWindow from './MessageWindow.vue'
import { useMessagePlayer } from '../lib/message'
import Stage from './Stage.vue'
import { reactive, ref } from 'vue'
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
const messagePlayer = useMessagePlayer([
  { image: '', name: 'a', text: 'こんにちは。\nあああああいいいいいいいいええええええええええええええええええええおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおお' },
  { image: '', name: 'a', text: 'さあああああああああああ' }
])
messagePlayer.on('end', () => {
  console.log('end')
})
const speakers = ref([
  { image: 'image/chara', x: 0.15 }
])
setTimeout(() => {
  const s2 = reactive({ image: 'image/chara2', x: 0.85 })
  speakers.value.push(s2)
  setTimeout(() => {
    s2.x = 0.5
  }, 1000)
}, 1000)
</script>

<template>
  <Scene name="MainScene" @preload="preload" @update="update">
    <Stage :speakers />
    <MessageWindow :text="messagePlayer.current.text" />
  </Scene>
  <button @click="messagePlayer.next">next</button>
</template>
