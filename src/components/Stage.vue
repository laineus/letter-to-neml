<script setup lang="ts">
import { Container, useScene } from 'phavuer'
import { computed, watch, type PropType } from 'vue'
import Speaker from './Speaker.vue'
import config from '../lib/config'
import type { SpeakerConfig } from '../story/types'
import characters from '../story/characters'
const emit = defineEmits(['end'])
const props = defineProps({
  speakers: {
    type: Array as PropType<SpeakerConfig[]>,
    required: true
  },
  speaking: {
    type: String,
    required: false
  }
})
const currentSpeaker = computed(() => {
  if (!props.speaking) return
  const char = characters.find(c => c.name === props.speaking)
  if (!char) return
  return props.speakers.find(v => {
    return v.image.split('/')[1].startsWith(char.image!)
  })
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
    <Speaker :speaker="speaker" v-for="speaker in speakers" :key="speaker.image" :focus="!speaking || currentSpeaker === speaker" />
  </Container>
</template>
