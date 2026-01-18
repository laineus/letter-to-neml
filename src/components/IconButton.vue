<script setup lang="ts">
import { Container, Image, Rectangle } from 'phavuer'

defineEmits(['click'])

const props = defineProps({
  active: { type: Boolean, default: false },
  icon: { type: String, required: true },
  size: { type: Number, default: 40 }
})
</script>

<template>
  <Container>
    <Rectangle
      :fillColor="active ? 0x66bb00 : 0x000000"
      :fillAlpha="active ? 0.6 : 0.3"
      :strokeColor="0xFFFFFF"
      :lineWidth="2"
      :width="size"
      :height="size"
      :origin="0"
      @pointerdown="$emit('click')"
    />
    <Image :texture="`etc/${icon}`" :x="size.half()" :y="size.half() + 1" :origin="0.5" :scale="size / 90" />
  </Container>
</template>
