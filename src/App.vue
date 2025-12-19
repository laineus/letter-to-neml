<script setup lang="ts">
import { Game } from 'phavuer'
import config from './lib/config.ts'
import MainScene from './components/MainScene.vue'
import TitleScene from './components/TitleScene.vue'
import { state } from './lib/state.ts'
const gameConfig: Phaser.Types.Core.GameConfig = {
  width: config.WIDTH,
  height: config.HEIGHT,
  preserveDrawingBuffer: true
}
const onCreate = (game: Phaser.Game) => {
  console.log(game)
  window.addEventListener('resize', () => game.scale.refresh())
  game.sound.volume = state.value.settings.volume
}
</script>

<template>
  <Game :config="gameConfig" @create="onCreate">
    <TitleScene :autoStart="true" />
    <MainScene :autoStart="false" />
  </Game>
</template>
