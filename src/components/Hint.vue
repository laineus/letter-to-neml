<script lang="ts">
import { computed } from 'vue'
import Button from './Button.vue'
import { state } from '../lib/state'
import { useIfFunctions } from '../lib/ifFunctions'
export const useHint = () => {
  const currentHint = computed(() => {
    state.value
    const ifFunctions = useIfFunctions()
    if (ifFunctions['ウルフリックに無抵抗']()) return 'ナイフで倒せ'
    return 'ビンを隠せ'
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
