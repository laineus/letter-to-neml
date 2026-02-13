import { computed } from 'vue'
import uiJaJson from './ui.ja.json' with { type: 'json' }
import uiEnJson from './ui.en.json' with { type: 'json' }
import uiCnJson from './ui.cn.json' with { type: 'json' }
import { state } from './state'

export const uiTexts = computed(() => {
  if (state.value.settings.lang === 'ja') return uiJaJson
  if (state.value.settings.lang === 'cn') return uiCnJson
  return uiEnJson
})
