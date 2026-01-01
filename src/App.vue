<script setup lang="ts">
import { Game } from 'phavuer'
import config from './lib/config.ts'
import MainScene from './components/MainScene.vue'
import TitleScene from './components/TitleScene.vue'
import { state } from './lib/state.ts'
import { ref } from 'vue'
const gameConfig: Phaser.Types.Core.GameConfig = {
  input: {
    gamepad: true
  },
  width: config.WIDTH,
  height: config.HEIGHT,
  preserveDrawingBuffer: true
}
const onCreate = (game: Phaser.Game) => {
  console.log(game)
  window.addEventListener('resize', () => game.scale.refresh())
  game.sound.volume = state.value.settings.volume
}
const isElectron = navigator.userAgent.toLowerCase().includes(' electron/')
const fullscreen = ref(isElectron ? true : false)
</script>

<template>
  <div class="Container" :class="{ fullscreen }">
    <Game :config="gameConfig" @create="onCreate">
      <TitleScene :autoStart="true" />
      <MainScene :autoStart="false" />
    </Game>
    <a href="#" class="FullscreenButton" v-if="!fullscreen" @click.prevent="fullscreen = true">
      <img src="/images/etc/fullscreen.png" alt="">
    </a>
  </div>
</template>
