import { computed } from 'vue'
import { state } from '../lib/state'
import thingsEnJson from './things.en.json' with { type: 'json' }
import thingsJaJson from './things.ja.json' with { type: 'json' }
import thingsCnJson from './things.cn.json' with { type: 'json' }
import type { Thing } from './types'

export const things = computed<Thing[]>(() => {
  const locale = state.value.settings.lang
  if (locale === 'ja') return thingsJaJson
  if (locale === 'cn') return thingsCnJson
  return thingsEnJson
})

export const thingDefinitions: Record<string, string[]> = {
  '削除': [],
  '自宅:デフォルト': ['home-1', 'home-2', 'home-3', 'home-4', 'home-6', 'home-7'],
  '自宅:ビン有り': ['home-1', 'home-2', 'home-3', 'home-4', 'home-5', 'home-6', 'home-7'],
  '市場:デフォルト': ['stall-1', 'stall-2'],
  '市場:ボロくわえ': ['stall-1', 'stall-3'],
  '市場:ボロ無し': ['stall-1'],
  '薬局:デフォルト': ['apothecary-1', 'apothecary-2', 'apothecary-3', 'apothecary-4', 'apothecary-5'],
  '浜辺:デフォルト': ['shore-1', 'shore-2', 'shore-3'],
  '浜辺:コンパス無し': ['shore-2', 'shore-3'],
  'ウルフリックの家:デフォルト': ['wulfric-home-1', 'wulfric-home-2', 'wulfric-home-3']
}
