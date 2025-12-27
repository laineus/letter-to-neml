<script setup lang="ts">
import { computed } from 'vue'
import { Container, Rectangle } from 'phavuer'
import CustomText from './CustomText.vue'

defineEmits(['click'])

const props = defineProps({
  active: { type: Boolean, default: false },
  text: { type: String, required: true },
  size: { type: Number, default: 20 },
  width: { type: Number, default: 320 },
  origin: { type: Number, default: 0 },
  outline: { type: Boolean, default: true }
})
const fontSize = computed(() => {
  return `${props.size}px`
})
const height = computed(() => {
  return props.size + props.size
})
</script>

<template>
  <Container>
    <Rectangle :fillColor="active ? 0x66bb00 : 0x000000" :strokeColor="0xFFFFFF" :fillAlpha="0.3" :lineWidth="outline ? 2 : 0" :width="width" :height="height" :origin="origin" @pointerdown="$emit('click')" />
    <CustomText :text="text" :padding="{ top: 1 }" :style="{ fontSize, fontStyle: 'bold' }" :x="width * (0.5 - origin)" :y="height * (0.5 - origin)" :origin="0.5" />
  </Container>
</template>
