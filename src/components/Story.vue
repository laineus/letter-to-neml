<script setup lang="ts">
import { Container, FxBlur, Rectangle, useScene } from 'phavuer'
import MessageWindow from './MessageWindow.vue'
import Stage from './Stage.vue'
import Fade from './Fade.vue'
import { computed, ref, watch, type PropType } from 'vue'
import Background from './Background.vue'
import type { Branch, StoryIf, StoryItem, Thing } from '../story/types'
import config from '../lib/config'
import Letter from './Letter.vue'
import { useIfFunctions } from '../lib/ifFunctions'
import type { useStoryPlayer } from '../lib/storyPlayer'
import { save, state } from '../lib/state'
import Things from './Things.vue'
import Button from './Button.vue'
import Dialog, { useDialogs } from './Dialog.vue'
import { useDamage, useShake } from '../lib/effect'
import IconButton from './IconButton.vue'
import { thingDefinitions, things } from '../story/things'
import Hint, { useHint } from './Hint.vue'
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
  [key: string]: (argument: string) => boolean
}
let waiting = false
const resolveWaiting = () => {
  if (!waiting) return
  if (exploring.value || showLetter.value || dialog.current) {
    scene.time.addEvent({
      delay: 100,
      callback: resolveWaiting
    })
    return
  }
  waiting = false
  next()
}
const cancelWaiting = () => {
  waiting = false
}
const completeEnding = (endIndex: number) => {
  if (!state.value.completedEndings.includes(endIndex)) {
    state.value.completedEndings.push(endIndex)
    save()
  }
}
const functions = {
  '手紙執筆': () => {
    fastForward.value = false
    showLetter.value = true
    return false
  },
  '衝撃': () => {
    shake.exec(() => resolveWaiting())
    return false
  },
  'ダメージ': () => {
    damage.exec(() => resolveWaiting())
    return false
  },
  'UI非表示': () => true,
  'ゲームオーバー': arg => {
    completeEnding(parseInt(arg))
    return false
  },
  'エンディング': arg => {
    completeEnding(parseInt(arg))
    return false
  }
} as Functions
const toTitle = () => {
  scene.scene.start('TitleScene')
}
const scene = useScene()
const dialog = useDialogs()
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
watch(() => props.player.storyIndex, (current, prev) => {
  if (current > prev && !state.value.completedStories.includes(prev)) {
    state.value.completedStories.push(prev)
    save()
  }
})
const activeStoryItems = computed(() => {
  return props.player.story.list.slice(0, props.player.storyItemIndex + 1)
})
type StoryItemByType<T extends StoryItem['type']> = Extract<StoryItem, { type: T }>
const findLastRow = <T extends StoryItem['type']>(target: T | ((v: StoryItem) => boolean)) => {
  return activeStoryItems.value.slice(0).reduce((result, v) => {
    if (v.type === 'if') {
      const func = ifFunctions[v.if]
      if (result.ignoredIfCnt > 0 || (func && !func())) {
        result.ignoredIfCnt++
      }
    }
    if (v.type === 'endIf') {
      if (result.ignoredIfCnt > 0) {
        result.ignoredIfCnt--
      }
    }
    if (result.ignoredIfCnt > 0) return result
    if (typeof target === 'function' ? target(v) : v.type === target) {
      result.found = v as StoryItemByType<T>
    }
    return result
  }, { ignoredIfCnt:0, found: undefined as undefined | StoryItemByType<T> } ).found
}
const currentBackground = computed(() => findLastRow('background'))
const currentSpeakers = computed(() => findLastRow('speakers'))
const currentFade = computed(() => {
  const lastFade = findLastRow('fade')
  return lastFade?.fade === 'in' || props.player.currentStoryItem === lastFade ? lastFade : undefined
})
const currentIf = computed(() => findLastRow('if'))
const uiHidden = computed(() => findLastRow(v => v.type === 'function' && v.function === 'UI非表示'))
const currentThings = computed(() => {
  const result = findLastRow<'function'>(v => v.type === 'function' && v.function === 'オブジェクト')
  if (!result) return undefined
  const ids = thingDefinitions[result.argument]
  return ids.map(id => things.find(v => v.id === id)!)
})
/** 次の行へ進む */
const next = () => {
  if (props.static) return
  cancelWaiting()
  const result = props.player.next()
  if (!result) return
  exec()
}
/** その行を処理する */
const exec = () => {
  cancelWaiting()
  if (props.player.storyItemIndex === 0) {
    if (props.player.story.if) {
      const func = ifFunctions[props.player.story.if]
      if (func && !func()) {
        if (props.player.skipStory()) {
          exec()
        }
        return
      }
    }
    state.value.currentStory = props.player.storyIndex
    save()
    // シーンが変わったら早送り停止
    fastForward.value = false
  }
  if (props.player.currentStoryItem?.type === 'if') {
    const func = ifFunctions[props.player.currentStoryItem.if]
    if (func && !func()) {
      props.player.skipIf()
      next()
    } else {
      // 初めてプレイする分岐なら早送り停止
      const ifName = getIfName(props.player.currentStoryItem)
      if (!state.value.completedBranches.includes(ifName)) {
        if (fastForward.value) {
          fastForward.value = false
          dialog.show({
            title: '初めての分岐',
            desc: '早送りを停止しました。',
            options: [{ text: 'OK', close: true }]
          })
        }
        // プレイ済みの分岐として保存
        state.value.completedBranches.push(ifName)
        save()
      }
      next()
    }
  } else if (props.player.currentStoryItem?.type === 'endIf') {
    next()
  } else if (props.player.currentStoryItem?.type === 'background') {
    next()
  } else if (props.player.currentStoryItem?.type === 'speakers') {
    waiting = true
  } else if (props.player.currentStoryItem?.type === 'sleep') {
    waiting = true
    scene.time.addEvent({
      delay: fastForward.value ? 70 : props.player.currentStoryItem.duration,
      callback: resolveWaiting
    })
  } else if (props.player.currentStoryItem?.type === 'fade') {
    waiting = true
  } else if (props.player.currentStoryItem?.type === 'function') {
    const functionFunc = functions[props.player.currentStoryItem.function]
    if (!functionFunc) {
      // console.warn(`関数が見つかりません: ${props.player.currentStoryItem.function}`)
      next()
      return
    }
    if (functionFunc(props.player.currentStoryItem.argument)) next()
  } else if (props.player.currentStoryItem?.type === 'messages') {
    if (fastForward.value) {
      waiting = true
      scene.time.addEvent({
        delay: 100,
        callback: resolveWaiting
      })
    }
  }
}
const skipScene = () => {
  if (!state.value.completedStories.includes(props.player.storyIndex)) {
    dialog.show({
      title: '未完了のシーン',
      desc: 'このシーンは未完了のためスキップできません。',
      options: [{ text: 'OK', close: true }]
    })
    return
  }
  if (!props.player.next()) return
  if (props.player.storyItemIndex === 0) return exec()
  if (props.player.currentStoryItem.type === 'function') {
    if (props.player.currentStoryItem.function === 'ゲームオーバー') return
    if (props.player.currentStoryItem.function === 'エンディング') return
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
        // プレイ済みの分岐として保存
        state.value.completedBranches.push(ifName)
        save()
        return next()
      }
    }
  }
  skipScene()
}
const backToFirst = () => {
  fastForward.value = false
  dialog.show({
    title: '最初のシーンへ戻る',
    desc: 'ニーナ出発前のシーンへ戻り、手紙を書き直します。\nよろしいですか？',
    options: [
      { text: 'OK', close: true, action: () => {
        props.player.reset()
        exec()
      } },
      { text: 'キャンセル', close: true }
    ]
  })
}
const backScene = () => {
  if (props.player.messageIndex > 0 || props.player.story.list.slice(0, props.player.storyItemIndex).some(v => v.type === 'messages')) {
    props.player.backToStart()
  } else {
    props.player.backToPrevStory()
    if (props.player.story.if) {
      const func = ifFunctions[props.player.story.if]
      if (func && !func()) {
        backScene()
        return
      }
    }
  }
  exec()
}
const tapScreen = () => {
  if (props.player.currentStoryItem.type === 'function' && props.player.currentStoryItem.function === 'ゲームオーバー') {
    goingToTitle.value = true
    if (!state.value.completedStories.includes(state.value.currentStory)) {
      state.value.completedStories.push(state.value.currentStory)
    }
    state.value.currentStory = 0
    save()
    return
  }
  // 仮
  if (props.player.currentStoryItem.type === 'function' && props.player.currentStoryItem.function === 'エンディング') {
    goingToTitle.value = true
    if (!state.value.completedStories.includes(state.value.currentStory)) {
      state.value.completedStories.push(state.value.currentStory)
    }
    state.value.currentStory = 0
    save()
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
exec()
// 手紙執筆関連
const showLetter = ref(false)
const submitLetter = (v: { letter: string; branches: Branch[] } | undefined) => {
  if (v) {
    if (state.value.current) {
      state.value.prev = state.value.current
    }
    state.value.current = {
      letter: v.letter,
      branches: v.branches
    }
    save() // 手紙を確定したらセーブ
  }
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
const toggleFastForward = () => {
  // if (!fastForward.value && !state.value.completedStories.includes(props.player.storyIndex)) {
  //   dialog.show({
  //     title: '未完了のシーン',
  //     desc: 'このシーンは未完了のため早送りできません。',
  //     options: [{ text: 'OK', close: true }]
  //   })
  //   return
  // }
  fastForward.value = !fastForward.value
  next()
}
const toggleExploring = () => {
  fastForward.value = false
  exploring.value = !exploring.value
}
const showHint = () => {
  const hint = useHint()
  dialog.show({
    title: 'ヒント',
    desc: hint.currentHint,
    options: [{ text: '閉じる', close: true }]
  })
}
</script>

<template>
  <!-- TapArea -->
  <Rectangle :width="config.WIDTH" :height="config.HEIGHT" :origin="0" @pointerdown="tapScreen" />
  <!-- Background and Stage -->
  <Container :depth="1000">
    <Background v-if="currentBackground" :x="shake.x" :y="shake.y" :texture="currentBackground?.image" />
    <Stage v-if="currentSpeakers" :visible="!exploring" :speaking="player.currentMessage?.name" :speakers="currentSpeakers.list" @end="resolveWaiting" />
    <FxBlur v-if="dialog.current || showLetter" :post="true" :strength="2" :quality="1" :steps="7" />
  </Container>
  <Rectangle :width="config.WIDTH" :height="config.HEIGHT" :origin="0" :fillColor="0xFF1100" :alpha="damage.alpha" :depth="2500" />
  <Fade v-if="currentFade" :fade="currentFade" :depth="3000" @end="resolveWaiting" />
  <!-- UI -->
  <template v-if="!uiHidden && !dialog.current && !showLetter && !currentFade">
    <Hint :x="(140).byRight()" :y="20" :size="18" :width="120" :depth="4000" @click="showHint" />
    <Button v-if="currentThings?.length" :text="exploring ? 'もどる' : 'あたりを見回す'" :x="(330).byRight()" :y="20" :size="18" :width="180" :depth="4000" @click="toggleExploring" />
    <template v-if="!exploring">
      <IconButton icon="settings" :x="((50 * 0) + 60).byRight()" :y="(60).byBottom()" :depth="8000" />
      <IconButton icon="next" :x="((50 * 1) + 60).byRight()" :y="(60).byBottom()" :depth="8000" @click="skipScene" />
      <IconButton :icon="fastForward ? 'pause' : 'fastforward'" :x="((50 * 2) + 60).byRight()" :y="(60).byBottom()" :depth="8000" @click="toggleFastForward" />
      <IconButton icon="prev" :x="((50 * 3) + 60).byRight()" :y="(60).byBottom()" :depth="8000" @click="backScene" />
      <IconButton icon="replay" :x="((50 * 4) + 60).byRight()" :y="(60).byBottom()" :depth="8000" @click="backToFirst" />
    </template>
  </template>
  <Things v-if="exploring && !dialog.current" :things="currentThings ?? []" @select="selectThing" />
  <MessageWindow v-if="player.currentMessage" :visible="!dialog.current && !showLetter && !exploring" :title="player.currentMessage.name" :text="player.currentMessage.text" />
  <Letter v-if="showLetter" @submit="submitLetter" />
  <Fade v-if="goingToTitle" :fade="{ type: 'fade', fade: 'in', duration: 3000 }" :depth="3000" @end="toTitle" />
  <!-- Dialog -->
  <Rectangle :origin="0" :width="config.WIDTH" :height="config.HEIGHT" :depth="2000" :fillColor="0x888888" :alpha="0.2" v-if="dialog.current || showLetter" />
  <Dialog v-if="dialog.current" :title="dialog.current.title" :desc="dialog.current.desc" :options="dialog.current.options" @close="dialog.close" :depth="8000" />
</template>
