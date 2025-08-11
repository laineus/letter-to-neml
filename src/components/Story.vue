<script setup lang="ts">
import { useScene } from 'phavuer'
import MessageWindow from './MessageWindow.vue'
import { useMessagePlayer } from '../lib/message'
import Stage from './Stage.vue'
import { computed, ref, watch } from 'vue'
import Background from './Background.vue'
import { stories } from '../story/stories'
const scene = useScene()
const storyIndex = ref(0)
const story = computed(() => stories[storyIndex.value])
const storyItemIndex = ref(0)
const activeStoryItems = computed(() => story.value.list.slice(0, storyItemIndex.value + 1))
const currentSoryItem = computed(() => activeStoryItems.value[storyItemIndex.value])
const background = computed(() => activeStoryItems.value.slice(0).reverse().find(v => v.type === 'background'))
const speakers = computed(() => activeStoryItems.value.slice(0).reverse().find(v => v.type === 'speakers'))
const sleep = computed(() => {
  if (currentSoryItem.value.type !== 'sleep') return
  return currentSoryItem.value
})
const messagePlayer = computed(() => {
  if (currentSoryItem.value.type !== 'messages') return
  const messagePlayer = useMessagePlayer(currentSoryItem.value.list)
  messagePlayer.on('end', () => {
    next()
  })
  return messagePlayer
})
const next = () => {
  if (storyItemIndex.value < story.value.list.length - 1) {
    storyItemIndex.value++
    return
  }
  if (storyIndex.value < stories.length - 1) {
    storyItemIndex.value = 0
    storyIndex.value++
    if (storyIndex.value >= stories.length) {
      // ..
    }
  }
}
watch(sleep, (newSleep) => {
  if (!newSleep) return
  scene.time.addEvent({
    delay: newSleep.duration,
    callback: () => next()
  })
}, { immediate: true })
</script>

<template>
  <Background v-if="background" :texture="background?.image" @end="next" />
  <Stage v-if="speakers?.list.length" :speakers="speakers.list" @end="next" />
  <MessageWindow v-if="messagePlayer" :text="messagePlayer.current.text" />
  <button v-if="messagePlayer" @click="messagePlayer.next">next</button>
</template>
