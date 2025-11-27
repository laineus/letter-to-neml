<script setup lang="ts">
import { Scene } from 'phavuer'
import Story from './Story.vue'
import { stories } from '../story/stories'
import { useStoryPlayer } from '../lib/storyPlayer'
import { ref } from 'vue'
const storyPlayer = ref<ReturnType<typeof useStoryPlayer>>()
const init = () => {
  storyPlayer.value = useStoryPlayer(stories)
}
</script>

<template>
  <Scene name="MainScene" @init="init">
    <Story v-if="storyPlayer" :player="storyPlayer" />
  </Scene>
</template>
