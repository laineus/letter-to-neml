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
  const currentMessages = computed(() => {
    return currentStoryItem.value?.type === 'messages' ? currentStoryItem.value : undefined
  })
  const currentMessage = computed(() => {
    if (!currentMessages.value) return
    return currentMessages.value.list[state.messageIndex]
  })
  const activeStoryItems = computed(() => {
    return story.value.list.slice(0, state.storyItemIndex + 1)
  })
  const currentBackground = computed(() => {
    return activeStoryItems.value.slice(0).reverse().find(v => v.type === 'background')
  })
  const currentSpeakers = computed(() => {
    return activeStoryItems.value.slice(0).reverse().find(v => v.type === 'speakers')
  })
  const next = () => {
    if (currentMessages.value && state.messageIndex < currentMessages.value.list.length - 1) {
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
    get currentMessages () { return currentMessages.value },
    get currentMessage () { return currentMessage.value },
    get currentStoryItem () { return currentStoryItem.value },
    get currentBackground () { return currentBackground.value },
    get currentSpeakers () { return currentSpeakers.value },
    next
  }
}
</script>

<script setup lang="ts">
import { Rectangle, useScene } from 'phavuer'
import MessageWindow from './MessageWindow.vue'
import Stage from './Stage.vue'
import { computed, reactive, type PropType } from 'vue'
import Background from './Background.vue'
import type { Story } from '../story/types'
import config from '../lib/config'
const next = () => {
  props.player.next()
  if (props.player.currentStoryItem?.type === 'sleep') {
    scene.time.addEvent({
      delay: props.player.currentStoryItem.duration,
      callback: () => next()
    })
  }
}
const props = defineProps({
  player: {
    type: Object as PropType<ReturnType<typeof useStoryPlayer>>,
    required: true
  }
})
const scene = useScene()
const tapScreen = () => {
  if (!props.player.currentMessage) return
  next()
}
</script>

<template>
  <Rectangle :width="config.WIDTH" :height="config.HEIGHT" :origin="0" @pointerdown="tapScreen" />
  <Background v-if="player.currentBackground" :texture="player.currentBackground?.image" @end="next" />
  <Stage v-if="player.currentSpeakers?.list.length" :speakers="player.currentSpeakers.list" @end="next" />
  <MessageWindow v-if="player.currentMessage" :text="player.currentMessage.text" />
</template>
