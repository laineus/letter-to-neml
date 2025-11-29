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
  prev: StateRecord | null
  current: StateRecord | null
}

export const save = () => {
  localStorage.setItem('data1', JSON.stringify(state.value))
}
export const load = () => {
  const saved = localStorage.getItem('data1')
  return saved ? JSON.parse(saved) as GameState : undefined
}
const makeState = (): GameState => {
  return {
    currentStory: 0,
    completedStories: [],
    completedBranches: [],
    prev: null,
    current: null
  }
}
export const state = ref(load() ?? makeState())
