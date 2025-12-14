<script lang="ts">
import { computed } from 'vue'
import Button from './Button.vue'
import { state } from '../lib/state'
import { useIfFunctions } from '../lib/ifFunctions'
import hintsJson from '../story/hints.json' with { type: 'json' }
import { Circle, Container } from 'phavuer'
export const useHint = () => {
  const hints = hintsJson as string[]
  const ifFunctions = useIfFunctions()
  const currentHintIndex = computed(() => {
    const completedEndings = state.value.completedEndings
    // いずれのゲームオーバーにも達していない
    if (!completedEndings.length) return 1
    // トゥルーエンド到達済み
    if (completedEndings.includes(7)) return undefined
    // ノーマルエンド到達済み
    if (completedEndings.includes(6)) return 6
    // バッドエンド(ニーナの使命)到達済み
    if (completedEndings.includes(5)) return 5
    // バッドエンド(ニーナのいない夜)到達済み
    if (completedEndings.includes(4)) {
      if (ifFunctions['ボロがカスラの実を吐き出す']()) return 4
      return 3
    }
    // いずれのエンドにも達していない
    return 2
  })
  const currentHint = computed(() => {
    const index = currentHintIndex.value
    if (index === undefined) return hints[0]
    return hints[index]
  })
  return {
    get currentHintIndex() {
      return currentHintIndex.value
    },
    get currentHint() {
      return currentHint.value
    }
  }
}
</script>

<script lang="ts" setup>
defineEmits(['click'])
const hint = useHint()
const unread = computed(() => {
  return hint.currentHintIndex && !state.value.checkedHints.includes(hint.currentHintIndex)
})
</script>

<template>
  <Container>
    <Button text="ヒント" :size="18" :width="120" @click="$emit('click')" />
    <Circle v-if="unread" :x="94" :y="12"  :radius="5" :fillColor="0xFF0000" />
    {{ hint.currentHintIndex }}
  </Container>
</template>
