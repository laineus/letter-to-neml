<script setup lang="ts">
import { Container, FxBlur, Rectangle, useScene } from 'phavuer'
import MessageWindow from './MessageWindow.vue'
import Stage from './Stage.vue'
import Fade from './Fade.vue'
import { computed, onBeforeUnmount, ref, watch, type PropType } from 'vue'
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
import { useAudioPlayer } from '../lib/audioPlayer'
import Config from './Config.vue'
import Ending from './Ending.vue'
import { useGamePad } from '../lib/gamePad'
import { uiTexts } from '../lib/ui'
import { useUISound } from '../lib/se'
import { completeEnding } from '../story/endings'
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
const se = useUISound()
type Functions = {
  [key: string]: (argument: string) => boolean
}
let waiting = false
const resolveWaiting = () => {
  if (!waiting) return
  if (exploring.value || showLetter.value || dialog.current || configModal.value) {
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
const functions = {
  '手紙執筆': () => {
    fastForward.value = false
    showLetter.value = true
    selectedButton.value = undefined
    return false
  },
  '衝撃': () => {
    waiting = true
    shake.exec(() => resolveWaiting())
    return false
  },
  'ダメージ': () => {
    waiting = true
    damage.exec(() => resolveWaiting())
    return false
  },
  'UI非表示': () => {
    selectedButton.value = undefined
    return true
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
  return ids.map(id => things.value.find(v => v.id === id)!)
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
const exec = (fromSkip = false) => {
  cancelWaiting()
  if (props.player.storyItemIndex === 0) {
    if (props.player.story.if) {
      const func = ifFunctions[props.player.story.if]
      if (func && !func()) {
        if (props.player.skipStory()) {
          exec(fromSkip)
        }
        return
      }
      // 初めてプレイする分岐かどうか
      const ifName = String(props.player.storyIndex)
      if (!state.value.completedBranches.includes(ifName)) {
        if (fastForward.value || fromSkip) {
          dialog.show({
            title: '初めての分岐',
            desc: fromSkip ? 'スキップを停止しました。' : '早送りを停止しました。',
            options: [{ text: 'OK', close: true }]
          })
        }
        // プレイ済みの分岐として保存
        state.value.completedBranches.push(ifName)
        save()
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
          selectedButton.value = undefined
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
  } else if (props.player.currentStoryItem?.type === 'audio') {
    if (props.player.currentStoryItem.audioType === 'se') {
      scene.sound.play(props.player.currentStoryItem.audio)
    }
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
      title: uiTexts.value.story.incompleteScene,
      desc: uiTexts.value.story.cannotSkipIncompleteScene,
      options: [{ text: uiTexts.value.common.ok, close: true }]
    })
    return
  }
  if (!props.player.next()) return
  if (props.player.storyItemIndex === 0) return exec(true)
  if (props.player.currentStoryItem.type === 'function') {
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
        selectedButton.value = undefined
        dialog.show({
          title: uiTexts.value.story.firstBranch,
          desc: uiTexts.value.story.skipInterrupted,
          options: [{ text: uiTexts.value.common.ok, close: true }]
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
  se.click()
  fastForward.value = false
  dialog.show({
    title: uiTexts.value.story.backToFirstScene,
    desc: uiTexts.value.story.backToFirstSceneConfirm,
    options: [
      { text: uiTexts.value.common.ok, close: true, action: () => {
        props.player.reset()
        exec()
      } },
      { text: uiTexts.value.common.cancel, close: true }
    ]
  })
}
const backScene = () => {
  se.click()
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
  if (props.player.currentStoryItem.type === 'function' && props.player.currentStoryItem.function === 'エンディング') {
    endingIndex.value = parseInt(props.player.currentStoryItem.argument)
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
  se.click()
  dialog.show({
    title: thing.name,
    desc: thing.desc,
    options: [{ text: uiTexts.value.common.close, close: true }]
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
  fastForward.value ? se.click() : se.cancel()
}
const toggleExploring = () => {
  selectedButton.value = undefined
  fastForward.value = false
  exploring.value = !exploring.value
  exploring.value ? se.click() : se.cancel()
}
const showHint = () => {
  se.click()
  const hint = useHint()
  if (hint.currentHintIndex && !state.value.checkedHints.includes(hint.currentHintIndex)) {
    state.value.checkedHints.push(hint.currentHintIndex)
  }
  selectedButton.value = undefined
  dialog.show({
    title: uiTexts.value.story.hint,
    desc: hint.currentHint,
    options: [{ text: uiTexts.value.common.close, close: true }]
  })
}
const configModal = ref(false)
const endingIndex = ref<number>()
const finishEnding = () => {
  if (endingIndex.value && endingIndex.value >= 4) {
    if (!state.value.completedStories.includes(state.value.currentStory)) {
      state.value.completedStories.push(state.value.currentStory)
    }
  }
  state.value.currentStory = 0
  save()
  toTitle()
}
const isShowingDialog = computed(() => {
  return dialog.current || showLetter.value || configModal.value
})
// BGM制御
const audioPlayer = useAudioPlayer(scene)
const bgm = computed(() => findLastRow<'audio'>(v => v.type === 'audio' && v.audioType === 'bgm')?.audio)
if (!props.static) watch(bgm, key => audioPlayer.play(key || null), { immediate: true })
onBeforeUnmount(() => {
  audioPlayer.stop()
})

// ゲームパッド操作
type selectionType = typeof headerButtons[number] | typeof footerButtons[number] | undefined
const headerButtons = ['lookaround', 'hint'] as const
const footerButtons = ['replay', 'prev', 'fastforward', 'next', 'settings'] as const
const selectedButton = ref<selectionType>(undefined)
const gamePad = useGamePad()
gamePad.onPress(key => {
  if (isShowingDialog.value) return
  // 探索中
  if (exploring.value) {
    if (selectedButton.value === undefined) return
    if (key === 'right') {
      selectedButton.value = 'hint'
      se.select()
    } else if (key === 'left') {
      selectedButton.value = selectedButton.value === 'lookaround' ? undefined : 'lookaround'
      se.select()
    } else if (key === 'down') {
      selectedButton.value = undefined
      se.select()
    } else if (key === 'a') {
      if (selectedButton.value === 'lookaround') {
        toggleExploring()
      } else if (selectedButton.value === 'hint') {
        showHint()
      }
    } else if (key === 'b') {
      toggleExploring()
    }
    return
  }
  // uiHidden
  if (uiHidden.value) {
    selectedButton.value = undefined
    if (key === 'a') {
      tapScreen()
    }
    return
  }
  // 通常時
  if (key === 'b') {
    if (fastForward.value) {
      toggleFastForward()
    } else if (selectedButton.value) {
      selectedButton.value = undefined
      se.cancel()
    }
  } else if (key === 'up') {
    if (selectedButton.value === undefined) {
      selectedButton.value = currentThings.value?.length && !currentFade.value ? 'lookaround' : 'hint'
      se.select()
    } else if (footerButtons.includes(selectedButton.value as any)) {
      selectedButton.value = undefined
      se.cancel()
    }
  } else if (key === 'down') {
    if (selectedButton.value === undefined) {
      selectedButton.value = 'fastforward'
      se.select()
    } else if (headerButtons.includes(selectedButton.value as any)) {
      selectedButton.value = undefined
      se.cancel()
    }
  } else if (key === 'left' || key === 'right') {
    const direction = key === 'left' ? -1 : 1
    if (headerButtons.includes(selectedButton.value as any)) {
      const availableButtons = currentThings.value?.length && !currentFade.value ? headerButtons : headerButtons.filter(v => v !== 'lookaround')
      const currentIndex = availableButtons.indexOf(selectedButton.value as any)
      const nextIndex = (currentIndex + direction + availableButtons.length) % availableButtons.length
      selectedButton.value = availableButtons[nextIndex]
      se.select()
    } else if (footerButtons.includes(selectedButton.value as any)) {
      const currentIndex = footerButtons.indexOf(selectedButton.value as any)
      const nextIndex = (currentIndex + direction + footerButtons.length) % footerButtons.length
      selectedButton.value = footerButtons[nextIndex]
      se.select()
    }
  } else if (key === 'a') {
    if (selectedButton.value === undefined) {
      tapScreen()
    } else if (selectedButton.value === 'lookaround' && !currentFade.value) {
      toggleExploring()
      if (exploring.value) {
        selectedButton.value = undefined
      }
    } else if (selectedButton.value === 'hint') {
      showHint()
    } else if (selectedButton.value === 'replay') {
      backToFirst()
    } else if (selectedButton.value === 'prev') {
      backScene()
    } else if (selectedButton.value === 'fastforward') {
      toggleFastForward()
    } else if (selectedButton.value === 'next') {
      se.click()
      skipScene()
    } else if (selectedButton.value === 'settings') {
      configModal.value = true
      se.click()
    }
  }
})
gamePad.onDeactivate(() => {
  selectedButton.value = undefined
})
const unfocus = () => {
  selectedButton.value = 'lookaround'
}
</script>

<template>
  <!-- TapArea -->
  <Rectangle :width="config.WIDTH" :height="config.HEIGHT" :origin="0" @pointerdown="tapScreen" />
  <!-- Background and Stage -->
  <Container :depth="1000">
    <Background v-if="currentBackground" :x="shake.x" :y="shake.y" :texture="currentBackground?.image" />
    <Stage v-if="currentSpeakers" :visible="!exploring" :speaking="player.currentMessage?.name" :speakers="currentSpeakers.list" @end="resolveWaiting" />
    <FxBlur v-if="isShowingDialog" :post="true" :strength="2" :quality="1" :steps="7" />
  </Container>
  <Rectangle v-if="isShowingDialog" :origin="0" :width="config.WIDTH" :height="config.HEIGHT" :depth="2000" :fillColor="0x888888" :alpha="0.2" />
  <Rectangle :width="config.WIDTH" :height="config.HEIGHT" :origin="0" :fillColor="0xFF1100" :alpha="damage.alpha" :depth="2500" />
  <Fade v-if="currentFade" :fade="currentFade" :depth="3000" @end="resolveWaiting" />
  <!-- UI -->
  <template v-if="!uiHidden && !isShowingDialog">
    <Hint :active="selectedButton === 'hint'" :x="(140).byRight()" :y="20" :depth="4000" @click="showHint" />
    <Button v-if="currentThings?.length && !currentFade" :active="selectedButton === 'lookaround'" :text="exploring ? uiTexts.story.lookBack : uiTexts.story.lookAround" :x="(330).byRight()" :y="20" :size="18" :width="180" :depth="4000" @click="toggleExploring" />
    <template v-if="!exploring">
      <IconButton :active="selectedButton === 'settings'" icon="settings" :x="((50 * 0) + 60).byRight()" :y="(60).byBottom()" :depth="8000" @click="configModal = true, se.click()" />
      <IconButton :active="selectedButton === 'next'" icon="next" :x="((50 * 1) + 60).byRight()" :y="(60).byBottom()" :depth="8000" @click="skipScene(), se.click()" />
      <IconButton :active="selectedButton === 'fastforward'" :icon="fastForward ? 'pause' : 'fastforward'" :x="((50 * 2) + 60).byRight()" :y="(60).byBottom()" :depth="8000" @click="toggleFastForward" />
      <IconButton :active="selectedButton === 'prev'" icon="prev" :x="((50 * 3) + 60).byRight()" :y="(60).byBottom()" :depth="8000" @click="backScene" />
      <IconButton :active="selectedButton === 'replay'" icon="replay" :x="((50 * 4) + 60).byRight()" :y="(60).byBottom()" :depth="8000" @click="backToFirst" />
    </template>
  </template>
  <Things v-if="exploring" :visible="!dialog.current" :focus="selectedButton === undefined" :things="currentThings ?? []" @select="selectThing" @unfocus="unfocus" />
  <MessageWindow v-if="player.currentMessage" :visible="!isShowingDialog && !exploring" :title="player.currentMessage.name" :text="player.currentMessage.text" />
  <!-- Dialog -->
  <Dialog v-if="dialog.current" :title="dialog.current.title" :desc="dialog.current.desc" :options="dialog.current.options" @close="dialog.close" :depth="8000" />
  <Config v-else-if="configModal" :showBackToTitle="true" @close="configModal = false, selectedButton = undefined" :depth="8000" />
  <Letter v-else-if="showLetter" @submit="submitLetter" />
  <!-- Ending -->
  <Ending v-if="endingIndex !== undefined" :depth="7000" :endingIndex @end="finishEnding" />
</template>
