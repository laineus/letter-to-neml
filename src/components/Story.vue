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
    fastForward.value = false
    showLetter.value = true
    return false
  },
  '早送り停止': () => {
    fastForward.value = false
    return true
  },
} as Functions
/** フィールド探索中かどうか */
const exploring = ref(false)
/** 早送り中かどうか */
const fastForward = ref(false)
/** 条件分岐関数 */
const ifFunctions = useIfFunctions()
/** 次の行へ進む */
const next = (fromFastForward = false) => {
  if (fastForward.value && !fromFastForward) return
  if (props.static) return
  waitingStageUpdate = false
  waitingFade = false
  waitingSleep = false
  const result = props.player.next(ifId => {
    const func = ifFunctions[ifId]
    return func ? func() : false
  })
  if (!result) return
  exec()
  if (fastForward.value && props.player.currentStoryItem) {
    setTimeout(() => {
      if (fastForward.value) next(true)
    }, 100)
  }
}
/** その行を処理する */
const exec = () => {
  if (props.player.currentStoryItem?.type === 'background') {
    next()
  }
  if (props.player.currentStoryItem?.type === 'speakers') {
    waitingStageUpdate = true
  }
  if (props.player.currentStoryItem?.type === 'sleep') {
    waitingSleep = true
    scene.time.addEvent({
      delay: props.player.currentStoryItem.duration,
      callback: () => {
        if (!waitingSleep) return
        waitingSleep = false
        next()
      }
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
  if (fastForward.value) {
    toggleFastForward()
    return
  }
  if (exploring.value) return
  if (!props.player.currentMessage) return
  next()
}
/** フェーズ移行待ちフラグ */
let waitingSleep = false
/** ステージ更新待ちフラグ */
let waitingStageUpdate = false
/** フェード待ちフラグ */
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
// 手紙執筆関連
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
const toggleFastForward = () => {
  fastForward.value = !fastForward.value
  next(fastForward.value)
}
</script>

<template>
  <Rectangle :width="config.WIDTH" :height="config.HEIGHT" :origin="0" @pointerdown="tapScreen" />
  <Background v-if="player.currentBackground" :texture="player.currentBackground?.image" />
  <Button :text="exploring ? 'もどる' : 'あたりを見回す'" :x="(200).byRight()" :y="20" :size="18" :width="180" :depth="4000" @click="exploring = !exploring" />
  <Button :text="fastForward ? '止める' : '早送り'" :x="(200 + 190).byRight()" :y="20" :size="18" :width="180" :depth="4000" @click="toggleFastForward" />
  <Things v-if="exploring" :place="player.currentBackground?.image ?? ''" />
  <Stage v-if="player.currentSpeakers?.list.length" :visible="!exploring" :speakers="player.currentSpeakers.list" @end="onStageUpdate" />
  <Fade v-if="player.currentFade" :fade="player.currentFade" @end="onFadeEnd" />
  <MessageWindow v-if="player.currentMessage" :visible="!exploring" :text="player.currentMessage.text" />
  <Letter v-if="showLetter" @submit="submitLetter" />
</template>
