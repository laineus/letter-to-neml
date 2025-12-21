<script setup lang="ts">
import { Container, useScene } from 'phavuer'
import EndingTitle from './EndingTitle.vue'
import EndingCredit from './EndingCredit.vue'
import Fade from './Fade.vue'
import { ref } from 'vue'
const emit = defineEmits(['end'])
const props = defineProps({
  endingIndex: { type: Number, required: true }
})
const scene = useScene()
const prepared = ref(false)
const showCredit = ref(props.endingIndex >= 7)
const onComplete = () => {
  scene.time.addEvent({
    delay: 1500,
    callback: () => {
      emit('end')
    }
  })
}
</script>

<template>
  <Container>
    <Fade :fade="{ type: 'fade', fade: 'in', duration: 3000 }" @end="prepared = true" />
    <template v-if="prepared">
      <EndingCredit v-if="showCredit" :endingIndex="props.endingIndex" @end="showCredit = false" />
      <EndingTitle v-else :endingIndex="props.endingIndex" @click="onComplete" />
    </template>
  </Container>
</template>
