<script lang="ts">
type IfNode = {
  if: string
  start: number
  end: number
}
const getIfNodes = (story: Story) => {
  return story.list.reduce((result, v, i) => {
    if (v.type === 'if') {
      result.nodeIndex++
      result.nodes[result.nodeIndex] = {
        if: v.if,
        start: i,
        end: Infinity
      }
    } else if (v.type === 'endIf') {
      result.nodes[result.nodeIndex].end = i
      result.nodeIndex--
    }
    return result
  }, { nodes: [] as IfNode[], nodeIndex: -1 }).nodes
}
type IfConditions = {
  [key: string]: () => boolean
}

export const useStoryPlayer = (stories: Story[], ifConditions: IfConditions) => {
  const state = reactive({
    storyIndex: 0,
    storyItemIndex: 0,
    messageIndex: 0
  })
  const story = computed(() => stories[state.storyIndex])
  const currentStoryItem = computed(() => story.value.list[state.storyItemIndex])
  const ifNodes = computed(() => getIfNodes(story.value))
  const messages = computed(() => {
    return currentStoryItem.value?.type === 'messages' ? currentStoryItem.value : undefined
  })
  const next = () => {
    if (messages.value && state.messageIndex < messages.value.list.length - 1) {
      state.messageIndex++
      return
    }
    if (state.storyItemIndex < story.value.list.length - 1) {
      state.storyItemIndex++
      state.messageIndex = 0
      if (currentStoryItem.value.type === 'if') {
        const conditionFunc = ifConditions[currentStoryItem.value.if]
        const conditionResult = conditionFunc ? conditionFunc() : false
        if (!conditionResult) {
          const ifNode = ifNodes.value.find(v => v.start === state.storyItemIndex)
          if (ifNode) {
            state.storyItemIndex = ifNode.end
          }
        }
        next()
      } else if (currentStoryItem.value.type === 'endIf') {
        next()
      }
      return
    }
    if (state.storyIndex < stories.length - 1) {
      state.storyItemIndex = 0
      state.messageIndex = 0
      state.storyIndex = state.storyIndex + stories.slice(state.storyIndex + 1).findIndex(v => {
        if (!v.if) return true
        const conditionFunc = ifConditions[v.if]
        return conditionFunc ? conditionFunc() : false
      }) + 1 
    }
  }
  return {
    stories,
    get story () { return story.value },
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
import { Rectangle, useScene } from 'phavuer'
import MessageWindow from './MessageWindow.vue'
import Stage from './Stage.vue'
import { computed, reactive, watch, type PropType } from 'vue'
import Background from './Background.vue'
import type { Branch, Story } from '../story/types'
import config from '../lib/config'
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
  if (currentSoryItem.value?.type !== 'sleep') return
  return currentSoryItem.value
})
const messages = computed(() => {
  if (currentSoryItem.value?.type !== 'messages') return
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
const tapScreen = () => {
  if (!currentMessage.value) return
  next()
}
</script>

<template>
  <Rectangle :width="config.WIDTH" :height="config.HEIGHT" :origin="0" @pointerdown="tapScreen" />
  <Background v-if="background" :texture="background?.image" @end="next" />
  <Stage v-if="speakers?.list.length" :speakers="speakers.list" @end="next" />
  <MessageWindow v-if="currentMessage" :text="currentMessage.text" />
</template>
