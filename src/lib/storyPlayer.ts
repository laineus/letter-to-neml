import { computed, reactive } from 'vue'
import type { Story } from '../story/types'

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
  const backToStart = () => {
    state.storyItemIndex = 0
    state.messageIndex = 0
  }
  const backToPrevStory = () => {
    if (state.storyIndex > 0) {
      state.storyIndex--
      state.storyItemIndex = 0
      state.messageIndex = 0
    } else {
      backToStart()
    }
  }
  const skipIf = () => {
    const endIfIndex = story.value.list.slice(state.storyItemIndex + 1).reduce((acc, item, index) => {
      if (acc.endIfIndex !== -1) return acc
      if (item.type === 'if') acc.ifNestCount++
      if (item.type === 'endIf') {
        acc.ifNestCount--
        if (acc.ifNestCount === 0) {
          acc.endIfIndex = state.storyItemIndex + 1 + index
        }
      }
      return acc
    }, { ifNestCount: 1, endIfIndex: -1 }).endIfIndex
    if (endIfIndex === -1) throw new Error('endIf not found')
    state.storyItemIndex = endIfIndex
    state.messageIndex = 0
    next()
  }
  const skipStory = () => {
    if (state.storyIndex >= stories.length - 1) return false
    state.storyItemIndex = 0
    state.messageIndex = 0
    state.storyIndex++
    return true
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
    next,
    skipIf,
    skipStory,
    backToStart,
    backToPrevStory
  }
}
