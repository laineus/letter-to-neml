import thingsJson from './things.json' with { type: 'json' }
import type { Thing } from './types'

export const things = thingsJson as Thing[]

export const thingDefinitions: Record<string, string[]> = {
  '削除': [],
  '自宅:デフォルト': ['home-1', 'home-2', 'home-3', 'home-4', 'home-5', 'home-6'],
  '市場:デフォルト': ['stall-1', 'stall-2', 'stall-3'],
  '薬局:デフォルト': ['apothecary-1', 'apothecary-2', 'apothecary-3', 'apothecary-4', 'apothecary-5'],
  '浜辺:デフォルト': ['shore-1', 'shore-2', 'shore-3'],
  'ウルフリックの家:デフォルト': ['wulfric-home-1', 'wulfric-home-2', 'wulfric-home-3']
}
