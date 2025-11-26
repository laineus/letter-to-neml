<script lang="ts">
import { Container } from 'phavuer'
import { computed } from 'vue'
import type { Thing } from './Thing.vue'
import ThingComponent from './Thing.vue'
const THINGS: { [key: string]: Thing[] } = {
  'bg/home': [
    { x: 0.2, y: 0.47, name: '本', desc: '本です' },
    { x: 0.15, y: 0.75, name: 'ベッドの下', desc: '護身用のナイフが隠されている' }
  ]
}
</script>

<script setup lang="ts">
defineEmits(['select'])
const props = defineProps({
  place: { type: String, required: true }
})
const things = computed(() => THINGS[props.place] || [])
</script>

<template>
  <Container :depth="2000">
    <ThingComponent v-for="thing in things" :key="thing.name" :thing="thing" @pointerdown="$emit('select', thing)" />
  </Container>
</template>
