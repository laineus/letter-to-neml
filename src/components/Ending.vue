<script setup lang="ts">
import { Container } from 'phavuer'
import EndingTitle from './EndingTitle.vue'
import EndingCredit from './EndingCredit.vue'
import Fade from './Fade.vue'
import { ref } from 'vue'
import { useGamePad } from '../lib/gamePad'
const emit = defineEmits(['end'])
const props = defineProps({
  endingIndex: { type: Number, required: true }
})
const prepared = ref(false)
const showCredit = ref(props.endingIndex >= 7)
const fadeout = ref(false)
const onComplete = () => {
  fadeout.value = true
}
const gamePad = useGamePad()
gamePad.onPress(key => {
  if (prepared.value && key === 'a') {
    onComplete()
  }
})
</script>

<template>
  <Container>
    <Fade :fade="{ type: 'fade', fade: 'in', duration: 3000 }" @end="prepared = true" />
    <Fade v-if="fadeout" :fade="{ type: 'fade', fade: 'in', duration: 2000 }" @end="emit('end')" />
    <template v-if="prepared">
      <EndingCredit v-if="showCredit" :endingIndex="props.endingIndex" @end="showCredit = false" />
      <EndingTitle v-else :endingIndex="props.endingIndex" @click="onComplete" />
    </template>
  </Container>
</template>
