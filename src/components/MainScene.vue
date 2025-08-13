<script setup lang="ts">
import { Scene } from 'phavuer'
import Story from './Story.vue'
import { stories } from '../story/stories'
import { useStoryPlayer } from './Story.vue'
import { preloadAssets } from '../lib/preload'
const storyPlayer = useStoryPlayer(stories)
const preload = (scene: Phaser.Scene) => {
  preloadAssets(scene)
}
const update = () => {
}
</script>

<template>
  <Scene name="MainScene" @preload="preload" @update="update">
    <Story
      :stories="storyPlayer.stories"
      :storyIndex="storyPlayer.storyIndex"
      :storyItemIndex="storyPlayer.storyItemIndex"
      :messageIndex="storyPlayer.messageIndex"
      @next="storyPlayer.next"
    />
  </Scene>
</template>
