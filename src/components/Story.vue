<script setup lang="ts">
import { Rectangle, useScene } from 'phavuer'
import MessageWindow from './MessageWindow.vue'
import Stage from './Stage.vue'
import Fade from './Fade.vue'
import { ref, type PropType } from 'vue'
import Background from './Background.vue'
import type { Branch } from '../story/types'
import config from '../lib/config'
import Letter from './Letter.vue'
import { useIfFunctions } from '../lib/ifFunctions'
import type { useStoryPlayer } from '../lib/storyPlayer'
import { save, state } from '../lib/state'
import Things from './Things.vue'
import Button from './Button.vue'
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
type Functions = {
  [key: string]: () => boolean
}
const functions = {
  '手紙執筆': () => {
    showLetter.value = true
    return false
  },
  'イベント1': () => {
    alert('イベント1が発生しました！')
    return true
  },
} as Functions
const ifFunctions = useIfFunctions()
const next = () => {
  if (props.static) return
  props.player.next(ifId => {
    const func = ifFunctions[ifId]
    return func ? func() : false
  })
  exec()
}
const exec = () => {
  waitingStageUpdate = false
  waitingFade = false
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
  if (props.player.currentStoryItem?.type === 'fade') {
    waitingFade = true
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
let waitingFade = false
const onStageUpdate = () => {
  if (!waitingStageUpdate) return
  next()
}
const onFadeEnd = () => {
  if (!waitingFade) return
  next()
}
exec()
const showLetter = ref(false)
const submitLetter = (v: { letter: string; branches: Branch[] }) => {
  state.value.current = {
    letter: v.letter,
    branches: v.branches
  }
  save() // 手紙を確定したらセーブ
  showLetter.value = false
  next()
}
// stateの初期化
if (state.value.current) {
  state.value.prev = state.value.current
  state.value.current = undefined
}
const exploring = ref(false)
</script>

<template>
  <Rectangle v-if="!exploring" :width="config.WIDTH" :height="config.HEIGHT" :origin="0" @pointerdown="tapScreen" />
  <Background v-if="player.currentBackground" :texture="player.currentBackground?.image" />
  <Button :text="exploring ? 'もどる' : 'あたりを見回す'" :x="(200).byRight()" :y="20" :size="18" :width="180" :depth="4000" @click="exploring = !exploring" />
  <Things v-if="exploring" :place="player.currentBackground?.image ?? ''" />
  <Stage v-if="player.currentSpeakers?.list.length" :visible="!exploring" :speakers="player.currentSpeakers.list" @end="onStageUpdate" />
  <Fade v-if="player.currentFade" :fade="player.currentFade" @end="onFadeEnd" />
  <MessageWindow v-if="player.currentMessage" :visible="!exploring" :text="player.currentMessage.text" />
  <Letter v-if="showLetter" @submit="submitLetter" />
</template>
