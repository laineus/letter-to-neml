import charactersJaJson from './characters.ja.json' with { type: 'json' }
import charactersEnJson from './characters.en.json' with { type: 'json' }
import charactersCnJson from './characters.cn.json' with { type: 'json' }
import { computed } from 'vue'
import { state } from '../lib/state'
export type Character = {
  name: string
  image: string
}

export const characters = computed<Character[]>(() => {
  const locale = state.value.settings.lang
  if (locale === 'ja') return charactersJaJson as Character[]
  if (locale === 'cn') return charactersCnJson as Character[]
  return charactersEnJson as Character[]
})
