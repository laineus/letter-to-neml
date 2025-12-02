<script lang="ts">
import { Container } from 'phavuer'
import ThingComponent from './Thing.vue'
import type { PropType } from 'vue'
import type { Thing } from '../story/types'
</script>

<script setup lang="ts">
defineEmits(['select'])
const props = defineProps({
  things: { type: Array as PropType<Thing[]>, required: true }
})
</script>

<template>
  <Container :depth="2000">
    <ThingComponent v-for="thing in things" :key="thing.name" :thing="thing" @pointerdown="$emit('select', thing)" />
  </Container>
</template>
