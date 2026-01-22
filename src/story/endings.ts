import { save, state } from '../lib/state'
import endingsJaJson from './endings.ja.json' with { type: 'json' }
import endingsEnJson from './endings.en.json' with { type: 'json' }
import { computed } from 'vue'
export type Ending = {
  id: number
  type: string
  title: string
  image: string
}

export const endings = computed<Ending[]>(() => {
  const locale = state.value.settings.lang
  if (locale === 'ja') return endingsJaJson
  return endingsEnJson
})

export const STEAM_ACHIEVEMENTS = [
  'revenge',
  'imprisonment',
  'coma',
  'dragged-under',
  'a-night-without-nina',
  'ninas-duty',
  'the-end-with-nina',
  'the-dream-neml-had',
]

export const completeEnding = (endIndex: number) => {
  if (!state.value.completedEndings.includes(endIndex)) {
    state.value.completedEndings.push(endIndex)
    save()
  }
  const achievementKey = STEAM_ACHIEVEMENTS[endIndex]
  window.steamAPI?.getAchievement(achievementKey).then(result => {
    if (result) return
    window.steamAPI?.activateAchievement(achievementKey).then(res => {
      console.log(`Achievement activation result: ${achievementKey}:`, res)
    })
  })
}
