import { ref } from 'vue'
import type { Branch } from '../story/types'

type StateRecord = {
  letter: string
  branches: Branch[]
}
export type GameState = {
  prev?: StateRecord
  current?: StateRecord
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
    prev: undefined,
    current: undefined
  }
}
export const state = ref(load() ?? makeState())
