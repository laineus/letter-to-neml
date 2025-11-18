<script setup lang="ts">
import { Scene } from 'phavuer'
import Story from './Story.vue'
import { stories } from '../story/stories'
import { preloadAssets } from '../lib/preload'
import { useStoryPlayer } from '../lib/storyPlayer'
const storyPlayer = useStoryPlayer(stories)
const preload = (scene: Phaser.Scene) => {
  preloadAssets(scene)
}
const update = () => {
}
</script>

<template>
  <Scene name="MainScene" @preload="preload" @update="update">
    <Story :player="storyPlayer" />
  </Scene>
</template>

<style>
canvas {
  display: block;
  width: 100%;
}
[data-phavuer-game] {
  position: relative;
}
</style>
