<script setup lang="ts">
import { Container, Image, Rectangle } from 'phavuer'

defineEmits(['click'])

const props = defineProps({
  icon: { type: String, required: true },
  size: { type: Number, default: 40 }
})
</script>

<template>
  <Container>
    <Rectangle :fillColor="0x000000" :strokeColor="0xFFFFFF" :lineWidth="2" :width="size" :height="size" :origin="0" @pointerdown="$emit('click')" />
    <Image :texture="`etc/${icon}`" :x="size.half()" :y="size.half() + 1" :origin="0.5" :scale="size / 90" />
  </Container>
</template>
