<script setup lang="ts">
import { Container, Rectangle, Text } from 'phavuer'
import { computed } from 'vue'
import config from '../lib/config'
const padding = 20
const width = computed(() => config.WIDTH - padding * 2)
const height = 300
const windowPadding = 20
const fontSize = 22
defineProps<{
  text: string
}>()
</script>

<template>
  <Container :x="padding" :y="config.HEIGHT - height - padding" :depth="200">
    <Rectangle :origin="0" :width="width" :height="height" :fillColor="0x333333" :alpha="0.7" />
    <Text :text="text" :x="windowPadding" :y="windowPadding" :origin="0" :lineSpacing="fontSize * 0.7" :padding="{ top: 2 }" :style="{ fontSize, wordWrap: { width: width - (windowPadding * 2), useAdvancedWrap: true } }" />
  </Container>
</template>
