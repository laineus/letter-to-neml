<script setup lang="ts">
import { ref } from 'vue'
import { Container, Rectangle, Scene } from 'phavuer'
import { preloadAssets } from '../lib/preload'
import Title from './Title.vue'
import { initGamePad } from '../lib/gamePad'
import CustomText from './CustomText.vue'
import config from '../lib/config'
const progress = ref(0)
const prepared = ref(false)
const init = (scene: Phaser.Scene) => {
  initGamePad(scene)
}
const preload = (scene: Phaser.Scene) => {
  scene.load.on('progress', (value: number) => {
    progress.value = Math.max(value, progress.value)
  })
  scene.load.on('complete', () => {
    prepared.value = true
  })
  preloadAssets(scene)
  scene.add.rectangle(0, 0, 10, 10, 0xff0000)
}
</script>

<template>
  <Scene name="TitleScene" :auto-start="true" @init="init" @preload="preload">
    <Title v-if="prepared" />
    <Container :x="config.WIDTH.half()" :y="config.HEIGHT.half()" v-else>
      <CustomText :text="`Loading ${Math.round(progress * 100)}%`" :origin="0.5" :y="-30" />
      <Rectangle :width="200" :height="4" :fillColor="0x555555" :originY="0" />
      <Rectangle :width="200" :height="4" :fillColor="0x66bb00" :originX="0" :originY="0" :x="-100" :scaleX="progress" />
    </Container>
  </Scene>
</template>
