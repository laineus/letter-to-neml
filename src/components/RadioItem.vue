<script setup lang="ts">
import { Circle, Container, Rectangle } from 'phavuer'
import CustomText from './CustomText.vue'
const props = defineProps({
  text: { type: String, default: '' },
  active: { type: Boolean, default: false },
  width: { type: Number, default: 150 }
})
</script>

<template>
  <Container>
    <Rectangle :width="width" :height="32" :fillColor="0x000000" :fillAlpha="0" :origin="0" @pointerdown="$emit('click')" />
    <Circle :x="16" :y="16" :radius="8" :fillColor="0x000000" :strokeColor="0xFFFFFF" :lineWidth="2.5" />
    <Circle :x="16" :y="16" :radius="4" :fillColor="0xFFFFFF" :visible="active" />
    <CustomText :x="36" :y="16" :originX="0" :originY="0.5" :text="text" :style="{ fontSize: 16, shadow: { blur: 5, color: '#000', offsetX: 0, offsetY: 0, fill: true } }" />
  </Container>
</template>
