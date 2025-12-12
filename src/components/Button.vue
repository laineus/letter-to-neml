<script setup lang="ts">
import { computed } from 'vue'
import { Container, Rectangle } from 'phavuer'
import CustomText from './CustomText.vue'

defineEmits(['click'])

const props = defineProps({
  text: { type: String, required: true },
  size: { type: Number, default: 24 },
  width: { type: Number, default: 320 }
})
const fontSize = computed(() => {
  return `${props.size}px`
})
const height = computed(() => {
  return props.size + 20
})
</script>

<template>
  <Container>
    <Rectangle :fillColor="0x000000" :strokeColor="0xFFFFFF" :lineWidth="2" :width="width" :height="height" :origin="0" @pointerdown="$emit('click')" />
    <CustomText :text="text" :padding="{ top: 1 }" :style="{ fontSize, fontStyle: 'bold' }" :x="width.half()" :y="height.half() + 1" :origin="0.5" />
  </Container>
</template>
