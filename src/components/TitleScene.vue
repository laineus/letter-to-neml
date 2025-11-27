<script setup lang="ts">
import { Scene } from 'phavuer'
import { preloadAssets } from '../lib/preload'
import Title from './Title.vue'
const preload = (scene: Phaser.Scene) => {
  preloadAssets(scene)
}
const update = () => {
}
</script>

<template>
  <Scene name="TitleScene" @preload="preload" @update="update">
    <Title />
  </Scene>
</template>
