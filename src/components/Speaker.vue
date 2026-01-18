<script lang="ts">
import { Container, Image, type Phavuer } from 'phavuer'
import config from '../lib/config'
import { computed, ref, watch, type PropType } from 'vue'
import type { SpeakerConfig } from '../story/types'
const DEFAULT_SCALE = 0.55
const charaScale: Record<string, number> = {
  neml: 0.53,
  nina: 0.54,
  aunt: 0.57,
  trader: 0.57,
  shopkeeper: 0.57,
  guard: 0.57,
  doctor: 0.56,
  korrin: 0.53
}
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
const baseImage = computed(() => props.speaker.image.split('.')[0])
const charaKey = computed(() => baseImage.value.split('/').pop() ?? '')
const faceImage = computed(() =>  props.speaker.image.split('.')[1] ? props.speaker.image : undefined)
const scale = computed(() => charaScale[charaKey.value] ?? DEFAULT_SCALE)
</script>

<template>
  <Container
    :x="initX"
    :y="config.HEIGHT + 70"
    :scaleX="speaker.facing === 'right' ? scale : -scale"
    :scaleY="scale"
    :tween="tween"
  >
    <Image
      :texture="baseImage"
      :originX="0.5"
      :originY="1"
      :tint="focus ? 0xFFFFFF : 0x888888"
    />
    <Image
      v-if="faceImage"
      :texture="faceImage"
      :originX="0.5"
      :originY="1"
      :tint="focus ? 0xFFFFFF : 0x888888"
    />
  </Container>
</template>
