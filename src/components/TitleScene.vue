<script setup lang="ts">
import { Scene } from 'phavuer'
import { preloadAssets } from '../lib/preload'
import Title from './Title.vue'
import { initGamePad } from '../lib/gamePad'
const init = (scene: Phaser.Scene) => {
  initGamePad(scene)
}
const preload = (scene: Phaser.Scene) => {
  preloadAssets(scene)
}
const update = () => {
}
</script>

<template>
  <Scene name="TitleScene" @init="init" @preload="preload" @update="update">
    <Title />
  </Scene>
</template>
