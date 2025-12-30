<script lang="ts">
import { Container, FxBlur, Rectangle } from 'phavuer'
import { computed, type PropType, ref } from 'vue'
import config from '../lib/config'
import CustomText from './CustomText.vue'
import Button from './Button.vue'
import { uiTexts } from '../lib/ui'
import { useUISound } from '../lib/se'
export type DialogOption = {
  text: string
  action?: () => any
  close?: boolean
}
type DialogData = {
  title?: string
  desc?: string
  options: DialogOption[]
}
export const useDialogs = () => {
  const dialogs = ref<DialogData[]>([])
  const show = (dialog: DialogData) => {
    dialogs.value.push(dialog)
  }
  const close = () => {
    dialogs.value.shift()
  }
  const currentDialog = computed(() => {
    return dialogs.value[0]
  })
  return {
    get list() {
      return dialogs.value
    },
    get current() {
      return currentDialog.value
    },
    show,
    close
  }
}
</script>

<script setup lang="ts">
import { useGamePad } from '../lib/gamePad'

const emit = defineEmits(['select', 'close'])
const props = defineProps({
  title: { type: String, required: false },
  desc: { type: String, required: false },
  options: { type: Array as PropType<(string | DialogOption)[]>, default: () => [{ text: uiTexts.value.common.ok, close: true }] }
})
const se = useUISound()
const width = 600
const optionHeight = 40
const optionMargin = 16
const windowPadding = 40
const windowHeight = computed(() => {
  const height = (props.options.length * optionHeight) + ((props.options.length - 1) * optionMargin) + (windowPadding * 2)
  return height + titleHeight.value + descHeight.value
})
const titleHeight = ref(0)
const onCreatedTitle = (text: Phaser.GameObjects.Text) => {
  titleHeight.value = text.height + 25
}
const descHeight = ref(0)
const onCreatedDesc = (text: Phaser.GameObjects.Text) => {
  descHeight.value = text.height + 35
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
  se.click()
}

const gamePad = useGamePad()
const selectedIndex = ref<number | undefined>(gamePad.active ? 0 : undefined)

gamePad.onPress(key => {
  if (key === 'b') {
    emit('close')
    se.cancel()
  } else if (key === 'down' || key === 'up') {
    const direction = key === 'down' ? 1 : -1
    if (selectedIndex.value === undefined) {
      selectedIndex.value = 0
    } else {
      const nextIndex = (selectedIndex.value + direction + fixedOptions.value.length) % fixedOptions.value.length
      selectedIndex.value = nextIndex
    }
    se.select()
  } else if (key === 'a') {
    if (selectedIndex.value !== undefined) {
      onSelect(fixedOptions.value[selectedIndex.value])
    }
  }
})

gamePad.onDeactivate(() => {
  selectedIndex.value = undefined
})
</script>

<template>
  <Container :tween="{ alpha: { from: 0, to: 1 }, duration: 300 }">
    <Rectangle :width="config.WIDTH" :height="config.HEIGHT" :fillColor="0x000000" :fillAlpha="0" :origin="0" @pointerdown="emit('close'), se.cancel()" />
    <Container :x="config.WIDTH.half() - width.half()" :y="config.HEIGHT.half() - windowHeight.half()">
      <Rectangle :width="width" :height="windowHeight" :fillColor="0x000000" :alpha="0.6" :origin="0" :radius="0" @pointerdown="">
        <!-- <FxBlur :strength="3" :quality="1" :steps="7" /> -->
        <FxBlur :strength="1.5" :quality="1" :steps="4" />
      </Rectangle>
      <CustomText v-if="title" @create="onCreatedTitle" :key="title" :x="width.half()" :y="40" :text="title" :originY="0" :originX="0.5" :lineSpacing="16" :padding="{ top: 3 }" :style="{ fontStyle: 'bold', fontSize: '22px', align: 'center', wordWrap: { width: width - 65, useAdvancedWrap: true } }" />
      <CustomText v-if="desc" @create="onCreatedDesc" :key="desc" :x="width.half()" :y="titleHeight + 40" :text="desc" :originY="0" :originX="0.5" :lineSpacing="15" :padding="{ top: 3 }" :style="{ fontSize: '20px', align: 'center', wordWrap: { width: width - 65, useAdvancedWrap: true } }" />
      <Container v-for="(v, i) in fixedOptions" :x="windowPadding" :y="windowPadding + (i * (optionHeight + optionMargin)) + titleHeight + descHeight">
        <Button :active="selectedIndex === i" :text="v.text" :width="width - (windowPadding * 2)" :height="optionHeight" :size="20" :origin="0" @click="onSelect(v)" />
      </Container>
    </Container>
  </Container>
</template>
