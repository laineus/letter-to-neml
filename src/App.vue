<script setup lang="ts">
import { Game } from 'phavuer'
import config from './lib/config.ts'
import MainScene from './components/MainScene.vue'
import TitleScene from './components/TitleScene.vue'
import { getUserId, state } from './lib/state.ts'
import { ref } from 'vue'
import VideoRecorder from './components/VideoRecorder.vue'
const isDev = import.meta.env.DEV
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
const userId = getUserId()
</script>

<template>
  <div class="Container" :class="{ fullscreen }">
    <Game :config="gameConfig" @create="onCreate">
      <TitleScene :autoStart="true" />
      <MainScene :autoStart="false" />
      <VideoRecorder v-if="isDev" />
    </Game>
    <a href="#" class="FullscreenButton" v-if="!fullscreen" @click.prevent="fullscreen = true">
      <img src="/images/etc/fullscreen.png" alt="">
    </a>
    <p class="SurveyLink" v-if="!isElectron">
      <a :href="`https://docs.google.com/forms/d/e/1FAIpQLSdlRifE0S6I8MMKd66fHztDvgETyMjaepLjGaBmawJXkIlb2g/viewform?usp=pp_url&entry.2104594982=${userId}`" target="_blank">
        アンケート/不具合報告フォーム
      </a>
    </p>
  </div>
</template>

<style>
.SurveyLink {
  padding: 15px;
  text-align: center;
}
.SurveyLink a {
  color: white;
  font-size: 14px;
}
</style>
