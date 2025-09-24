<script setup lang="ts">
import { Game } from 'phavuer'
import config from './lib/config.ts'
import MainScene from './components/MainScene.vue'
import ChatAi from './components/ChatAi.vue'
const gameConfig: Phaser.Types.Core.GameConfig = {
  width: config.WIDTH,
  height: config.HEIGHT,
  preserveDrawingBuffer: true
}
const onCreate = (game: Phaser.Game) => {
  console.log(game)
  window.addEventListener('resize', () => game.scale.refresh())
}
</script>

<template>
  <Game :config="gameConfig" @create="onCreate">
    <MainScene />
  </Game>
  <ChatAi />
</template>
