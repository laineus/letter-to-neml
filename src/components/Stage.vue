<script setup lang="ts">
import { Container } from 'phavuer'
import {  type PropType } from 'vue'
import Speaker, { type SpeakerConfig } from './Speaker.vue'
defineProps({
  speakers: {
    type: Array as PropType<SpeakerConfig[]>,
    required: true
  }
})
</script>

<template>
  <Container>
    <Speaker :x="speaker.x" :image="speaker.image" v-for="speaker in speakers" :key="speaker.image" />
  </Container>
</template>
