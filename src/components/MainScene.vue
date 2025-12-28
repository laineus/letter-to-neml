<script setup lang="ts">
import { Scene } from 'phavuer'
import Story from './Story.vue'
import { stories } from '../story/stories'
import { useStoryPlayer } from '../lib/storyPlayer'
import { ref } from 'vue'
import { state } from '../lib/state'
import { initGamePad } from '../lib/gamePad'
const storyPlayer = ref<ReturnType<typeof useStoryPlayer>>()
const init = (scene: Phaser.Scene) => {
  initGamePad(scene)
  storyPlayer.value = useStoryPlayer(stories)
  storyPlayer.value.storyIndex = state.value.currentStory ?? 0
}
</script>

<template>
  <Scene name="MainScene" @init="init">
    <Story v-if="storyPlayer" :player="storyPlayer" />
  </Scene>
</template>
