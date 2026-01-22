<script setup lang="ts">
import { Container, Rectangle } from 'phavuer'
import config from '../lib/config'
import CustomText from './CustomText.vue'
import { endings } from '../story/endings'
import { computed, ref } from 'vue'
const emit = defineEmits(['click'])
const props = defineProps({
  endingIndex: Number
})
const ending = computed(() => endings.value.find(e => e.id === props.endingIndex)!)
const title = computed(() => `\"${ending.value.title}\"`)
const tweenIn = {
  alpha: { from: 0, to: 1, duration: 1000 }
}
const tweenOut = {
  alpha: { from: 1, to: 0, duration: 1000 },
  onComplete: () => {
    emit('click')
  }
}
const tapped = ref(false)
const tween = computed(() => (tapped.value ? tweenOut : tweenIn))
</script>

<template>
  <Container :x="config.WIDTH.half()" :y="config.HEIGHT.half()" :tween="tween">
    <Rectangle :width="config.WIDTH" :height="config.HEIGHT" :origin="0.5" :fillColor="0x000000" @pointerdown="tapped = true" />
    <CustomText :text="ending.type" :origin="0.5" :x="0" :y="-25" :style="{ fontSize: '30px' }" />
    <CustomText :text="title" :origin="0.5" :x="0" :y="25" :style="{ fontSize: '20px' }" />
  </Container>
</template>
