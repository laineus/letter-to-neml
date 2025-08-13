<script lang="ts">
import { Container, Image, type Phavuer } from 'phavuer'
import config from '../lib/config'
import { computed, ref, watch, type PropType } from 'vue'
import type { SpeakerConfig } from '../story/types'
</script>

<script setup lang="ts">
const props = defineProps({
  speaker: { type: Object as PropType<SpeakerConfig>, required: true }
})
const realX = computed(() => Math.round(props.speaker.x * config.WIDTH))
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
    :scale="0.5"
    :tween="tween"
  >
    <Image
      :texture="speaker.image"
      :origin="0.5"
      :scaleX="speaker.facing === 'left' ? 1 : -1"
    />
  </Container>
</template>
