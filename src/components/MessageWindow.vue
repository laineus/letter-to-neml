<script setup lang="ts">
import { Container, Rectangle, FxBlur, Line } from 'phavuer'
import { computed, watch } from 'vue'
import config from '../lib/config'
import { state } from '../lib/state'
import CustomText from './CustomText.vue'
import { useUISound } from '../lib/se'
const titleSize = 20
const fontSize = 21
const props = defineProps<{
  title?: string
  text: string
}>()
const viewMessage = computed(() => {
  const branches = state.value.current?.branches || []
  return branches.reduce((t, branch) => {
    return t.replace(new RegExp(`{ref:${branch.code}}`, 'g'), branch.ref ?? '-')
  }, props.text).replace(new RegExp(`{red}`, 'g'), '')
})
const red = computed(() => props.text.includes('{red}'))
const green = computed(() => props.text.includes('{ref:'))
const color = computed(() => {
  if (red.value) return '#FF3300'
  if (green.value) return '#77FF11'
  return '#FFFFFF'
})
const se = useUISound()
watch(viewMessage, () => {
  if (viewMessage.value && props.title) {
    se.talk()
  }
}, { immediate: true })
</script>

<template>
  <Container :x="config.WIDTH / 2" :y="(120).byBottom()" :depth="6000">
    <Rectangle :origin="0.5" :width="config.WIDTH" :height="240" :fillColor="0x000000" :alpha="0.7">
      <FxBlur :strength="3" :quality="1" :steps="7" />
    </Rectangle>
    <template v-if="title">
      <CustomText :text="title" :x="0" :y="-70" :origin="0.5" :lineSpacing="titleSize * 0.65" :padding="{ top: 3 }" :style="{ fontSize: titleSize, align: 'center', wordWrap: { width: config.WIDTH - 100, useAdvancedWrap: true } }" />
      <Line :x="0" :y="-45" :x1="0" :y1="0" :x2="160" :y2="0" :originX="0.5" :originY="0" :lineWidth="1.7" :strokeColor="0xFFFFFF">
        <FxBlur :strength="3" :quality="1" :steps="7" :x="5" :y="0" />
      </Line>
    </template>
    <CustomText :text="viewMessage" :x="0" :y="-23" :originX="0.5" :originY="0" :lineSpacing="fontSize * 0.65" :padding="{ top: 2 }" :style="{ color, fontSize, align: 'center', wordWrap: { width: config.WIDTH - 100, useAdvancedWrap: true } }" />
  </Container>
</template>
