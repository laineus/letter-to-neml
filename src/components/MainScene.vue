<script setup lang="ts">
import { Scene } from 'phavuer'
import Story from './Story.vue'
import { stories } from '../story/stories'
import { useStoryPlayer } from './Story.vue'
import { preloadAssets } from '../lib/preload'
const ifConditions = {
  'じょうけん1': () => true,
  'じょうけん2': () => false,
  'じょうけん3': () => true,
  'じょうけん4': () => false,
  'じょうけん1と2': () => ifConditions['じょうけん1']() && ifConditions['じょうけん2'](),
  'じょうけん1か2': () => ifConditions['じょうけん1']() || ifConditions['じょうけん2']()
}
const storyPlayer = useStoryPlayer(stories, ifConditions)
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
