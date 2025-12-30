<script setup lang="ts">
import { Container, Rectangle } from 'phavuer'
import { computed } from 'vue'
import { useUISound } from '../lib/se'
const props = defineProps({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  origin: { type: Number, default: 0 },
  width: { type: Number, default: 400 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 }
})
const se = useUISound()
const height = 10
const model = defineModel({ type: Number, required: true })
const percentage = computed(() => {
  return ((model.value - props.min) / (props.max - props.min))
})
let pointerdownX = 0
const pointerdown = (pointer: Phaser.Input.Pointer, localX: number) => {
  pointerdownX = localX
  drag(pointer, 0)
}
const drag = (_: Phaser.Input.Pointer, dragX: number) => {
  const relativeX = props.width - (props.width - (pointerdownX + dragX))
  const rawValue = props.min + (relativeX / props.width) * (props.max - props.min)
  const stepValue = Math.round(rawValue / props.step) * props.step
  const fixedValue = Math.min(props.max, Math.max(props.min, stepValue))
  if (fixedValue === model.value) return
  model.value = fixedValue
  se.select()
}
const containerX = computed(() => props.x - (props.width * props.origin))
const containerY = computed(() => props.y - ((height + 10) * props.origin))
</script>

<template>
  <Container :x="containerX" :y="containerY">
    <Rectangle :origin="0" :width="width + 20" :height="height + 20" :x="-10" :y="-10" :fillColor="0x000000" :alpha="0.001" @drag="drag" @pointerdown="pointerdown" />
    <Rectangle :origin="0" :width="width" :height="height" :radius="2" :fillColor="0x000000" :alpha="0.4" />
    <Rectangle :origin="0" :width="width * percentage" :height="height" :radius="2" :fillColor="0x77bb00" />
    <Rectangle
      :x="percentage * width"
      :y="height / 2"
      :width="12"
      :height="height + 10"
      :radius="2"
      :fillColor="0xffffff"
      :origin="0.5" />
  </Container>
</template>
