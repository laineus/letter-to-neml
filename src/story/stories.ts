import { computed } from 'vue'
import storiesEnJson from './stories.en.json' with { type: 'json' }
import storiesJaJson from './stories.ja.json' with { type: 'json' }
import type { Story } from './types'
import { state } from '../lib/state'

export const stories = computed<Story[]>(() => {
  const locale = state.value.settings.lang
  if (locale === 'ja') return storiesJaJson as Story[]
  return storiesEnJson as Story[]
})
