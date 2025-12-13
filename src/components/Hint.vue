<script lang="ts">
import { computed } from 'vue'
import Button from './Button.vue'
import { state } from '../lib/state'
import { useIfFunctions } from '../lib/ifFunctions'
export const useHint = () => {
  const ifFunctions = useIfFunctions()
  const currentHint = computed(() => {
    const completedEndings = state.value.completedEndings
    // いずれのゲームオーバーにも達していない
    if (!completedEndings.length) {
      return 'まずは物語を見届けよう'
    }
    // トゥルーエンド到達済み
    if (completedEndings.includes(7)) {
      return '表示できるヒントはありません'
    }
    // ノーマルエンド到達済み
    if (completedEndings.includes(6)) {
      return 'ノクタリアンであるネムルは奇跡を起こせるかもしれない\n'
    }
    // バッドエンド(ニーナの使命)到達済み
    if (completedEndings.includes(5)) {
      return 'ウルフリックはなぜ心変わりしてネムルを襲ったんだろう？\nウルフリックの心変わりにつながった原因を探して排除しよう'
    }
    // バッドエンド(ニーナのいない夜)到達済み
    if (completedEndings.includes(4)) {
      if (ifFunctions['ボロがカスラの実を吐き出す']()) {
        return 'お姉さんは何か困っていたのかもしれない\nお姉さんが必要としているものをどうやったら手に入れられるだろうか'
      }
      return '行商が持っていたカスラの実はどこにいったんだろう？\nカスラの実がなくなる前後の状況をよく観察しよう'
    }
    // いずれのエンドにも達していない
    return 'ネムルの赤文字のセリフに注目し、\nネムルの行動を変えるためのメッセージを手紙に書き加えよう'
  })
  return {
    get currentHint() {
      return currentHint.value
    }
  }
}
</script>

<script lang="ts" setup>
// empty
</script>

<template>
  <Button text="ヒント" />
</template>
