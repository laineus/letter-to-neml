<script setup lang="ts">
import { Container, Rectangle, useGame, FxBlur, useScene } from 'phavuer'
import CustomText from './CustomText.vue'
import { computed, ref } from 'vue'
import { save, state } from '../lib/state'
import config from '../lib/config'
import Button from './Button.vue'
import Slider from './Slider.vue'
import RadioList from './RadioList.vue'
import Dialog from './Dialog.vue'
import { useGamePad } from '../lib/gamePad'
import { uiTexts } from '../lib/ui'
import { useUISound } from '../lib/se'

 const emit = defineEmits(['close'])
const props = defineProps({
  showBackToTitle: { type: Boolean, default: false },
  showDataReset: { type: Boolean, default: false }
})

type ConfigType = 'bgm' | 'lang' | 'backToTitle' | 'dataReset' | 'submit'
const configTypes = computed<ConfigType[]>(() => {
  return [
    'bgm',
    'lang',
    ...(props.showBackToTitle ? ['backToTitle'] : []),
    ...(props.showDataReset ? ['dataReset'] : []),
    'submit'
  ] as ConfigType[]
})

const game = useGame()
const scene = useScene()
const volume = computed({
  get: () => state.value.settings.volume * 100,
  set: (value: number) => {
    state.value.settings.volume = value / 100
    game.sound.volume = state.value.settings.volume
    save()
  }
})
const lang = computed({
  get: () => state.value.settings.lang,
  set: (value: string) => {
    state.value.settings.lang = value
    save()
  }
})

const confirmBackToTitle = ref(false)
const backToTitle = () => {
  se.click()
  scene.scene.start('TitleScene')
}
const confirmReset = ref(false)
const resetData = () => {
  se.click()
  localStorage.removeItem('saveData')
  window.location.reload()
}

const se = useUISound()

const gamePad = useGamePad()
gamePad.onPress(key => {
  if (confirmBackToTitle.value || confirmReset.value) return
  if (key === 'b') {
    se.cancel()
    emit('close')
  } else if (key === 'down' || key === 'up') {
    const direction = key === 'down' ? 1 : -1
    if (selectedType.value === undefined) {
      selectedType.value = configTypes.value[0]
    } else {
      const currentIndex = configTypes.value.indexOf(selectedType.value)
      const nextIndex = (currentIndex + direction + configTypes.value.length) % configTypes.value.length
      selectedType.value = configTypes.value[nextIndex]
    }
    se.select()
  }
  if (selectedType.value === 'bgm') {
    if (key === 'left') {
      volume.value = Math.max(volume.value - 10, 0)
    } else if (key === 'right') {
      volume.value = Math.min(volume.value + 10, 100)
    }
    se.select()
  } else if (selectedType.value === 'lang') {
    if (key === 'left') {
      lang.value = 'ja'
    } else if (key === 'right') {
      lang.value = 'en'
    }
    se.select()
  } else if (key === 'a') {
    if (selectedType.value === 'backToTitle') {
      confirmBackToTitle.value = true
    } else if (selectedType.value === 'dataReset') {
      confirmReset.value = true
    } else if (selectedType.value === 'submit') {
      emit('close')
    }
    se.click()
  }
})
gamePad.onDeactivate(() => {
  selectedType.value = undefined
})

const selectedType = ref<ConfigType | undefined>(gamePad.active ? 'bgm' : undefined)
</script>

<template>
  <Container>
    <Rectangle :width="config.WIDTH" :height="config.HEIGHT" :origin="0" :fillAlpha="0" @pointerdown="$emit('close'), se.click()" />
    <Dialog
      v-if="confirmBackToTitle"
      :title="uiTexts.common.confirm"
      :desc="uiTexts.settings.confirmBackToTitle"
      :options="[{ text: uiTexts.common.ok, action: backToTitle }, { text: uiTexts.common.cancel, close: true }]"
      @close="confirmBackToTitle = false"
    />
    <Dialog
      v-else-if="confirmReset"
      :title="uiTexts.common.confirm"
      :desc="uiTexts.settings.confirmResetData"
      :options="[{ text: uiTexts.common.ok, action: resetData }, { text: uiTexts.common.cancel, close: true }]"
      @close="confirmReset = false"
    />
    <Container v-else :x="config.WIDTH.half()" :y="config.HEIGHT.half()" :tween="{ alpha: { from: 0, to: 1 }, duration: 300 }">
      <Rectangle :width="500" :height="420" :fillColor="0x000000" :alpha="0.6" :origin="0.5" :radius="0" @pointerdown="">
        <FxBlur :strength="1.5" :quality="1" :steps="4" />
      </Rectangle>
      <CustomText :text="uiTexts.common.settings" :style="{ fontSize: 24, shadow: { blur: 10, color: '#000', offsetX: 0, offsetY: 0, fill: true } }" :origin="0.5" :y="-160" />
      <!-- BGM音量 -->
      <CustomText :text="uiTexts.settings.bgmVolume" :style="{ fontSize: 19, shadow: { blur: 5, color: '#000', offsetX: 0, offsetY: 0, fill: true } }" :origin="0.5" :y="-100" />
      <Slider :x="0" :y="-60" :origin="0.5" v-model="volume" :max="100" :min="0" :step="10" :width="230" />
      <Rectangle v-if="selectedType === 'bgm'" :x="0" :y="-65" :width="260" :height="35" :origin="0.5" :strokeColor="0x66bb00" :lineWidth="2" />
      <!-- 言語設定 -->
      <CustomText text="Language" :style="{ fontSize: 19, shadow: { blur: 5, color: '#000', offsetX: 0, offsetY: 0, fill: true } }" :origin="0.5" :y="-20" />
      <RadioList :x="-100" :y="5" :list="[{ text: '日本語', value: 'ja' }, { text: 'English', value: 'en' }]" v-model="lang" />
      <Rectangle v-if="selectedType === 'lang'" :x="0" :y="21" :width="210" :height="35" :origin="0.5" :strokeColor="0x66bb00" :lineWidth="2" />
      <!-- タイトルに戻る -->
      <Button v-if="showBackToTitle" :active="selectedType === 'backToTitle'" :text="uiTexts.settings.backToTitle" :size="15" :width="240" :x="0" :y="80" :origin="0.5" :outline="false" @click="confirmBackToTitle = true, se.click()" />
      <!-- データリセット -->
      <Button v-if="showDataReset" :active="selectedType === 'dataReset'" :text="uiTexts.settings.resetAllData" :size="15" :width="240" :x="0" :y="80" :origin="0.5" :outline="false" @click="confirmReset = true, se.click()" />
      <!-- 決定 -->
      <Button :active="selectedType === 'submit'" :text="uiTexts.common.ok" :width="420" :x="0" :y="150" :origin="0.5" @click="$emit('close'), se.click()" />
    </Container>
  </Container>
</template>
