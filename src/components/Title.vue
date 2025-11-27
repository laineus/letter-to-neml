<script setup lang="ts">
import { Container, Rectangle, Text, useScene } from 'phavuer'
import config from '../lib/config'
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
    <Text text="ゲームを開始" :origin="0.5" :x="config.WIDTH / 2" :y="config.HEIGHT / 2" />
  </Container>
</template>
