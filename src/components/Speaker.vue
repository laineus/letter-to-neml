<script lang="ts">
import { Container, Image, type Phavuer } from 'phavuer'
import config from '../lib/config'
import { computed, ref, watch, type PropType } from 'vue'
import type { SpeakerConfig } from '../story/types'
</script>

<script setup lang="ts">
const props = defineProps({
  speaker: { type: Object as PropType<SpeakerConfig>, required: true },
  focus: { type: Boolean, default: false }
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
const baseImage = computed(() => props.speaker.image.split(':')[0])
const faceImage = computed(() =>  props.speaker.image.split(':')[1] ? props.speaker.image : undefined)
const SCALE = 0.55
</script>

<template>
  <Container
    :x="initX"
    :y="config.HEIGHT * SCALE"
    :scaleX="speaker.facing === 'right' ? SCALE : -SCALE"
    :scaleY="SCALE"
    :tween="tween"
  >
    <Image
      :texture="baseImage"
      :origin="0.5"
      :tint="focus ? 0xFFFFFF : 0x888888"
    />
    <Image
      v-if="faceImage"
      :texture="faceImage"
      :origin="0.5"
      :tint="focus ? 0xFFFFFF : 0x888888"
    />
  </Container>
</template>
