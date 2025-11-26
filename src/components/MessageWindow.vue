<script setup lang="ts">
import { Container, Rectangle, Text, FxBlur, Line } from 'phavuer'
import { computed } from 'vue'
import config from '../lib/config'
import { state } from '../lib/state'
const titleSize = 19
const fontSize = 22
const props = defineProps<{
  title?: string
  text: string
}>()
const viewMessage = computed(() => {
  const branches = state.value.current?.branches || []
  return branches.reduce((t, branch) => {
    return t.replace(new RegExp(`{ref:${branch.code}}`, 'g'), branch.ref)
  }, props.text)
})
</script>

<template>
  <Container :x="config.WIDTH / 2" :y="(120).byBottom()" :depth="6000">
    <Rectangle :origin="0.5" :width="config.WIDTH" :height="240" :fillColor="0x000000" :alpha="0.7">
      <FxBlur :strength="3" :quality="1" :steps="7" />
    </Rectangle>
    <template v-if="title">
      <Text :text="title" :x="0" :y="-50" :origin="0.5" :lineSpacing="titleSize * 0.7" :padding="{ top: 2 }" :style="{ fontSize: titleSize, align: 'center', wordWrap: { width: config.WIDTH - 100, useAdvancedWrap: true } }" />
      <Line :x="0" :y="-25" :x1="0" :y1="0" :x2="160" :y2="0" :originX="0.5" :originY="0" :lineWidth="1.7" :strokeColor="0xFFFFFF">
        <FxBlur :strength="3" :quality="1" :steps="7" :x="5" :y="0" />
      </Line>
    </template>
    <Text :text="viewMessage" :x="0" :y="0" :originX="0.5" :originY="0" :lineSpacing="fontSize * 0.7" :padding="{ top: 2 }" :style="{ fontSize, align: 'center', wordWrap: { width: config.WIDTH - 100, useAdvancedWrap: true } }" />
  </Container>
</template>
