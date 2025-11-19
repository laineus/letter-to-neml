<script lang="ts">
import { Circle, Container } from 'phavuer'
import { type PropType, defineEmits, defineProps } from 'vue'
import config from '../lib/config'
export type Thing = {
  x: number
  y: number
  name: string
  desc: string
}
const tween = {
  duration: 1800,
  props: {
    scale: { from: 0.3, to: 1 },
    alpha: { from: 0.5, to: 0 }
  },
  repeat: -1,
  ease: 'Sine.easeInOut'
}
</script>

<script setup lang="ts">
const emit = defineEmits(['select'])
const props = defineProps({
  thing: { type: Object as PropType<Thing>, required: true }
})
</script>

<template>
  <Container
    :x="thing.x * config.WIDTH"
    :y="thing.y * config.HEIGHT"
    :width="70"
    :height="70"
  >
    <Circle
      :key="thing.name"
      :origin="0.5"
      :radius="10"
      :fillColor="0xEE3300"
      :alpha="0.5"
    />
    <Circle
      :key="thing.name"
      :origin="0.5"
      :radius="30"
      :fillColor="0xEE3300"
      :alpha="0.3"
      :tween="tween"
    />
  </Container>
</template>
