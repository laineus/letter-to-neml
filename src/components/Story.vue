<script lang="ts">
export const useStoryPlayer = (stories: Story[]) => {
  const state = reactive({
    storyIndex: 0,
    storyItemIndex: 0,
    messageIndex: 0
  })
  const story = computed(() => stories[state.storyIndex])
  const currentStoryItem = computed(() => story.value.list[state.storyItemIndex])
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
  const next = (testIf: (v: string) => boolean) => {
    if (currentMessages.value && state.messageIndex < currentMessages.value.list.length - 1) {
      state.messageIndex++
      return
    }
    if (state.storyItemIndex < story.value.list.length - 1) {
      state.storyItemIndex++
      state.messageIndex = 0
      if (currentStoryItem.value.type === 'if') {
        if (!testIf(currentStoryItem.value.if)) {
          state.storyItemIndex = story.value.list.findIndex((v, i) => i > state.storyItemIndex && v.type === 'endIf')
        }
        next(testIf)
      } else if (currentStoryItem.value.type === 'endIf') {
        next(testIf)
      }
      return
    }
    if (state.storyIndex < stories.length - 1) {
      state.storyItemIndex = 0
      state.messageIndex = 0
      state.storyIndex = state.storyIndex + stories.slice(state.storyIndex + 1).findIndex(v => !v.if || testIf(v.if)) + 1
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
type IfConditions = {
  [key: string]: () => boolean
}
const ifConditions = {
  'じょうけん1': () => true,
  'じょうけん2': () => false,
  'じょうけん3': () => true,
  'じょうけん4': () => false,
  'じょうけん1と2': () => ifConditions['じょうけん1']() && ifConditions['じょうけん2'](),
  'じょうけん1か2': () => ifConditions['じょうけん1']() || ifConditions['じょうけん2']()
} as IfConditions
type Functions = {
  [key: string]: () => boolean
}
const functions = {
  'イベント1': () => {
    alert('イベント1が発生しました！')
    return true
  },
} as Functions
const props = defineProps({
  player: {
    type: Object as PropType<ReturnType<typeof useStoryPlayer>>,
    required: true
  },
  static: {
    type: Boolean,
    default: false
  }
})
const next = () => {
  if (props.static) return
  props.player.next(ifId => {
    const conditionFunc = ifConditions[ifId]
    return conditionFunc ? conditionFunc() : false
  })
  exec()
}
const exec = () => {
  waitingStageUpdate = false
  if (props.player.currentStoryItem?.type === 'background') {
    next()
  }
  if (props.player.currentStoryItem?.type === 'speakers') {
    waitingStageUpdate = true
  }
  if (props.player.currentStoryItem?.type === 'sleep') {
    scene.time.addEvent({
      delay: props.player.currentStoryItem.duration,
      callback: () => next()
    })
  }
  if (props.player.currentStoryItem?.type === 'function') {
    const functionFunc = functions[props.player.currentStoryItem.function]
    if (!functionFunc) {
      console.warn(`関数が見つかりません: ${props.player.currentStoryItem.function}`)
      next()
      return
    }
    if (functionFunc()) next()
  }
}
const scene = useScene()
const tapScreen = () => {
  if (!props.player.currentMessage) return
  next()
}
let waitingStageUpdate = false
const onStageUpdate = () => {
  if (!waitingStageUpdate) return
  next()
}
exec()
</script>

<template>
  <Rectangle :width="config.WIDTH" :height="config.HEIGHT" :origin="0" @pointerdown="tapScreen" />
  <Background v-if="player.currentBackground" :texture="player.currentBackground?.image" />
  <Stage v-if="player.currentSpeakers?.list.length" :speakers="player.currentSpeakers.list" @end="onStageUpdate" />
  <MessageWindow v-if="player.currentMessage" :text="player.currentMessage.text" />
</template>
