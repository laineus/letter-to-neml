<script lang="ts">
import { Container, Image, type Phavuer } from 'phavuer'
import config from '../lib/config'
import { computed, ref, watch } from 'vue'
export type SpeakerConfig = {
  x: number
  image: string
}
</script>

<script setup lang="ts">
const props = defineProps({
  image: { type: String, required: true },
  x: { type: Number, required: true }
})
const realX = computed(() => Math.round(props.x * config.WIDTH))
const initX = realX.value
const tween = ref<Phavuer.TweenConfig>()
watch(realX, (newX, oldX) => {
  tween.value = {
    props: {
      x: newX
    },
    ease: 'Quad.easeOut',
    duration: Math.abs(newX - oldX) * 1.5
  }
})
</script>

<template>
  <Container
    :x="initX"
    :y="config.HEIGHT * 0.65"
    :scale="0.6"
    :tween="tween"
  >
    <Image
      :texture="image"
      :origin="0.5"
    />
  </Container>
</template>
