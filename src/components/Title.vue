<script setup lang="ts">
import { Container, Rectangle, Image, useScene } from 'phavuer'
import config from '../lib/config'
import CustomText from './CustomText.vue'
const scene = useScene()
const start = () => {
  scene.scene.start('MainScene')
}
</script>

<template>
  <Container>
    <Rectangle 
      :width="config.WIDTH" 
      :height="config.HEIGHT" 
      :origin="0"
      :fillColor="0x000000"
      @pointerdown="start"
    />
    <Image texture="etc/title-bg" :origin="0" />
    <Image texture="etc/logo-bg" :origin="0.5" :x="config.WIDTH / 2" :y="config.HEIGHT * 0.3" />
    <Image texture="etc/logo-color" :origin="0.5" :x="config.WIDTH / 2" :y="config.HEIGHT * 0.3" :blendMode="1" />
    <!-- <Image texture="etc/logo" :origin="0.5" :x="config.WIDTH / 2" :y="config.HEIGHT * 0.3" /> -->
    <CustomText text="ゲームを開始" :origin="0.5" :x="config.WIDTH / 2" :y="config.HEIGHT * 0.7" />
  </Container>
</template>
