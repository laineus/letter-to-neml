import type { Branch } from '../story/types'
import { state } from './state'
type ifFunctions = {
  [key: string]: () => boolean
}
const getBranch = (code: number): Branch => {
  const branches = state.value.current?.branches || []
  const v = branches.find(v => v.code === code)
  if (!v) throw new Error(`Branch not found: ${code}`)
  return v
}
export const useIfFunctions = () => {
  const ifFunctions: ifFunctions = {
    'ウルフリックにナイフで抵抗': () => {
      return getBranch(103).result
    },
    'ウルフリックに無抵抗': () => {
      return !ifFunctions['ウルフリックにナイフで抵抗']()
    },
    'じょうけん1': () => true,
    'じょうけん2': () => false,
    'じょうけん3': () => true,
    'じょうけん4': () => false,
    'じょうけん1と2': () => ifFunctions['じょうけん1']() && ifFunctions['じょうけん2'](),
    'じょうけん1か2': () => ifFunctions['じょうけん1']() || ifFunctions['じょうけん2']()
  }
  return ifFunctions
}
