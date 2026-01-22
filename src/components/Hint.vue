<script lang="ts">
import { computed } from 'vue'
import Button from './Button.vue'
import { state } from '../lib/state'
import { useIfFunctions } from '../lib/ifFunctions'
import hintsEnJson from '../story/hints.en.json' with { type: 'json' }
import hintsJaJson from '../story/hints.ja.json' with { type: 'json' }
import { Circle, Container } from 'phavuer'
import { uiTexts } from '../lib/ui'
export const useHint = () => {
  const hints = computed<string[]>(() => {
    const locale = state.value.settings.lang
    if (locale === 'ja') return hintsJaJson
    return hintsEnJson
  })
  const ifFunctions = useIfFunctions()
  const currentHintIndex = computed(() => {
    const completedEndings = state.value.completedEndings
    // いずれのゲームオーバーにも達していない
    if (!completedEndings.length) return 2
    // トゥルーエンド到達済み
    if (completedEndings.includes(7)) return undefined
    // ノーマルエンド到達済み
    if (completedEndings.includes(6)) {
      if (ifFunctions['グッドエンド']()) return 1 // 達成済み
      return 7
    }
    // バッドエンド(ニーナの使命)到達済み
    if (completedEndings.includes(5)) {
      if (ifFunctions['悪夢予防薬を片付ける']()) return 1 // 達成済み
      return 6
    }
    // バッドエンド(ニーナのいない夜)到達済み
    if (completedEndings.includes(4)) {
      if (ifFunctions['お姉さんに精神安定剤をあげる']()) return 1 // 達成済み
      if (ifFunctions['ボロがカスラの実を吐き出す']()) return 5
      return 4
    }
    // いずれのエンドにも達していない
    return 3
  })
  const currentHint = computed(() => {
    const index = currentHintIndex.value
    if (index === undefined) return hints.value[0]
    return hints.value[index]
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
defineProps({
  active: { type: Boolean, default: false }
})
const hint = useHint()
const unread = computed(() => {
  return hint.currentHintIndex && !state.value.checkedHints.includes(hint.currentHintIndex)
})
</script>

<template>
  <Container>
    <Button :active="active" :text="uiTexts.story.hint" :size="18" :width="120" @click="$emit('click')" />
    <Circle v-if="unread" :x="94" :y="12"  :radius="5" :fillColor="0xFF0000" />
  </Container>
</template>
