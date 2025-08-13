<script setup lang="ts">
import { Container, useScene } from 'phavuer'
import { watch, type PropType } from 'vue'
import Speaker from './Speaker.vue'
import config from '../lib/config'
import type { SpeakerConfig } from '../story/types'
const emit = defineEmits(['end'])
const props = defineProps({
  speakers: {
    type: Array as PropType<SpeakerConfig[]>,
    required: true
  }
})
const scene = useScene()
watch(() => props.speakers, (newSpeakers, oldSpeakers) => {
  if (newSpeakers === oldSpeakers) return
  // TODO: tweenでフェードインアウトさせる
  const delay = Math.max(...newSpeakers.map(v => {
    const old = oldSpeakers.find(o => o.image === v.image)
    if (!old) return 0
    const oldX = Math.round(old.x * config.WIDTH)
    const newX = Math.round(v.x * config.WIDTH)
    return Math.abs(oldX - newX) * 1.5
  }))
  scene.time.addEvent({
    delay,
    callback: () => {
      emit('end')
    }
  })
})
emit('end')
</script>

<template>
  <Container>
    <Speaker :speaker="speaker" v-for="speaker in speakers" :key="speaker.image" />
  </Container>
</template>
