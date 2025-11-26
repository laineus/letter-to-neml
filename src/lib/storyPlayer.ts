import { computed, reactive } from 'vue'
import type { Story, StoryItem } from '../story/types'

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
  type StoryItemByType<T extends StoryItem['type']> = Extract<StoryItem, { type: T }>
  const findLastRow = <T extends StoryItem['type']>(type: T) => {
    return activeStoryItems.value.slice(0).reverse().reduce((result, v) => {
      if (result.background) return result
      if (v.type === 'if') result.ifCnt = Math.max(0, result.ifCnt - 1)
      if (v.type === 'endIf') result.ifCnt++
      if (result.ifCnt === 0 && v.type === type) result.background = v as StoryItemByType<T>
      return result
    }, { ifCnt:0, background: undefined as undefined | StoryItemByType<T> } ).background
  }
  const currentBackground = computed(() => findLastRow('background'))
  const currentSpeakers = computed(() => findLastRow('speakers'))
  const currentFade = computed(() => {
    const lastFade = findLastRow('fade')
    return lastFade?.fade === 'in' || currentStoryItem.value === lastFade ? lastFade : undefined
  })
  const currentIf = computed(() => findLastRow('if'))
  const next = () => {
    // 次のメッセージ
    if (currentMessages.value && state.messageIndex < currentMessages.value.list.length - 1) {
      state.messageIndex++
      return true
    }
    // 次のストーリー行
    if (state.storyItemIndex < story.value.list.length - 1) {
      state.storyItemIndex++
      state.messageIndex = 0
      return true
    }
    // 次のシーン
    if (state.storyIndex < stories.length - 1) {
      state.storyItemIndex = 0
      state.messageIndex = 0
      state.storyIndex++
      return true
    }
    return false
  }
  const skipIf = () => {
    const endIfIndex = story.value.list.findIndex((v, i) => i > state.storyItemIndex && v.type === 'endIf')
    if (endIfIndex === -1) throw new Error('endIf not found')
    state.storyItemIndex = endIfIndex
    state.messageIndex = 0
    next()
  }
  const skipStory = () => {
    state.storyItemIndex = 0
    state.messageIndex = 0
    state.storyIndex++
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
    get currentFade () { return currentFade.value },
    get currentIf () { return currentIf.value },
    next,
    skipIf,
    skipStory
  }
}
