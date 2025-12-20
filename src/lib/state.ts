import { ref } from 'vue'
import type { Branch } from '../story/types'

type StateRecord = {
  letter: string
  branches: Branch[]
}
export type GameState = {
  currentStory: number
  completedStories: number[]
  completedBranches: string[]
  completedEndings: number[]
  checkedHints: number[]
  prev: StateRecord | null
  current: StateRecord | null
  settings: {
    volume: number
    lang: string
  }
}

export const save = () => {
  localStorage.setItem('saveData', JSON.stringify(state.value))
}
export const load = () => {
  const saved = localStorage.getItem('saveData')
  return saved ? JSON.parse(saved) as GameState : undefined
}
const makeState = (): GameState => {
  return {
    currentStory: 0,
    completedStories: [],
    completedBranches: [],
    completedEndings: [],
    checkedHints: [],
    prev: null,
    current: null,
    settings: {
      volume: 1,
      lang: 'ja'
    }
  }
}
export const state = ref(load() ?? makeState())
