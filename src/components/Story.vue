<script setup lang="ts">
import { Container, FxBlur, Rectangle, useScene } from 'phavuer'
import MessageWindow from './MessageWindow.vue'
import Stage from './Stage.vue'
import Fade from './Fade.vue'
import { ref, type PropType } from 'vue'
import Background from './Background.vue'
import type { Branch, StoryIf } from '../story/types'
import config from '../lib/config'
import Letter from './Letter.vue'
import { useIfFunctions } from '../lib/ifFunctions'
import type { useStoryPlayer } from '../lib/storyPlayer'
import { save, state } from '../lib/state'
import Things from './Things.vue'
import Button from './Button.vue'
import Dialog, { useDialogs } from './Dialog.vue'
import type { Thing } from './Thing.vue'
import { useDamage, useShake } from '../lib/effect'
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
  '衝撃': () => {
    shake.exec(() => next())
    return false
  },
  'ダメージ': () => {
    damage.exec(() => next())
    return false
  },
  'UI非表示': () => {
    uiHidden.value = true
    return true
  },
  'ゲームオーバー:報復': () => false,
  'ゲームオーバー:投獄': () => false,
  'ゲームオーバー:昏睡': () => false,
  'ゲームオーバー:心中': () => false
} as Functions
const toTitle = () => {
  scene.scene.start('TitleScene')
}
const scene = useScene()
const dialog = useDialogs()
/** UIが非表示かどうか */
const uiHidden = ref(false)
/** タイトル画面に戻るかどうか */
const goingToTitle = ref(false)
/** フィールド探索中かどうか */
const exploring = ref(false)
/** 早送り中かどうか */
const fastForward = ref(false)
/** 画面揺れ効果 */
const shake = useShake(scene)
/** ダメージ効果 */
const damage = useDamage(scene)
/** 条件分岐関数 */
const ifFunctions = useIfFunctions()
/** 分岐名取得 */
const getIfName = (ifItem: StoryIf) => {
  const currentIfIndex = props.player.story.list.filter(v => v.type === 'if').findIndex(v => v === ifItem)
  return `${props.player.storyIndex}-${currentIfIndex}`
}
/** 次の行へ進む */
const next = () => {
  if (props.static) return
  waitingStageUpdate = false
  waitingFade = false
  waitingSleep = false
  const result = props.player.next()
  if (!result) return
  exec()
}
/** その行を処理する */
const exec = () => {
  if (props.player.storyItemIndex === 0) {
    if (props.player.story.if) {
      const func = ifFunctions[props.player.story.if]
      if (func && !func()) {
        props.player.skipStory()
        exec()
        return
      }
    }
    // シーンが変わったら早送り停止
    fastForward.value = false
  }
  if (props.player.currentStoryItem?.type === 'if') {
    const func = ifFunctions[props.player.currentStoryItem.if]
    if (func && !func()) {
      props.player.skipIf()
      exec()
    } else {
      // 初めてプレイする分岐なら早送り停止
      const ifName = getIfName(props.player.currentStoryItem)
      if (fastForward.value && !state.value.completedBranches.includes(ifName)) {
        fastForward.value = false
        dialog.show({
          title: '初めての分岐',
          desc: '早送りを停止しました。',
          options: [{ text: 'OK', close: true }]
        })
      }
      next()
    }
  } else if (props.player.currentStoryItem?.type === 'endIf') {
    const currentIf = props.player.currentIf
    // プレイ済みの分岐として保存
    if (currentIf) {
      const ifName = getIfName(currentIf)
      if (!state.value.completedBranches.includes(ifName)) {
        state.value.completedBranches.push(ifName)
        save()
      }
    }
    next()
  } else if (props.player.currentStoryItem?.type === 'background') {
    next()
  } else if (props.player.currentStoryItem?.type === 'speakers') {
    waitingStageUpdate = true
  } else if (props.player.currentStoryItem?.type === 'sleep') {
    waitingSleep = true
    scene.time.addEvent({
      delay: fastForward.value ? 70 : props.player.currentStoryItem.duration,
      callback: () => {
        if (!waitingSleep) return
        waitingSleep = false
        next()
      }
    })
  } else if (props.player.currentStoryItem?.type === 'fade') {
    waitingFade = true
  } else if (props.player.currentStoryItem?.type === 'function') {
    const functionFunc = functions[props.player.currentStoryItem.function]
    if (!functionFunc) {
      console.warn(`関数が見つかりません: ${props.player.currentStoryItem.function}`)
      next()
      return
    }
    if (functionFunc()) next()
  } else if (props.player.currentStoryItem?.type === 'messages') {
    if (fastForward.value) {
      scene.time.addEvent({
        delay: 100,
        callback: () => {
          if (fastForward.value) next()
        }
      })
    }
  }
}
const skipScene = () => {
  if (!props.player.next()) return
  if (props.player.storyItemIndex === 0) return exec()
  if (props.player.currentStoryItem.type === 'function') {
    if (props.player.currentStoryItem.function.startsWith('ゲームオーバー')) return
    if (props.player.currentStoryItem.function === '手紙執筆') return exec()
  }
  if (props.player.currentStoryItem.type === 'if') {
    const func = ifFunctions[props.player.currentStoryItem.if]
    if (func && !func()) {
      props.player.skipIf()
    } else {
      // 初めてプレイする分岐ならスキップ中断
      const ifName = getIfName(props.player.currentStoryItem)
      if (!state.value.completedBranches.includes(ifName)) {
        dialog.show({
          title: '初めての分岐',
          desc: 'スキップを中断しました。',
          options: [{ text: 'OK', close: true }]
        })
        return next()
      }
    }
  }
  skipScene()
}
const backScene = () => {
  if (props.player.messageIndex > 0 || props.player.story.list.slice(0, props.player.storyItemIndex).some(v => v.type === 'messages')) {
    props.player.backToStart()
  } else {
    props.player.backToPrevStory()
  }
  exec()
}
const tapScreen = () => {
  if (props.player.currentStoryItem.type === 'function' && props.player.currentStoryItem.function.startsWith('ゲームオーバー')) {
    goingToTitle.value = true
    return
  }
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
// 捜索
const selectThing = (thing: Thing) => {
  dialog.show({
    title: thing.name,
    desc: thing.desc,
    options: [{ text: '閉じる', close: true }]
  })
}
// stateの初期化
if (state.value.current) {
  state.value.prev = state.value.current
  state.value.current = undefined
}
const toggleFastForward = () => {
  fastForward.value = !fastForward.value
  next()
}
const toggleExploring = () => {
  fastForward.value = false
  exploring.value = !exploring.value
}
</script>

<template>
  <!-- TapArea -->
  <Rectangle :width="config.WIDTH" :height="config.HEIGHT" :origin="0" @pointerdown="tapScreen" />
  <!-- Background and Stage -->
  <Container :depth="1000">
    <Background v-if="player.currentBackground" :x="shake.x" :y="shake.y" :texture="player.currentBackground?.image" />
    <Stage v-if="player.currentSpeakers?.list.length" :visible="!exploring" :speaking="player.currentMessage?.name" :speakers="player.currentSpeakers.list" @end="onStageUpdate" />
    <FxBlur v-if="dialog.current || showLetter" :post="true" :strength="2" :quality="1" :steps="7" />
  </Container>
  <Rectangle :width="config.WIDTH" :height="config.HEIGHT" :origin="0" :fillColor="0xFF1100" :alpha="damage.alpha" :depth="2500" />
  <Fade v-if="player.currentFade" :fade="player.currentFade" :depth="3000" @end="onFadeEnd" />
  <!-- UI -->
  <template v-if="!uiHidden && !dialog.current && !showLetter && !player.currentFade">
    <Button :text="exploring ? 'もどる' : 'あたりを見回す'" :x="(200).byRight()" :y="20" :size="18" :width="180" :depth="4000" @click="toggleExploring" />
    <Button v-if="!exploring" :text="fastForward ? '止める' : '早送り'" :x="(200 + 190).byRight()" :y="20" :size="18" :width="180" :depth="4000" @click="toggleFastForward" />
    <Button v-if="!exploring" :text="'スキップ'" :x="(200 + 190 + 190).byRight()" :y="20" :size="18" :width="180" :depth="4000" @click="skipScene" />
    <Button v-if="!exploring" :text="'もどる'" :x="(200 + 190 + 190 + 190).byRight()" :y="20" :size="18" :width="180" :depth="4000" @click="backScene" />
  </template>
  <Things v-if="exploring && !dialog.current" :place="player.currentBackground?.image ?? ''" @select="selectThing" />
  <MessageWindow v-if="player.currentMessage" :visible="!dialog.current && !showLetter && !exploring" :title="player.currentMessage.name" :text="player.currentMessage.text" />
  <Letter v-if="showLetter" @submit="submitLetter" />
  <Fade v-if="goingToTitle" :fade="{ type: 'fade', fade: 'in', duration: 3000 }" :depth="3000" @end="toTitle" />
  <!-- Dialog -->
  <Rectangle :origin="0" :width="config.WIDTH" :height="config.HEIGHT" :depth="2000" :fillColor="0x888888" :alpha="0.2" v-if="dialog.current || showLetter" />
  <Dialog v-if="dialog.current" :title="dialog.current.title" :desc="dialog.current.desc" :options="dialog.current.options" @close="dialog.close" :depth="8000" />
</template>
