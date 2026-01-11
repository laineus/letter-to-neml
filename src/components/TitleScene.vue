<script setup lang="ts">
import { ref } from 'vue'
import { Container, Image, Rectangle, Scene, type Phavuer } from 'phavuer'
import { preloadAssets } from '../lib/preload'
import Title from './Title.vue'
import { initGamePad } from '../lib/gamePad'
import CustomText from './CustomText.vue'
import config from '../lib/config'
const progress = ref(0)
const prepared = ref(false)
const displayedLogo = ref(false)
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
const logoTween: Phavuer.TweenConfig = {
  duration: 600,
  yoyo: true,
  hold: 900,
  props: {
    alpha: {
      from: 0, to: 1
    }
  },
  onComplete: () => {
    displayedLogo.value = true
  }
}
</script>

<template>
  <Scene name="TitleScene" :auto-start="true" @init="init" @preload="preload">
    <template v-if="prepared">
      <Title v-if="displayedLogo" />
      <Image v-else texture="etc/logo-laineus" :x="config.WIDTH.half()" :y="config.HEIGHT.half()" :tween="logoTween" />
    </template>
    <Container :x="config.WIDTH.half()" :y="config.HEIGHT.half()" v-else>
      <CustomText :text="`Loading ${Math.round(progress * 100)}%`" :origin="0.5" :y="-30" />
      <Rectangle :width="200" :height="3" :fillColor="0x333333" :originY="0" />
      <Rectangle :width="200" :height="3" :fillColor="0xffffff" :originX="0" :originY="0" :x="-100" :scaleX="progress" />
    </Container>
  </Scene>
</template>
