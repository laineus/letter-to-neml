<script lang="ts">
export const useStoryPlayer = (stories: Story[]) => {
  const state = reactive({
    storyIndex: 0,
    storyItemIndex: 0,
    messageIndex: 0
  })
  const story = computed(() => stories[state.storyIndex])
  const messages = computed(() => {
    const currentSoryItem = story.value.list[state.storyItemIndex]
    if (currentSoryItem.type !== 'messages') return
    return currentSoryItem
  })
  const next = () => {
    if (messages.value && state.messageIndex < messages.value.list.length - 1) {
      state.messageIndex++
      return
    }
    if (state.storyItemIndex < story.value.list.length - 1) {
      state.storyItemIndex++
      state.messageIndex = 0
      return
    }
    if (state.storyIndex < stories.length - 1) {
      state.storyItemIndex = 0
      state.messageIndex = 0
      state.storyIndex++
    }
  }
  return {
    stories,
    get storyItemIndex () { return state.storyItemIndex },
    set storyItemIndex (value: number) { state.storyItemIndex = value },
    get storyIndex () { return state.storyIndex },
    set storyIndex (value: number) { state.storyIndex = value },
    get messageIndex () { return state.messageIndex },
    set messageIndex (value: number) { state.messageIndex = value },
    next
  }
}
</script>

<script setup lang="ts">
import { useScene } from 'phavuer'
import MessageWindow from './MessageWindow.vue'
import Stage from './Stage.vue'
import { computed, reactive, watch, type PropType } from 'vue'
import Background from './Background.vue'
import type { Story } from '../story/types'
const emit = defineEmits(['next'])
const next = () => emit('next')
// const storyIndex = defineModel<number>('storyIndex', { default: 0 })
// const storyItemIndex = defineModel<number>('storyItemIndex', { default: 0 })
// const messageIndex = defineModel<number>('messageIndex', { default: 0 })
const props = defineProps({
  stories: { type: Array as PropType<Story[]>, required: true },
  storyIndex: { type: Number, default: 0 },
  storyItemIndex: { type: Number, default: 0 },
  messageIndex: { type: Number, default: 0 }
})
const stories = computed(() => props.stories)
const storyIndex = computed(() => props.storyIndex)
const storyItemIndex = computed(() => props.storyItemIndex)
const messageIndex = computed(() => props.messageIndex)

const scene = useScene()
const story = computed(() => stories.value[storyIndex.value])
const activeStoryItems = computed(() => story.value.list.slice(0, storyItemIndex.value + 1))
const currentSoryItem = computed(() => activeStoryItems.value[storyItemIndex.value])
const background = computed(() => activeStoryItems.value.slice(0).reverse().find(v => v.type === 'background'))
const speakers = computed(() => activeStoryItems.value.slice(0).reverse().find(v => v.type === 'speakers'))
const sleep = computed(() => {
  if (currentSoryItem.value.type !== 'sleep') return
  return currentSoryItem.value
})
const messages = computed(() => {
  if (currentSoryItem.value.type !== 'messages') return
  return currentSoryItem.value
})
const currentMessage = computed(() => {
  if (!messages.value) return
  return messages.value.list[messageIndex.value]
})
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
  <MessageWindow v-if="currentMessage" :text="currentMessage.text" />
  <button v-if="messages" @click="next">next</button>
</template>
