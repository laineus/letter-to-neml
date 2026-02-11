import { ref } from 'vue'
import type { Branch } from '../story/types'

const KEY_NAME = 'saveData'

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

// ユーザーIDの生成・取得
const generateUserId = (): string => {
  return Date.now().toString()
}
export const getUserId = (): string => {
  const userId = localStorage.getItem('userId')
  if (userId) return userId
  const newId = generateUserId()
  localStorage.setItem('userId', newId)
  return newId
}

export const save = () => {
  localStorage.setItem(KEY_NAME, JSON.stringify(state.value))
  window.steamAPI?.saveToCloud(KEY_NAME, JSON.stringify(state.value)).then(result => {
    console.log('Cloud save result: ', result)
  })
}
export const load = () => {
  const saved = localStorage.getItem(KEY_NAME)
  return saved ? JSON.parse(saved) as GameState : undefined
}
const getBrowserLang = (): string => {
  const nav = window.navigator
  if (nav.languages) return nav.languages[0]
  // @ts-ignore
  return nav.language || nav.userLanguage || nav.browserLanguage
}
const getDefaultLangSetting = () => {
  const lang = getBrowserLang()
  if (lang.startsWith('ja')) return 'ja'
  if (lang.startsWith('zh')) return 'cn'
  return 'en'
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
      lang: getDefaultLangSetting()
    }
  }
}
export const state = ref(load() ?? makeState())

/** Steam Cloudからセーブデータ読み込み */
export const loadFromSteamCloud = async () => {
  return window.steamAPI?.loadFromCloud(KEY_NAME).then(dataRaw => {
    console.log('Cloud save data retrieved:', dataRaw)
    if (!dataRaw) return
    try {
      state.value = JSON.parse(dataRaw) as GameState
    } catch (e) {
      console.error('Failed to parse cloud save data:', e)
    }
  })
}
