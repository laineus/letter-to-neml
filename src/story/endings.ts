import { save, state } from '../lib/state'
import endingsJson from './endings.ja.json' with { type: 'json' }
type Ending = {
  id: number
  type: string
  title: string
  image: string
}

export const endings = endingsJson as Ending[]

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
