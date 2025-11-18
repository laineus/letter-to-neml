<script lang="ts">
export type DialogOption = {
  text: string
  action?: () => any
  close?: boolean
};
</script>

<script setup lang="ts">
import { Container, Rectangle, Text } from 'phavuer'
import { computed, type PropType, ref } from 'vue'
import config from '../lib/config'
const emit = defineEmits(['select', 'close'])
const props = defineProps({
  title: { type: String, required: false },
  desc: { type: String, required: false },
  options: { type: Array as PropType<(string | DialogOption)[]>, default: () => [{ text: 'OK', close: true }] }
})
const width = 600
const optionHeight = 45
const optionMargin = 13
const windowPadding = 20
const windowHeight = computed(() => {
  const height = (props.options.length * optionHeight) + ((props.options.length - 1) * optionMargin) + (windowPadding * 2)
  return height + titleHeight.value + descHeight.value
})
const titleHeight = ref(0)
const onCreatedTitle = (text: Phaser.GameObjects.Text) => {
  titleHeight.value = text.height + 22
}
const descHeight = ref(0)
const onCreatedDesc = (text: Phaser.GameObjects.Text) => {
  descHeight.value = text.height + 23
}
const fixedOptions = computed(() => {
  return props.options.map(v => {
    if (typeof v === 'string') {
      return { text: v } as DialogOption
    }
    return v
  })
})
const onSelect = (v: DialogOption) => {
  v.action?.()
  v.close ? emit('close') : emit('select', v.text)
}
</script>

<template>
  <Container>
    <Rectangle :width="config.WIDTH" :height="config.HEIGHT" :fillColor="0x000000" :fillAlpha="0" :origin="0" @pointerdown="emit('close')" />
    <Container :x="config.WIDTH.half() - width.half()" :y="config.HEIGHT.half() - windowHeight.half()">
      <Rectangle :width="width" :height="windowHeight" :fillColor="0x000000" :alpha="0.7" :origin="0" @pointerdown="" />
      <Text v-if="title" @create="onCreatedTitle" :key="title" :x="width.half()" :y="23" :text="title" :originY="0" :originX="0.5" :lineSpacing="5" :padding="{ top: 3 }" :style="{ fontStyle: 'bold', fontSize: '22px', align: 'center', wordWrap: { width: width - 30, useAdvancedWrap: true } }" />
      <Text v-if="desc" @create="onCreatedDesc" :key="desc" :x="width.half()" :y="titleHeight + 23" :text="desc" :originY="0" :originX="0.5" :lineSpacing="7" :padding="{ top: 3 }" :style="{ fontSize: '20px', align: 'center', wordWrap: { width: width - 30, useAdvancedWrap: true } }" />
      <Container v-for="(v, i) in fixedOptions" :x="windowPadding" :y="windowPadding + (i * (optionHeight + optionMargin)) + titleHeight + descHeight">
        <Rectangle :width="width - 40" :height="optionHeight" :fillColor="0x000000" :fillAlpha="0" :origin="0" :strokeColor="0xAAAAAA" :lineWidth="2" @pointerdown="onSelect(v)" />
        <Text :x="(width - 20).half()" :y="23" :text="v.text" :origin="0.5" :padding="{ top: 3 }" :style="{ fontStyle: 'bold', fontSize: '22px', align: 'center' }" />
      </Container>
    </Container>
  </Container>
</template>
